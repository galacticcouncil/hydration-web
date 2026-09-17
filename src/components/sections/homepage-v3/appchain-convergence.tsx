"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

const capabilities = [
  { id: "oracle", label: "Onchain oracle updates", tone: "#53A4E3" },
  { id: "priority", label: "Transaction prioritization", tone: "#98AFFF" },
  {
    id: "liquidations",
    label: "Prioritized and partial liquidations",
    tone: "#F9AFCA",
  },
  { id: "risk", label: "Protocol-wide risk controls", tone: "#B3CE92" },
  { id: "runtime", label: "Runtime-level security", tone: "#F9AFCA" },
] as const;

export default function AppchainConvergence() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [visualMode, setVisualMode] = useState<"pools" | "stack">("pools");

  function updateTilt(clientX: number, clientY: number) {
    const stage = stageRef.current;
    if (!stage) return;

    const bounds = stage.getBoundingClientRect();
    const x = (clientX - bounds.left) / bounds.width - 0.5;
    const y = (clientY - bounds.top) / bounds.height - 0.5;

    stage.style.setProperty("--spectrum-tilt-x", `${x * 5}deg`);
    stage.style.setProperty("--spectrum-tilt-y", `${y * -3}deg`);
  }

  function resetTilt() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--spectrum-tilt-x", "0deg");
    stage.style.setProperty("--spectrum-tilt-y", "0deg");
  }

  return (
    <article className="appchain-convergence relative overflow-hidden border-y border-white/15 py-8 md:py-10 lg:py-12">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-16">
        <div>
          <span className="font-geist text-xs font-semibold uppercase tracking-[0.18em] text-lavender/65">
            02 / Appchain
          </span>
          <h3 className="mt-5 max-w-[15ch] font-gazpacho text-[2.55rem] font-normal leading-[0.98] text-white md:text-[3.25rem] lg:text-[4rem]">
            Appchain-level execution
          </h3>
        </div>
        <p className="max-w-[38rem] font-geist text-[1.05rem] leading-[1.55] text-white/60 lg:pb-1">
          Owning the execution environment lets Hydration optimize how
          financial activity is processed.
        </p>
      </div>

      <div
        ref={stageRef}
        className={`appchain-spectrum-stage relative mt-10 h-[49rem] md:mt-14 md:h-[52rem] lg:mt-16 lg:h-[56rem] ${
          visualMode === "pools" ? "is-pool-view" : "is-stack-view"
        }`}
        onPointerMove={(event) => updateTilt(event.clientX, event.clientY)}
        onPointerLeave={resetTilt}
      >
        <div
          className="appchain-visual-switch"
          role="tablist"
          aria-label="Appchain visualization"
        >
          <button
            type="button"
            role="tab"
            aria-selected={visualMode === "pools"}
            className={visualMode === "pools" ? "is-active" : undefined}
            onClick={() => setVisualMode("pools")}
          >
            Pool network
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={visualMode === "stack"}
            className={visualMode === "stack" ? "is-active" : undefined}
            onClick={() => setVisualMode("stack")}
          >
            Layer stack
          </button>
        </div>

        {visualMode === "pools" ? (
          <div className="appchain-pool-network" aria-hidden="true">
            <ProceduralField variant="pool" />
            <div className="appchain-pool-network-logo">
              <HydrationSygnet />
            </div>
          </div>
        ) : (
          <>
            <div className="appchain-spectrum-particles" aria-hidden="true">
              <ProceduralField variant="signal" />
            </div>

            <div className="appchain-spectrum-scene" aria-hidden="true">
              <div
                className="appchain-spectrum-layer appchain-spectrum-layer--protocol"
                style={
                  {
                    "--layer-z": "120px",
                    backgroundColor: "rgb(4 56 117 / 0.26)",
                    border: "none",
                    borderRadius: "1.15rem",
                    backdropFilter: "blur(10px)",
                    boxShadow: "none",
                  } as CSSProperties
                }
              >
                <ProceduralField variant="routing" />
              </div>

              <div
                className="appchain-spectrum-layer appchain-spectrum-layer--matrix"
                style={
                  {
                    "--layer-z": "0px",
                    backgroundColor: "rgb(54 21 75 / 0.42)",
                    border: "none",
                    borderRadius: "1.15rem",
                    backdropFilter: "blur(10px)",
                    boxShadow: "none",
                  } as CSSProperties
                }
              >
                <div className="appchain-spectrum-matrix-grid">
                  {Array.from({ length: 64 }, (_, index) => (
                    <span
                      key={index}
                      style={{ "--cell-index": index } as CSSProperties}
                    />
                  ))}
                </div>
              </div>

              <div
                className="appchain-spectrum-layer appchain-spectrum-layer--network"
                style={
                  {
                    "--layer-z": "-120px",
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                  } as CSSProperties
                }
              >
                <ProceduralField variant="network" />
              </div>

              <div
                className="appchain-spectrum-layer appchain-spectrum-layer--foundation"
                style={
                  {
                    "--layer-z": "-240px",
                    backgroundColor: "rgb(43 29 60 / 0.58)",
                    border: "none",
                    borderRadius: "1.4rem",
                    backdropFilter: "blur(12px)",
                    boxShadow: "none",
                  } as CSSProperties
                }
              >
                <span />
              </div>
            </div>
          </>
        )}

        <div className="appchain-spectrum-labels">
          {capabilities.map((capability, index) => (
            <div
              key={capability.id}
              className={`appchain-spectrum-label appchain-spectrum-label--${capability.id}`}
              style={
                {
                  "--label-index": index,
                  "--label-tone": capability.tone,
                } as CSSProperties
              }
            >
              <span>{capability.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function ProceduralField({
  variant,
}: {
  variant: "signal" | "routing" | "network" | "pool";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const surface = canvas;
    const drawing = context;

    let animationFrame = 0;
    let visible = false;
    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let seed =
      variant === "signal"
        ? 7841
        : variant === "routing"
          ? 6151
          : variant === "pool"
            ? 8263
            : 3197;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const palette = [
      [170, 238, 252],
      [152, 175, 255],
      [249, 175, 202],
      [191, 255, 152],
      [255, 222, 236],
    ];

    const signalNodes = Array.from({ length: 75 }, (_, index) => {
      const layer = Math.floor(index / 25);
      const cell = index % 25;
      const row = Math.floor(cell / 5);
      const column = cell % 5;

      return {
        x: -1 + (column / 4) * 2 + (random() - 0.5) * 0.12,
        y: -1 + (row / 4) * 2 + (random() - 0.5) * 0.12,
        z: (layer - 1) * 0.42 + (random() - 0.5) * 0.08,
        size: 1.65 + Math.pow(random(), 1.25) * 4.2,
        phase: random() * Math.PI * 2,
        color: Math.floor(random() * palette.length),
      };
    });

    const signalEdgeKeys = new Set<string>();
    signalNodes.forEach((node, nodeIndex) => {
      const nearest = signalNodes
        .map((candidate, candidateIndex) => ({
          candidateIndex,
          distance: Math.hypot(
            candidate.x - node.x,
            candidate.y - node.y,
            candidate.z - node.z,
          ),
        }))
        .filter(({ candidateIndex }) => candidateIndex !== nodeIndex)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);

      nearest.forEach(({ candidateIndex }) => {
        const start = Math.min(nodeIndex, candidateIndex);
        const end = Math.max(nodeIndex, candidateIndex);
        signalEdgeKeys.add(`${start}:${end}`);
      });
    });
    const signalEdges = Array.from(signalEdgeKeys).map((edge) =>
      edge.split(":").map(Number),
    );

    function resize() {
      const bounds = surface.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      surface.width = Math.round(width * pixelRatio);
      surface.height = Math.round(height * pixelRatio);
      drawing.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function drawSignal(time: number) {
      const yaw = 0.42 + Math.sin(time * 0.12) * 0.16;
      const cosine = Math.cos(yaw);
      const sine = Math.sin(yaw);
      const points = signalNodes.map((node, index) => {
        const orbitX = node.x * cosine + node.z * sine;
        const orbitZ = -node.x * sine + node.z * cosine;
        const driftX = Math.sin(time * 0.23 + node.phase) * 2.2;
        const driftY = Math.cos(time * 0.19 + node.phase) * 2;
        const perspective = 1 / (1.12 - orbitZ * 0.19);
        return {
          index,
          x: width * 0.5 + orbitX * width * 0.25 * perspective + driftX,
          y:
            height * 0.5 +
            node.y * height * 0.39 * perspective -
            orbitZ * height * 0.055 +
            driftY,
          depth: orbitZ,
          perspective,
        };
      });

      const depthOrder = [...points].sort((a, b) => a.depth - b.depth);
      depthOrder.forEach((point) => {
        const node = signalNodes[point.index];
        const color = palette[node.color];
        drawing.globalAlpha = 0.4 + point.perspective * 0.48;
        drawing.beginPath();
        drawing.arc(
          point.x,
          point.y,
          node.size * point.perspective,
          0,
          Math.PI * 2,
        );
        drawing.fillStyle = `rgb(${color.join(",")})`;
        drawing.fill();
      });
      drawing.globalAlpha = 1;

      for (let signal = 0; signal < 12; signal += 1) {
        const edge = signalEdges[(signal * 7 + 3) % signalEdges.length];
        const start = points[edge[0]];
        const end = points[edge[1]];
        const progress = (time * 0.2 + signal * 0.113) % 1;
        const control = {
          x:
            (start.x + end.x) * 0.5 +
            Math.sin(signal * 2.17) *
              (12 + Math.abs(start.depth - end.depth) * 10),
          y:
            (start.y + end.y) * 0.5 -
            9 -
            Math.abs(start.depth - end.depth) * 8,
        };

        for (let trail = 0; trail < 4; trail += 1) {
          const packetProgress = progress - trail * 0.026;
          if (packetProgress < 0) continue;
          const inverse = 1 - packetProgress;
          const x =
            inverse * inverse * start.x +
            2 * inverse * packetProgress * control.x +
            packetProgress * packetProgress * end.x;
          const y =
            inverse * inverse * start.y +
            2 * inverse * packetProgress * control.y +
            packetProgress * packetProgress * end.y;

          drawing.globalAlpha = 0.82 - trail * 0.17;
          drawing.beginPath();
          drawing.arc(x, y, 2.35 - trail * 0.32, 0, Math.PI * 2);
          drawing.fillStyle = signal % 3 === 0 ? "#F9AFCA" : "#AAEEFC";
          drawing.fill();
        }

        const arrival = Math.max(0, (progress - 0.86) / 0.14);
        if (arrival > 0) {
          const node = signalNodes[edge[1]];
          const color = palette[node.color];
          drawing.globalAlpha = Math.sin(arrival * Math.PI) * 0.65;
          drawing.beginPath();
          drawing.arc(end.x, end.y, node.size + arrival * 4, 0, Math.PI * 2);
          drawing.fillStyle = `rgb(${color.join(",")})`;
          drawing.fill();
        }
      }
      drawing.globalAlpha = 1;
    }

    function drawRouting(time: number) {
      const laneCount = 5;
      const left = width * 0.09;
      const gateX = width * 0.64;
      const outputEnd = width * 0.91;
      const centerY = height * 0.5;
      const laneGap = height * 0.105;
      const colors = ["#98AFFF", "#53A4E3", "#AAEEFC", "#F9AFCA"];

      for (let lane = 0; lane < laneCount; lane += 1) {
        const y = centerY + (lane - 2) * laneGap;
        for (let marker = 0; marker < 7; marker += 1) {
          drawing.globalAlpha = 0.18 + marker * 0.025;
          drawing.beginPath();
          drawing.arc(
            left + marker * width * 0.072,
            y,
            marker % 3 === 0 ? 1.8 : 1.15,
            0,
            Math.PI * 2,
          );
          drawing.fillStyle = colors[(lane + marker) % colors.length];
          drawing.fill();
        }
      }

      for (let slot = 0; slot < 5; slot += 1) {
        const slotY = centerY + (slot - 2) * 9.5;
        drawing.globalAlpha = slot === 2 ? 0.82 : 0.34;
        drawing.beginPath();
        drawing.roundRect(gateX - 4.5, slotY - 3, 9, 6, 3);
        drawing.fillStyle = colors[(4 - slot) % colors.length];
        drawing.fill();
      }

      for (let marker = 0; marker < 7; marker += 1) {
        drawing.globalAlpha = 0.22 + marker * 0.07;
        drawing.beginPath();
        drawing.arc(
          gateX + 22 + marker * ((outputEnd - gateX - 22) / 6),
          centerY,
          1.3 + marker * 0.13,
          0,
          Math.PI * 2,
        );
        drawing.fillStyle = marker % 2 === 0 ? "#F9AFCA" : "#AAEEFC";
        drawing.fill();
      }

      for (let packet = 0; packet < 24; packet += 1) {
        const priority = (packet * 3 + 1) % 4;
        const lane = (packet * 2 + priority) % laneCount;
        const speed = 0.075 + priority * 0.018;
        const progress = (time * speed + packet * 0.071) % 1;
        const laneY = centerY + (lane - 2) * laneGap;
        const converge = Math.max(0, Math.min(1, (progress - 0.48) / 0.32));
        const eased = converge * converge * (3 - 2 * converge);
        const x = left + progress * (outputEnd - left);
        const y =
          laneY +
          (centerY - laneY) * eased +
          Math.sin(time * 0.9 + packet) * (1 - eased) * 1.4;
        const packetWidth = 5.8 + priority * 1.8;
        const packetHeight = 3.4 + priority * 0.55;

        drawing.globalAlpha = 0.54 + priority * 0.12;
        drawing.beginPath();
        drawing.roundRect(
          x - packetWidth / 2,
          y - packetHeight / 2,
          packetWidth,
          packetHeight,
          packetHeight / 2,
        );
        drawing.fillStyle = colors[priority];
        drawing.fill();
      }

      drawing.globalAlpha = 1;
    }

    function drawPoolNetwork(time: number) {
      type PoolKind =
        | "core"
        | "oracle"
        | "priority"
        | "liquidations"
        | "risk"
        | "runtime";

      const unit = Math.min(width, height);
      const center = {
        x: width * 0.5,
        y: height * 0.48,
      };
      const satellites = [
        {
          x: width * 0.5,
          y: height * 0.13,
          surface: "#98AFFF",
          side: "#36154B",
          stroke: "#AAEEFC",
          kind: "oracle" as const,
        },
        {
          x: width * 0.75,
          y: height * 0.31,
          surface: "#53A4E3",
          side: "#043875",
          stroke: "#AAEEFC",
          kind: "priority" as const,
        },
        {
          x: width * 0.69,
          y: height * 0.68,
          surface: "#F9AFCA",
          side: "#CC1775",
          stroke: "#FFDEEC",
          kind: "liquidations" as const,
        },
        {
          x: width * 0.31,
          y: height * 0.68,
          surface: "#B3CE92",
          side: "#111A15",
          stroke: "#BFFF98",
          kind: "risk" as const,
        },
        {
          x: width * 0.25,
          y: height * 0.31,
          surface: "#AAEEFC",
          side: "#043875",
          stroke: "#98AFFF",
          kind: "runtime" as const,
        },
      ];

      const curvePoint = (
        start: { x: number; y: number },
        end: { x: number; y: number },
        progress: number,
        bend: number,
      ) => {
        const inverse = 1 - progress;
        const control = {
          x: (start.x + end.x) * 0.5 + bend,
          y: (start.y + end.y) * 0.5 - unit * 0.035,
        };
        return {
          x:
            inverse * inverse * start.x +
            2 * inverse * progress * control.x +
            progress * progress * end.x,
          y:
            inverse * inverse * start.y +
            2 * inverse * progress * control.y +
            progress * progress * end.y,
        };
      };

      satellites.forEach((pool, index) => {
        drawing.beginPath();
        drawing.moveTo(pool.x, pool.y);
        drawing.quadraticCurveTo(
          (pool.x + center.x) * 0.5 + (index - 2) * unit * 0.018,
          (pool.y + center.y) * 0.5 - unit * 0.035,
          center.x,
          center.y,
        );
        drawing.strokeStyle = "rgba(170,238,252,0.34)";
        drawing.lineWidth = Math.max(2.5, unit * 0.0075);
        drawing.stroke();

        drawing.beginPath();
        drawing.moveTo(pool.x, pool.y + 2);
        drawing.quadraticCurveTo(
          (pool.x + center.x) * 0.5 + (index - 2) * unit * 0.018,
          (pool.y + center.y) * 0.5 - unit * 0.035 + 2,
          center.x,
          center.y + 2,
        );
        drawing.strokeStyle = "rgba(152,175,255,0.28)";
        drawing.lineWidth = 1;
        drawing.stroke();

        for (let droplet = 0; droplet < 2; droplet += 1) {
          const progress = (time * 0.11 + index * 0.17 + droplet * 0.48) % 1;
          const point = curvePoint(
            pool,
            center,
            progress,
            (index - 2) * unit * 0.018,
          );
          drawing.beginPath();
          drawing.arc(
            point.x,
            point.y,
            unit * (droplet === 0 ? 0.007 : 0.0045),
            0,
            Math.PI * 2,
          );
          drawing.fillStyle = droplet === 0 ? "#AAEEFC" : "#F9AFCA";
          drawing.fill();
        }
      });

      const drawBasin = (
        basin: {
          x: number;
          y: number;
          surface: string;
          side: string;
          stroke: string;
          kind: PoolKind;
        },
        radiusX: number,
        radiusY: number,
        depth: number,
        phase: number,
      ) => {
        const pointCount = 64;
        const shapePoint = (angle: number) => {
          const cosine = Math.cos(angle);
          const sine = Math.sin(angle);

          if (basin.kind === "risk") {
            return {
              x:
                Math.sign(cosine) *
                Math.pow(Math.abs(cosine), 0.56) *
                radiusX,
              y:
                Math.sign(sine) *
                Math.pow(Math.abs(sine), 0.56) *
                radiusY,
            };
          }

          if (basin.kind === "runtime") {
            const sides = 6;
            const sector = (Math.PI * 2) / sides;
            const localAngle =
              ((angle + sector * 0.5 + Math.PI * 2) % sector) - sector * 0.5;
            const polygonRadius = Math.cos(Math.PI / sides) / Math.cos(localAngle);

            return {
              x: cosine * polygonRadius * radiusX,
              y: sine * polygonRadius * radiusY,
            };
          }

          const lobeScale =
            basin.kind === "liquidations"
              ? 1 + Math.cos(angle * 2) * 0.12
              : 1;

          return {
            x: cosine * radiusX * lobeScale,
            y: sine * radiusY * lobeScale,
          };
        };
        const shellPoints = Array.from(
          { length: pointCount + 1 },
          (_, step) => {
            const angle = (step / pointCount) * Math.PI * 2;
            const shape = shapePoint(angle);

            return {
              x: basin.x + shape.x,
              y: basin.y + shape.y,
            };
          },
        );
        const shellTopPoints = shellPoints.map((point) => ({
          x: point.x,
          y: point.y - radiusY * 0.22,
        }));
        const surfacePoints = Array.from(
          { length: pointCount + 1 },
          (_, step) => {
            const angle = (step / pointCount) * Math.PI * 2;
            const shape = shapePoint(angle);
            const frontness = (Math.sin(angle) + 1) * 0.5;
            const motionScale =
              basin.kind === "core"
                ? 1
                : basin.kind === "priority"
                  ? 0.52
                  : basin.kind === "liquidations"
                    ? 0.34
                    : 0.2;
            const displacement =
              Math.sin(angle * 3 + time * 0.92 + phase) * radiusY * 0.1 +
              Math.sin(angle * 5 - time * 0.64 + phase * 0.7) *
                radiusY *
                0.045;

            return {
              x: basin.x + shape.x,
              y:
                basin.y +
                shape.y +
                displacement * (0.34 + frontness * 0.66) * motionScale,
            };
          },
        );
        const frontSurfacePoints = surfacePoints.slice(
          0,
          pointCount / 2 + 1,
        );
        const frontSurfaceSkirtPoints = frontSurfacePoints.map((point) => ({
          x: point.x,
          y: point.y + radiusY * 0.38,
        }));
        const bottomScale =
          basin.kind === "priority"
            ? 0.58
            : basin.kind === "oracle"
              ? 0.9
              : 0.94;
        const bottomPoints = shellPoints.map((point) => ({
          x: basin.x + (point.x - basin.x) * bottomScale,
          y: basin.y + (point.y - basin.y) * bottomScale + depth,
        }));

        const tracePoints = (points: Array<{ x: number; y: number }>) => {
          drawing.moveTo(points[0].x, points[0].y);
          points.slice(1).forEach((point) => drawing.lineTo(point.x, point.y));
        };

        drawing.globalAlpha = 0.68;
        drawing.beginPath();
        tracePoints(shellTopPoints);
        [...bottomPoints].reverse().forEach((point) =>
          drawing.lineTo(point.x, point.y),
        );
        drawing.closePath();
        drawing.fillStyle = basin.side;
        drawing.fill();

        drawing.globalAlpha = 0.24;
        drawing.beginPath();
        tracePoints(shellTopPoints.slice(0, pointCount / 2 + 1));
        bottomPoints
          .slice(0, pointCount / 2 + 1)
          .reverse()
          .forEach((point) => drawing.lineTo(point.x, point.y));
        drawing.closePath();
        drawing.fillStyle = basin.stroke;
        drawing.fill();

        drawing.globalAlpha = 0.58;
        drawing.beginPath();
        tracePoints(frontSurfacePoints);
        [...frontSurfaceSkirtPoints].reverse().forEach((point) =>
          drawing.lineTo(point.x, point.y),
        );
        drawing.closePath();
        drawing.fillStyle = basin.surface;
        drawing.fill();

        drawing.save();
        drawing.beginPath();
        tracePoints(surfacePoints);
        drawing.closePath();
        drawing.clip();
        drawing.filter = `blur(${Math.max(4, unit * 0.006)}px)`;
        drawing.globalAlpha = 0.82;
        drawing.drawImage(surface, 0, 0, width, height);
        drawing.restore();

        drawing.save();
        drawing.filter = `blur(${Math.max(2.4, unit * 0.004)}px)`;
        drawing.globalAlpha = 0.3;
        drawing.beginPath();
        tracePoints(shellTopPoints);
        drawing.closePath();
        drawing.fillStyle = basin.surface;
        drawing.fill();

        drawing.globalAlpha = 0.24;
        drawing.beginPath();
        tracePoints(surfacePoints);
        drawing.closePath();
        drawing.fillStyle = basin.surface;
        drawing.fill();
        drawing.restore();

        drawing.globalAlpha = 0.62;
        drawing.beginPath();
        tracePoints(surfacePoints);
        drawing.closePath();
        drawing.fillStyle = basin.surface;
        drawing.fill();

        drawing.globalAlpha = 0.82;
        drawing.strokeStyle = basin.stroke;
        drawing.lineWidth = Math.max(1.25, unit * 0.0026);
        drawing.stroke();

        drawing.save();
        drawing.beginPath();
        tracePoints(surfacePoints);
        drawing.closePath();
        drawing.clip();

        const drawCoreWaves = () => {
          for (let wave = -1; wave <= 1; wave += 1) {
            const waveY =
              basin.y +
              wave * radiusY * 0.42 +
              Math.sin(time * 0.85 + phase + wave) * radiusY * 0.08;
            drawing.beginPath();
            for (let step = 0; step <= 18; step += 1) {
              const progress = step / 18;
              const x = basin.x - radiusX + progress * radiusX * 2;
              const y =
                waveY +
                Math.sin(progress * Math.PI * 3 + time * 1.15 + phase) *
                  radiusY *
                  0.19 +
                Math.sin(progress * Math.PI * 6 - time * 0.7 + phase) *
                  radiusY *
                  0.055;
              if (step === 0) drawing.moveTo(x, y);
              else drawing.lineTo(x, y);
            }
            drawing.globalAlpha = wave === 0 ? 0.76 : 0.34;
            drawing.strokeStyle = wave === 0 ? "#AAEEFC" : basin.stroke;
            drawing.lineWidth = wave === 0 ? 1.8 : 1;
            drawing.stroke();
          }
        };

        const drawOraclePulse = () => {
          for (let ring = 0; ring < 3; ring += 1) {
            const pulse = (time * 0.22 + ring * 0.33) % 1;
            drawing.globalAlpha = (1 - pulse) * 0.72;
            drawing.beginPath();
            drawing.ellipse(
              basin.x,
              basin.y,
              radiusX * (0.18 + pulse * 0.72),
              radiusY * (0.18 + pulse * 0.64),
              0,
              0,
              Math.PI * 2,
            );
            drawing.strokeStyle = ring === 0 ? "#FFDEEC" : basin.stroke;
            drawing.lineWidth = ring === 0 ? 1.6 : 1;
            drawing.stroke();
          }

          const orbit = time * 0.65 + phase;
          drawing.globalAlpha = 0.92;
          drawing.beginPath();
          drawing.arc(
            basin.x + Math.cos(orbit) * radiusX * 0.56,
            basin.y + Math.sin(orbit) * radiusY * 0.5,
            Math.max(1.6, unit * 0.0035),
            0,
            Math.PI * 2,
          );
          drawing.fillStyle = "#FFDEEC";
          drawing.fill();
        };

        const drawPriorityVortex = () => {
          for (let arm = 0; arm < 3; arm += 1) {
            drawing.beginPath();
            for (let step = 0; step <= 42; step += 1) {
              const progress = step / 42;
              const angle =
                time * 0.52 +
                phase +
                arm * ((Math.PI * 2) / 3) +
                progress * Math.PI * 3.2;
              const orbit = radiusX * (0.06 + progress * 0.76);
              const x = basin.x + Math.cos(angle) * orbit;
              const y =
                basin.y +
                Math.sin(angle) * radiusY * (0.08 + progress * 0.72);
              if (step === 0) drawing.moveTo(x, y);
              else drawing.lineTo(x, y);
            }
            drawing.globalAlpha = arm === 0 ? 0.84 : 0.5;
            drawing.strokeStyle = arm === 0 ? "#FFDEEC" : basin.stroke;
            drawing.lineWidth = arm === 0 ? 1.8 : 1.15;
            drawing.stroke();
          }

          drawing.globalAlpha = 0.9;
          drawing.beginPath();
          drawing.arc(
            basin.x,
            basin.y,
            Math.max(2.2, unit * 0.0045),
            0,
            Math.PI * 2,
          );
          drawing.fillStyle = "#AAEEFC";
          drawing.fill();
        };

        const drawLiquidationChannels = () => {
          for (let lane = -1; lane <= 1; lane += 1) {
            const channelY = basin.y + lane * radiusY * 0.34;
            drawing.beginPath();
            drawing.moveTo(basin.x - radiusX * 0.82, channelY);
            drawing.bezierCurveTo(
              basin.x - radiusX * 0.28,
              channelY,
              basin.x - radiusX * 0.24,
              basin.y,
              basin.x,
              basin.y,
            );
            drawing.bezierCurveTo(
              basin.x + radiusX * 0.24,
              basin.y,
              basin.x + radiusX * 0.3,
              channelY * 0.45 + basin.y * 0.55,
              basin.x + radiusX * 0.82,
              channelY * 0.45 + basin.y * 0.55,
            );
            drawing.globalAlpha = lane === 0 ? 0.82 : 0.44;
            drawing.strokeStyle = lane === 0 ? "#AAEEFC" : basin.stroke;
            drawing.lineWidth = lane === 0 ? 2 : 1.1;
            drawing.stroke();
          }

          for (let packet = 0; packet < 3; packet += 1) {
            const progress = (time * 0.24 + packet * 0.33) % 1;
            drawing.globalAlpha = 0.88 - packet * 0.14;
            drawing.beginPath();
            drawing.arc(
              basin.x - radiusX * 0.68 + progress * radiusX * 1.36,
              basin.y + (packet - 1) * radiusY * 0.13 * (1 - progress),
              Math.max(1.4, unit * 0.003),
              0,
              Math.PI * 2,
            );
            drawing.fillStyle = packet === 1 ? "#AAEEFC" : "#FFDEEC";
            drawing.fill();
          }
        };

        const drawRiskBarriers = () => {
          for (let layer = 0; layer < 3; layer += 1) {
            const insetX = radiusX * (0.18 + layer * 0.16);
            const insetY = radiusY * (0.2 + layer * 0.16);
            drawing.globalAlpha = 0.76 - layer * 0.17;
            drawing.beginPath();
            drawing.roundRect(
              basin.x - radiusX + insetX,
              basin.y - radiusY + insetY,
              radiusX * 2 - insetX * 2,
              radiusY * 2 - insetY * 2,
              Math.max(3, radiusY * 0.28),
            );
            drawing.strokeStyle = layer === 0 ? "#FFDEEC" : basin.stroke;
            drawing.lineWidth = layer === 0 ? 1.6 : 1;
            drawing.stroke();
          }

          drawing.globalAlpha = 0.86;
          drawing.beginPath();
          drawing.moveTo(basin.x, basin.y - radiusY * 0.48);
          drawing.lineTo(basin.x, basin.y + radiusY * 0.48);
          drawing.strokeStyle = basin.stroke;
          drawing.lineWidth = 1.2;
          drawing.stroke();
        };

        const drawRuntimeMesh = () => {
          const meshPoints: Array<{ x: number; y: number }> = [];
          for (let row = -1; row <= 1; row += 1) {
            for (let column = -2; column <= 2; column += 1) {
              meshPoints.push({
                x:
                  basin.x +
                  column * radiusX * 0.28 +
                  (Math.abs(row) % 2) * radiusX * 0.14,
                y: basin.y + row * radiusY * 0.38,
              });
            }
          }

          meshPoints.forEach((point, index) => {
            meshPoints.slice(index + 1).forEach((neighbor) => {
              const deltaX = point.x - neighbor.x;
              const deltaY = point.y - neighbor.y;
              if (
                Math.hypot(deltaX / radiusX, deltaY / radiusY) < 0.48
              ) {
                drawing.globalAlpha = 0.24;
                drawing.beginPath();
                drawing.moveTo(point.x, point.y);
                drawing.lineTo(neighbor.x, neighbor.y);
                drawing.strokeStyle = basin.stroke;
                drawing.lineWidth = 0.9;
                drawing.stroke();
              }
            });

            const signal =
              0.55 + Math.sin(time * 1.1 + index * 0.8) * 0.25;
            drawing.globalAlpha = signal;
            drawing.beginPath();
            drawing.arc(
              point.x,
              point.y,
              Math.max(1.2, unit * 0.0025),
              0,
              Math.PI * 2,
            );
            drawing.fillStyle = index % 3 === 0 ? "#FFDEEC" : basin.stroke;
            drawing.fill();
          });
        };

        if (basin.kind === "core") drawCoreWaves();
        if (basin.kind === "oracle") drawOraclePulse();
        if (basin.kind === "priority") drawPriorityVortex();
        if (basin.kind === "liquidations") drawLiquidationChannels();
        if (basin.kind === "risk") drawRiskBarriers();
        if (basin.kind === "runtime") drawRuntimeMesh();

        drawing.beginPath();
        surfacePoints
          .slice(0, pointCount / 2 + 1)
          .forEach((point, index) => {
            const insetY = point.y + radiusY * 0.16;
            if (index === 0) drawing.moveTo(point.x, insetY);
            else drawing.lineTo(point.x, insetY);
          });
        drawing.globalAlpha = 0.3;
        drawing.strokeStyle = "#FFDEEC";
        drawing.lineWidth = 1;
        drawing.stroke();
        drawing.restore();
        drawing.globalAlpha = 1;
      };

      const satelliteRadiusX = unit * 0.085;
      const satelliteRadiusY = unit * 0.039;
      const satelliteDepth: Record<Exclude<PoolKind, "core">, number> = {
        oracle: 0.026,
        priority: 0.058,
        liquidations: 0.038,
        risk: 0.05,
        runtime: 0.046,
      };
      satellites.forEach((pool, index) =>
        drawBasin(
          pool,
          satelliteRadiusX,
          satelliteRadiusY,
          unit * satelliteDepth[pool.kind],
          index * 1.37,
        ),
      );

      drawBasin(
        {
          ...center,
          surface: "#53A4E3",
          side: "#043875",
          stroke: "#AAEEFC",
          kind: "core",
        },
        unit * 0.14,
        unit * 0.064,
        unit * 0.065,
        0.4,
      );

      for (let ripple = 0; ripple < 3; ripple += 1) {
        const progress = (time * 0.18 + ripple * 0.33) % 1;
        drawing.globalAlpha = (1 - progress) * 0.34;
        drawing.beginPath();
        drawing.ellipse(
          center.x,
          center.y,
          unit * (0.145 + progress * 0.07),
          unit * (0.067 + progress * 0.032),
          0,
          0,
          Math.PI * 2,
        );
        drawing.strokeStyle = ripple % 2 === 0 ? "#AAEEFC" : "#F9AFCA";
        drawing.lineWidth = 1;
        drawing.stroke();
      }
      drawing.globalAlpha = 1;
    }

    function drawNetwork(time: number) {
      const rows = 8;
      const columns = 11;
      const points: Array<Array<{ x: number; y: number; lift: number }>> = [];

      for (let row = 0; row < rows; row += 1) {
        const line = [];
        for (let column = 0; column < columns; column += 1) {
          const x = 26 + (column / (columns - 1)) * (width - 52);
          const y = 30 + (row / (rows - 1)) * (height - 60);
          const center = 1 - Math.min(1, Math.hypot(column - 5, row - 3.5) / 6);
          const lift =
            Math.sin(column * 0.8 + time * 1.25) * 11 +
            Math.cos(row * 1.1 - time * 0.9) * 8 +
            center * 48;
          line.push({ x, y: y - lift, lift });
        }
        points.push(line);
      }

      drawing.lineWidth = 1.15;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const point = points[row][column];
          const links = [
            points[row]?.[column + 1],
            points[row + 1]?.[column],
            (row + column) % 2 === 0 ? points[row + 1]?.[column + 1] : undefined,
          ];
          for (const link of links) {
            if (!link) continue;
            drawing.beginPath();
            drawing.moveTo(point.x, point.y);
            drawing.lineTo(link.x, link.y);
            drawing.strokeStyle = "rgba(179,206,146,0.66)";
            drawing.stroke();
          }
        }
      }

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const point = points[row][column];
          const pulse = 1 + Math.sin(time * 2 + row + column * 0.7) * 0.45;
          const color = palette[(row + column) % palette.length];
          drawing.beginPath();
          drawing.arc(point.x, point.y, 1.85 * pulse, 0, Math.PI * 2);
          drawing.fillStyle = (row + column) % 3 === 0 ? "#BFFF98" : "#B3CE92";
          drawing.fill();
        }
      }
    }

    function draw(timeStamp: number) {
      const time = reducedMotion ? 0.75 : timeStamp / 1000;
      drawing.clearRect(0, 0, width, height);

      if (variant === "signal") drawSignal(time);
      else if (variant === "routing") drawRouting(time);
      else if (variant === "pool") drawPoolNetwork(time);
      else drawNetwork(time);

      if (!reducedMotion && visible) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    }

    resize();
    draw(750);
    window.addEventListener("resize", resize);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting;
        if (nextVisible && !visible && !reducedMotion) {
          visible = true;
          animationFrame = window.requestAnimationFrame(draw);
        } else if (!nextVisible) {
          visible = false;
          window.cancelAnimationFrame(animationFrame);
        }
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );
    intersectionObserver.observe(surface);

    return () => {
      window.removeEventListener("resize", resize);
      intersectionObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [variant]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}

function HydrationSygnet() {
  return (
    <svg viewBox="0 0 50 50" fill="none">
      <path
        d="M45.1137 28.3983C45.6872 27.827 46.4245 27.0925 47.1593 26.3631C48.7953 24.736 48.7953 22.0938 47.1593 20.4641L45.4261 18.7375C39.2226 24.9171 29.9418 26.1566 22.5018 22.4636C27.5301 23.3894 32.7427 22.6676 37.3614 20.1938C40.4515 18.5386 41.0378 14.3662 38.557 11.8949L28.3289 1.70616C26.0426 -0.571323 22.338 -0.571323 20.0543 1.70616L9.02996 12.688C16.2907 9.61485 25.0109 11.0405 30.9147 16.9625C21.9079 12.6064 10.7479 14.152 3.26946 21.6016C2.69597 22.1729 1.95607 22.9099 1.22385 23.6393C-0.409576 25.269 -0.409576 27.9087 1.22385 29.5358L2.95455 31.2598C9.15797 25.0803 18.4388 23.8408 25.8788 27.5338C20.8505 26.608 15.6379 27.3297 11.0193 29.8036C7.92906 31.4588 7.34277 35.6312 9.82363 38.1025L20.0517 48.2912C22.338 50.5687 26.0426 50.5687 28.3263 48.2912L39.3507 37.3093C32.0899 40.3825 23.3698 38.9569 17.4659 33.0349C26.4727 37.3909 37.6327 35.8454 45.1112 28.3958L45.1137 28.3983Z"
        fill="currentColor"
      />
    </svg>
  );
}
