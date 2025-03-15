import sharp from "sharp";
import path from "path";
import fs from "fs-extra";

export async function optimizeImage(
  inputPath: string,
  outputDir: string,
  width: number,
  quality: number,
): Promise<void> {
  try {
    const { name, ext } = path.parse(inputPath);
    const outputPath = path.join(
      outputDir,
      `${name}${ext === ".svg" ? ext : ".webp"}`,
    );

    if (ext.toLowerCase() === ".svg") {
      await fs.copyFile(inputPath, outputPath);
      console.log(`Copied: ${inputPath}`);
    } else {
      await sharp(inputPath)
        .resize({ width, fit: "inside" })
        .webp({ quality })
        .toFile(outputPath);
      console.log(`Optimized: ${inputPath}`);
    }
  } catch (error) {
    console.error(`Error optimizing image ${inputPath}:`, error);
    throw error;
  }
}

export async function ensureOptimizedImage(
  src: string,
  width: number,
  quality: number,
): Promise<string> {
  try {
    const inputPath = path.join(process.cwd(), "public", src);
    const { dir, name, ext } = path.parse(src);
    const outputDir = path.join(
      process.cwd(),
      "public",
      ".next",
      "cache",
      "images",
      dir,
    );
    const outputPath = path.join(
      outputDir,
      `${name}-${width}w-${quality}q${ext === ".svg" ? ext : ".webp"}`,
    );

    if (!fs.existsSync(outputPath)) {
      await fs.ensureDir(outputDir);
      await optimizeImage(inputPath, outputPath, width, quality);
    }

    return outputPath.replace(path.join(process.cwd(), "public"), "");
  } catch (error) {
    console.error(`Error ensuring optimized image for ${src}:`, error);
    throw error;
  }
}
