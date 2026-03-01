import archiver from "archiver";
import { existsSync, mkdirSync, createWriteStream, renameSync, statSync, unlinkSync } from "node:fs";
import { join, basename, dirname, extname } from "node:path";

const root = join(import.meta.dir, "..", "..");
const extDir = join(root, "extension");
const outDir = join(root, "dist");

function zipDir(sourceDir: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`  ${basename(outPath)}: ${archive.pointer()} bytes`);
      resolve();
    });
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function zipSourcesFromGit(outPath: string): Promise<void> {
  const dir = dirname(outPath);
  const base = basename(outPath, extname(outPath));
  const tmpZip = join(dir, `${base}-git.zip`);

  try {
    const proc = Bun.spawn(["git", "archive", "-o", tmpZip, "HEAD", "src/extension", "src/assets"], {
      cwd: root,
      stdout: "pipe",
      stderr: "pipe",
    });

    const exit = await proc.exited;
    if (exit !== 0) {
      const err = await new Response(proc.stderr).text();
      throw new Error(`git archive failed: ${err}`);
    }

    renameSync(tmpZip, outPath);
    const stat = statSync(outPath);
    console.log(`  ${basename(outPath)}: ${stat.size} bytes (git archive)`);
  } catch (e) {
    if (existsSync(tmpZip)) unlinkSync(tmpZip);
    throw e;
  }
}

function zipSourcesFromFs(outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`  ${basename(outPath)}: ${archive.pointer()} bytes (src/)`);
      resolve();
    });
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(join(root, "src/extension"), "src/extension");
    archive.directory(join(root, "src/assets"), "src/assets");
    archive.finalize();
  });
}

async function main(): Promise<void> {
  if (!existsSync(extDir)) {
    console.error("extension/ folder not found. Run: bun run build:extension");
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });

  console.log("Building extension ZIPs...\n");

  await zipDir(extDir, join(outDir, "chrome.zip"));
  await zipDir(extDir, join(outDir, "firefox.zip"));
  await zipDir(extDir, join(outDir, "opera.zip"));

  const sourcesPath = join(outDir, "sources.zip");
  try {
    await zipSourcesFromGit(sourcesPath);
  } catch {
    await zipSourcesFromFs(sourcesPath);
  }

  console.log("\nDone: dist/chrome.zip, dist/firefox.zip, dist/sources.zip, dist/opera.zip");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
