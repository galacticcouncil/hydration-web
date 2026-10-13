import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

// Backport the Vary preservation fix from https://github.com/vercel/next.js/pull/75536.
// Next 14 otherwise drops middleware's Accept dimension when serving cached HTML.
// Keep this guarded and idempotent; reconsider it when upgrading Next (fixed in 15.2).
const nextRoot = new URL("../node_modules/next/", import.meta.url);
const { version } = JSON.parse(readFileSync(new URL("package.json", nextRoot), "utf8"));
assert.equal(version, "14.2.3", "Review/remove the Vary backport when upgrading Next.js");

const updates = ["dist/server/base-server.js", "dist/esm/server/base-server.js"].map((path) => {
  const file = new URL(path, nextRoot);
  const source = readFileSync(file, "utf8");
  const before = /res\.setHeader\("vary", (`\$\{baseVaryHeader\}[^`]*`|baseVaryHeader)\);/g;
  const after = /res\.appendHeader\("vary", (`\$\{baseVaryHeader\}[^`]*`|baseVaryHeader)\);/g;
  const pending = [...source.matchAll(before)].length;
  const applied = [...source.matchAll(after)].length;
  assert.ok((pending === 2 && applied === 0) || (pending === 0 && applied === 2), `Unexpected Next.js Vary implementation in ${path}`);
  return { file, source, patched: source.replace(before, 'res.appendHeader("vary", $1);') };
});
for (const { file, source, patched } of updates) {
  if (source !== patched) writeFileSync(file, patched);
}
