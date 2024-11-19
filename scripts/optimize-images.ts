import sharp from "sharp";
import fs from "fs-extra";
import path from "path";

const inputDir = "public/assets/images";
const outputDir = "public/assets/optimized-images";

async function optimizeImages(): Promise<void> {
  // Ensure output directory exists
  await fs.ensureDir(outputDir);

  // Get all files from the input directory
  const files = await fs.readdir(inputDir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      // Recursively process subdirectories
      await processDirectory(
        path.join(inputDir, file.name),
        path.join(outputDir, file.name)
      );
    } else {
      await optimizeImage(path.join(inputDir, file.name), outputDir);
    }
  }

  console.log("Image optimization complete!");
}

async function processDirectory(
  inputPath: string,
  outputPath: string
): Promise<void> {
  await fs.ensureDir(outputPath);
  const files = await fs.readdir(inputPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      await processDirectory(
        path.join(inputPath, file.name),
        path.join(outputPath, file.name)
      );
    } else {
      await optimizeImage(path.join(inputPath, file.name), outputPath);
    }
  }
}

async function optimizeImage(
  inputPath: string,
  outputDir: string
): Promise<void> {
  const { name, ext } = path.parse(inputPath);
  const outputPath = path.join(outputDir, `${name}.webp`);

  if (ext.toLowerCase() === ".svg") {
    // For SVG files, just copy them without conversion
    await fs.copyFile(inputPath, path.join(outputDir, `${name}${ext}`));
    console.log(`Copied: ${inputPath}`);
  } else {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .resize({ width: 1920, height: 1080, fit: "inside" })
      .toFile(outputPath);
    console.log(`Optimized: ${inputPath}`);
  }
}

optimizeImages().catch(console.error);
