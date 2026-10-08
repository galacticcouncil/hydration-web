"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { MotionValue } from "framer-motion";

const RIPPLE_COUNT = 12;
const DESKTOP_HERO_EFFECT_QUERY = "(min-width: 768px)";
const DEFAULT_TRANSITION_COLOR = [0.141, 0.055, 0.196] as const;

function subscribeToDesktopEffect(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_HERO_EFFECT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const desktopEffectEnabled = () => window.matchMedia(DESKTOP_HERO_EFFECT_QUERY).matches;
const serverEffectEnabled = () => false;

const HERO_RIPPLE_SETTINGS = {
  distortion: 4.72,
  light: 0.72,
  speed: 0.28,
  rippleSpeed: 1.28,
  rippleFade: 1.28,
  tail: 2.42,
  trailDensity: 0.5,
  edge: 3.56,
  cursorLag: 1.12,
  cursorArea: 0.1,
  cursorFalloff: 5.6,
  rippleArea: 0.2,
  rippleSmoothing: 0.7,
  chromaticAberration: 0.23,
} as const;

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform vec2 u_image_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;
  uniform float u_hover;
  uniform vec4 u_effects;
  uniform vec4 u_ripple_settings;
  uniform vec4 u_trail_settings;
  uniform vec4 u_area_settings;
  uniform float u_chromatic_aberration;
  uniform float u_transition_height;
  uniform vec3 u_transition_color;
  uniform vec4 u_ripples[${RIPPLE_COUNT}];

  varying vec2 v_uv;

  vec2 coverUv(vec2 uv) {
    float canvasRatio = u_resolution.x / max(u_resolution.y, 1.0);
    float imageRatio = u_image_resolution.x / max(u_image_resolution.y, 1.0);
    vec2 scale = vec2(1.0);

    if (imageRatio > canvasRatio) {
      scale.x = canvasRatio / imageRatio;
    } else {
      scale.y = imageRatio / canvasRatio;
    }

    vec2 covered = (uv - 0.5) * scale + 0.5;
    return (covered - 0.5) / vec2(1.124, 1.018) + 0.5;
  }

  float waveHeight(vec2 p, float t) {
    float broad = sin((p.x * 2.2 + p.y * 1.45 + t * 0.18) * 6.28318);
    float cross = sin((p.x * -3.1 + p.y * 3.85 - t * 0.24) * 6.28318);
    float radial = sin((length(p - vec2(0.5)) * 7.25 - t * 0.42) * 6.28318);
    return (broad * 0.45 + cross * 0.35 + radial * 0.2) * 0.68;
  }

  vec2 waterNormal(vec2 p, float t) {
    float stepSize = mix(1.0, 3.0, 0.68) / 1080.0;
    float left = waveHeight(p - vec2(stepSize, 0.0), t);
    float right = waveHeight(p + vec2(stepSize, 0.0), t);
    float top = waveHeight(p - vec2(0.0, stepSize), t);
    float bottom = waveHeight(p + vec2(0.0, stepSize), t);
    return vec2(right - left, bottom - top) * mix(1.0, 7.0, 0.68);
  }

  float rippleTrail(vec2 p, float t) {
    float total = 0.0;
    float rippleSpeed = max(u_ripple_settings.x, 0.05);
    float rippleFade = max(u_ripple_settings.y, 0.1);
    float tail = max(u_ripple_settings.z, 0.1);
    float tailStretch = max(u_trail_settings.x, 0.1);
    float rippleArea = max(u_area_settings.z, 0.05);
    float rippleSmoothing = clamp(u_area_settings.w, 0.0, 1.5);
    float ringFrequency = mix(58.0, 40.0, min(rippleSmoothing, 1.0));
    float wakeFrequency = mix(34.0, 22.0, min(rippleSmoothing, 1.0));
    float ringDecay = mix(15.0, 10.0, min(rippleSmoothing, 1.0)) / rippleArea;
    float wakeDecay = mix(5.4, 3.9, min(rippleSmoothing, 1.0)) / (rippleArea * mix(0.75, 1.65, min(tailStretch / 4.0, 1.0)));

    for (int i = 0; i < ${RIPPLE_COUNT}; i++) {
      vec4 ripple = u_ripples[i];
      float age = t - ripple.z;
      // This condition is uniform across pixels. Empty/expired slots contribute
      // exactly zero, so skip their distance, sine and exponential calculations.
      if (ripple.w <= 0.0 || age < 0.0 || age >= 2.85 * tail) continue;
      float isAlive = step(0.0, ripple.w) * step(0.0, age) * (1.0 - smoothstep(2.15 * tail, 2.85 * tail, age));
      vec2 toRipple = p - ripple.xy;
      float dist = length(toRipple);
      float radius = age * 0.22 * rippleSpeed;
      float ring = sin((dist - radius) * ringFrequency) * exp(-abs(dist - radius) * ringDecay);
      float wake = sin((dist * wakeFrequency - age * 10.0 * rippleSpeed)) * exp(-dist * wakeDecay) * exp(-age * 1.05 / rippleFade);
      float onset = smoothstep(0.0, 0.06, age);
      total += (ring * 0.6 + wake * 0.18) * exp(-age * 0.62 / (rippleFade * mix(0.9, 1.45, min(tailStretch / 4.0, 1.0)))) * ripple.w * isAlive * onset;
    }

    return total / (1.0 + abs(total) * mix(0.35, 0.9, min(rippleSmoothing, 1.0)));
  }

  void main() {
    float distortion = max(u_effects.x, 0.0);
    float light = max(u_effects.y, 0.0);
    float effectSpeed = max(u_effects.z, 0.05);
    float edgeStrength = max(u_effects.w, 0.0);
    float cursorArea = max(u_area_settings.x, 0.05);
    float cursorFalloffSteepness = max(u_area_settings.y, 0.05);
    float t = u_time * effectSpeed;
    vec2 p = v_uv;
    vec2 mouse = u_pointer;
    vec2 toMouse = p - mouse;
    float dist = length(toMouse);
    vec2 dir = normalize(toMouse + 0.0001);
    float edgeDist = min(min(p.x, 1.0 - p.x), min(p.y, 1.0 - p.y));
    float edge = 1.0 - smoothstep(0.0, 0.18, edgeDist);

    vec3 beige = vec3(0.965, 0.965, 0.925);
    vec2 normal = waterNormal(p, t);
    float cursorFalloff = exp(-(dist / cursorArea) * cursorFalloffSteepness) * u_hover;
    float cursorRipple = sin(dist * 30.0 - t * 3.8) * cursorFalloff;
    float trail = rippleTrail(p, u_time);
    float edgeWave = waveHeight(p * 1.08, t + 0.35);
    float interaction = clamp(u_hover * 0.55 + abs(trail) * 1.5, 0.0, 1.0);

    vec2 offset = normal * 0.0022 * interaction * distortion;
    offset += dir * cursorRipple * 0.0048 * distortion;
    offset += normalize(p - mouse + 0.0001) * trail * 0.011 * distortion;
    offset += normalize(p - 0.5 + 0.0001) * edgeWave * edge * 0.00045 * edgeStrength * interaction;

    vec2 uv = clamp(coverUv(p + offset), vec2(0.002), vec2(0.998));
    vec2 chromaVector = (offset * 0.65 + dir * cursorFalloff * 0.0025 + normalize(p - mouse + 0.0001) * trail * 0.0035) * u_chromatic_aberration;
    vec2 redUv = clamp(coverUv(p + offset + chromaVector), vec2(0.002), vec2(0.998));
    vec2 blueUv = clamp(coverUv(p + offset - chromaVector), vec2(0.002), vec2(0.998));
    vec3 photo = texture2D(u_texture, uv).rgb;
    photo.r = texture2D(u_texture, redUv).r;
    photo.b = texture2D(u_texture, blueUv).b;

    float photoLuminance = dot(photo, vec3(0.299, 0.587, 0.114));
    photo = mix(photo, vec3(photoLuminance), 0.06);
    vec3 color = mix(photo, beige, 0.2);

    float surfaceLight = max(0.0, normal.x * 0.35 - normal.y * 0.5 + trail * 0.6);
    color += vec3(0.018, 0.024, 0.03) * surfaceLight * light;
    float copyVeil = 1.0 - smoothstep(0.16, 0.58, length((p - 0.5) * vec2(0.82, 1.0)));
    color = mix(color, beige, copyVeil * 0.16);

    float boundaryRipple =
      normal.y * 0.006 * interaction +
      trail * 0.016 * interaction +
      cursorRipple * dir.y * 0.009 * interaction;
    float capitalBand = 1.0 - step(
      u_transition_height + boundaryRipple,
      p.y
    );
    color = mix(color, u_transition_color, capitalBand);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export default function HeroWaterCanvas({
  className,
  showCapitalBand = true,
  transitionColor = DEFAULT_TRANSITION_COLOR,
  transitionHeightPx = 72,
}: {
  className?: string;
  showCapitalBand?: boolean;
  transitionColor?: readonly [number, number, number];
  transitionHeightPx?: number | MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desktopEffect = useSyncExternalStore(subscribeToDesktopEffect, desktopEffectEnabled, serverEffectEnabled);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = canvas?.parentElement;
    if (!canvas || !surface) return;
    if (!desktopEffect) return;
    const drawingCanvas = canvas;
    const interactiveSurface = surface;
    drawingCanvas.style.opacity = "0";
    const responsiveHeroImage =
      interactiveSurface.querySelector<HTMLImageElement>(
        'img[src*="hero-arches-sunset-wide"]',
      );

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;
    const webgl = gl;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    const renderProgram = program;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) return;
    const geometryBuffer = positionBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const texture = gl.createTexture();
    if (!texture) return;
    const imageTexture = texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([246, 246, 236, 255])
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const textureLocation = gl.getUniformLocation(program, "u_texture");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const imageResolutionLocation = gl.getUniformLocation(
      program,
      "u_image_resolution"
    );
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const hoverLocation = gl.getUniformLocation(program, "u_hover");
    const effectsLocation = gl.getUniformLocation(program, "u_effects");
    const rippleSettingsLocation = gl.getUniformLocation(
      program,
      "u_ripple_settings"
    );
    const trailSettingsLocation = gl.getUniformLocation(
      program,
      "u_trail_settings"
    );
    const areaSettingsLocation = gl.getUniformLocation(
      program,
      "u_area_settings"
    );
    const chromaticAberrationLocation = gl.getUniformLocation(
      program,
      "u_chromatic_aberration"
    );
    const transitionHeightLocation = gl.getUniformLocation(
      program,
      "u_transition_height"
    );
    const transitionColorLocation = gl.getUniformLocation(
      program,
      "u_transition_color"
    );
    const ripplesLocation = gl.getUniformLocation(program, "u_ripples[0]");

    const ripples = new Float32Array(RIPPLE_COUNT * 4);
    for (let index = 0; index < ripples.length; index += 4) {
      ripples[index] = 0.5;
      ripples[index + 1] = 0.5;
      ripples[index + 2] = -10;
      ripples[index + 3] = 0;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const startTime = performance.now();
    let frame = 0;
    let visible = true;
    let rippleIndex = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetPointerX = 0.5;
    let targetPointerY = 0.5;
    let hover = 0;
    let targetHover = 0;
    let lastRippleAt = 0;
    let lastRippleX = 0.5;
    let lastRippleY = 0.5;
    let hasRipplePosition = false;
    let imageWidth = 1;
    let imageHeight = 1;
    let imageReady = false;
    let surfaceHeight = 1;
    let pointerInsideSurface = false;
    let pendingPointer: Pick<PointerEvent, "clientX" | "clientY" | "pointerType"> | null = null;

    // This context is owned by this component. Geometry and effect settings do
    // not change between frames; only resize/image load update their uniforms.
    webgl.useProgram(renderProgram);
    webgl.bindBuffer(webgl.ARRAY_BUFFER, geometryBuffer);
    webgl.enableVertexAttribArray(positionLocation);
    webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, imageTexture);
    webgl.uniform1i(textureLocation, 0);
    webgl.uniform2f(imageResolutionLocation, imageWidth, imageHeight);
    webgl.uniform4f(effectsLocation, HERO_RIPPLE_SETTINGS.distortion, HERO_RIPPLE_SETTINGS.light, HERO_RIPPLE_SETTINGS.speed, HERO_RIPPLE_SETTINGS.edge);
    webgl.uniform4f(rippleSettingsLocation, HERO_RIPPLE_SETTINGS.rippleSpeed, HERO_RIPPLE_SETTINGS.rippleFade, HERO_RIPPLE_SETTINGS.tail, HERO_RIPPLE_SETTINGS.cursorLag);
    webgl.uniform4f(trailSettingsLocation, HERO_RIPPLE_SETTINGS.tail, HERO_RIPPLE_SETTINGS.trailDensity, 0, 0);
    webgl.uniform4f(areaSettingsLocation, HERO_RIPPLE_SETTINGS.cursorArea, HERO_RIPPLE_SETTINGS.cursorFalloff, HERO_RIPPLE_SETTINGS.rippleArea, HERO_RIPPLE_SETTINGS.rippleSmoothing);
    webgl.uniform1f(chromaticAberrationLocation, HERO_RIPPLE_SETTINGS.chromaticAberration);
    webgl.uniform3f(transitionColorLocation, transitionColor[0], transitionColor[1], transitionColor[2]);

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      imageReady = true;
      imageWidth = image.naturalWidth;
      imageHeight = image.naturalHeight;

      webgl.bindTexture(webgl.TEXTURE_2D, imageTexture);
      webgl.texImage2D(
        webgl.TEXTURE_2D,
        0,
        webgl.RGBA,
        webgl.RGBA,
        webgl.UNSIGNED_BYTE,
        image
      );
      webgl.uniform2f(imageResolutionLocation, imageWidth, imageHeight);
      if (reducedMotion) render(performance.now());
    };
    image.src =
      responsiveHeroImage?.currentSrc ||
      responsiveHeroImage?.src ||
      "/assets/hero-arches-sunset-wide.webp";

    const shaderTime = () => (performance.now() - startTime) / 1000;

    function resize() {
      const rect = drawingCanvas.getBoundingClientRect();
      surfaceHeight = Math.max(1, rect.height);
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
        2048 / Math.max(1, rect.width)
      );
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      const bufferResized =
        drawingCanvas.width !== width || drawingCanvas.height !== height;
      if (bufferResized) {
        drawingCanvas.width = width;
        drawingCanvas.height = height;
      }
      webgl.viewport(0, 0, width, height);
      webgl.uniform2f(resolutionLocation, width, height);
      return bufferResized;
    }

    function writeRipple(x: number, y: number, time: number, strength: number) {
      const index = rippleIndex * 4;
      ripples[index] = Math.min(1, Math.max(0, x));
      ripples[index + 1] = Math.min(1, Math.max(0, y));
      ripples[index + 2] = time;
      ripples[index + 3] = strength;
      rippleIndex = (rippleIndex + 1) % RIPPLE_COUNT;
    }

    function addRipple(x: number, y: number, strength = 1) {
      const now = shaderTime();

      if (!hasRipplePosition) {
        writeRipple(x, y, now, strength * 0.65);
        hasRipplePosition = true;
        lastRippleAt = now;
        lastRippleX = x;
        lastRippleY = y;
        return;
      }

      const originX = lastRippleX;
      const originY = lastRippleY;
      const originTime = lastRippleAt;
      const distance = Math.hypot(x - lastRippleX, y - lastRippleY);
      const elapsed = now - lastRippleAt;
      const density = Math.max(HERO_RIPPLE_SETTINGS.trailDensity, 0.4);
      const minElapsed = 0.028 / Math.max(0.75, density);
      const minDistance = 0.026 / Math.max(0.75, density);
      if (elapsed < minElapsed && distance < minDistance) return;

      const stepDistance = 0.055 / density;
      const steps = Math.min(12, Math.max(1, Math.ceil(distance / stepDistance)));
      const baseStrength =
        strength * Math.min(1, 0.42 + distance * 8 + elapsed * 5);

      for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;
        const sampleX = originX + (x - originX) * progress;
        const sampleY = originY + (y - originY) * progress;
        const sampleTime = now - elapsed * (1 - progress);
        const sampleStrength = baseStrength * (steps > 1 ? 0.82 : 1);
        writeRipple(sampleX, sampleY, sampleTime, sampleStrength);
      }

      lastRippleAt = now;
      lastRippleX = x;
      lastRippleY = y;
    }

    function render(now: number) {
      frame = 0;
      if (!visible || document.hidden) return;
      if (pendingPointer) {
        const pointer = pendingPointer;
        pendingPointer = null;
        updatePointer(pointer);
      }
      const hoverEase = 0.08 / HERO_RIPPLE_SETTINGS.cursorLag;
      const pointerEase = 0.12 / HERO_RIPPLE_SETTINGS.cursorLag;
      pointerX += (targetPointerX - pointerX) * pointerEase;
      pointerY += (targetPointerY - pointerY) * pointerEase;
      hover += (targetHover - hover) * hoverEase;

      webgl.uniform2f(pointerLocation, pointerX, pointerY);
      webgl.uniform1f(timeLocation, (now - startTime) / 1000);
      webgl.uniform1f(hoverLocation, hover);
      webgl.uniform1f(
        transitionHeightLocation,
        showCapitalBand
          ? Math.min(
              0.18,
              (typeof transitionHeightPx === "number"
                ? transitionHeightPx
                : transitionHeightPx?.get() ?? 0) /
                surfaceHeight
            )
          : -1
      );
      webgl.uniform4fv(ripplesLocation, ripples);
      webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);

      if (imageReady && drawingCanvas.style.opacity !== "1") {
        drawingCanvas.style.opacity = "1";
      }

      scheduleRender();
    }

    function onPointerMove(event: PointerEvent) {
      if (!visible || document.hidden || reducedMotion) return;
      // Coalesce high-frequency pointer events before reading layout/hit testing.
      pendingPointer = { clientX: event.clientX, clientY: event.clientY, pointerType: event.pointerType };
    }

    function updatePointer(event: Pick<PointerEvent, "clientX" | "clientY" | "pointerType">) {
      const rect = drawingCanvas.getBoundingClientRect();
      const isInsideSurface =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom &&
        document
          .elementsFromPoint(event.clientX, event.clientY)
          .includes(interactiveSurface);

      if (!isInsideSurface) {
        onPointerLeave();
        return;
      }

      targetPointerX = (event.clientX - rect.left) / rect.width;
      targetPointerY = 1 - (event.clientY - rect.top) / rect.height;
      targetHover = 1;
      addRipple(
        targetPointerX,
        targetPointerY,
        pointerInsideSurface
          ? event.pointerType === "touch"
            ? 0.7
            : 1
          : 0.72
      );
      pointerInsideSurface = true;
    }

    function onPointerLeave() {
      pendingPointer = null;
      targetHover = 0;
      pointerInsideSurface = false;
      hasRipplePosition = false;
    }

    function scheduleRender() {
      if (!frame && !reducedMotion && visible && !document.hidden) {
        frame = requestAnimationFrame(render);
      }
    }

    function stopRendering() {
      cancelAnimationFrame(frame);
      frame = 0;
      onPointerLeave();
    }

    function onVisibilityChange() {
      if (document.hidden) stopRendering();
      else if (reducedMotion) render(performance.now());
      else scheduleRender();
    }

    const resizeObserver = new ResizeObserver(() => {
      const bufferResized = resize();
      if (bufferResized) render(performance.now());
    });
    resizeObserver.observe(interactiveSurface);
    resize();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && reducedMotion) render(performance.now());
        else if (visible) scheduleRender();
        else stopRendering();
      },
      { rootMargin: "120px 0px", threshold: 0.01 }
    );
    intersectionObserver.observe(interactiveSurface);

    // Listen at the window level so the ripple keeps tracking while the
    // initially clipped canvas sits behind the hero copy and utility controls.
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    render(startTime);

    return () => {
      drawingCanvas.style.opacity = "0";
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave
      );
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      image.onload = null;
      webgl.deleteBuffer(geometryBuffer);
      webgl.deleteTexture(imageTexture);
      webgl.deleteProgram(renderProgram);
    };
  }, [desktopEffect, showCapitalBand, transitionColor, transitionHeightPx]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-x-0 top-0 hidden h-full w-full opacity-0 transition-opacity duration-150 md:block ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
