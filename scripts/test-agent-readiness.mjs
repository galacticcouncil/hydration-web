import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "hydration-agent-tests-"));
try {
  execFileSync(process.execPath, [
    join(root, "node_modules/typescript/bin/tsc"),
    "--strict", "--esModuleInterop", "--skipLibCheck",
    "--module", "commonjs", "--moduleResolution", "node", "--target", "es2022",
    "--outDir", output, "tests/agent-readiness.test.ts",
  ], { cwd: root, stdio: "inherit" });
  execFileSync(process.execPath, ["--test", join(output, "tests/agent-readiness.test.js")], {
    cwd: root, stdio: "inherit",
  });
} finally {
  rmSync(output, { recursive: true, force: true });
}
