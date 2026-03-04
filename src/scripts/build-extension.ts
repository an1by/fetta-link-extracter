import { mkdirSync, cpSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dir, "..", "..");
const extensionDir = join(root, "extension");
const srcExtension = join(root, "src", "extension");
const srcAssets = join(root, "src", "assets");
const assetsDir = join(extensionDir, "assets");
const iconSvg = join(srcAssets, "icon.svg");

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8")) as {
  version: string;
};
const manifest = JSON.parse(
  readFileSync(join(srcExtension, "manifest.json"), "utf-8"),
) as Record<string, unknown>;
manifest.version = pkg.version;

mkdirSync(extensionDir, { recursive: true });
writeFileSync(
  join(extensionDir, "manifest.json"),
  JSON.stringify(manifest, null, 4),
  "utf-8",
);
cpSync(srcAssets, assetsDir, { recursive: true });

const sizes = [16, 48, 64, 128, 300] as const;
for (const size of sizes) {
  await sharp(iconSvg)
    .resize(size, size)
    .png()
    .toFile(join(assetsDir, `icon-${size}.png`));
}

const contentResult = Bun.spawn(
  [
    "bun",
    "build",
    join(srcExtension, "content.ts"),
    "--outdir=extension",
    "--outfile=content.js",
  ],
  { cwd: root, stdout: "inherit", stderr: "inherit" },
);
const contentExit = await contentResult.exited;
if (contentExit !== 0) process.exit(contentExit);

const injectResult = Bun.spawn(
  [
    "bun",
    "build",
    join(srcExtension, "inject.ts"),
    "--outdir=extension",
    "--outfile=inject.js",
  ],
  { cwd: root, stdout: "inherit", stderr: "inherit" },
);
const injectExit = await injectResult.exited;
if (injectExit !== 0) process.exit(injectExit);
