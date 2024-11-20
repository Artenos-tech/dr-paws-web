import fs from "fs-extra";
import path from "path";
import { optimizeImage } from "../lib/image-optimization";

const inputDir = "public/assets/images";
const outputDir = "public/assets/optimized-images";

async function optimizeImages(): Promise<void> {
  try {
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
        await optimizeImage(
          path.join(inputDir, file.name),
          outputDir,
          1920,
          80
        );
      }
    }

    console.log("Image optimization complete!");
  } catch (error) {
    console.error("Error during image optimization:", error);
    if ((error as NodeJS.ErrnoException).code === "EPERM") {
      console.error(
        "Permission denied. Make sure you have write access to the output directory."
      );
    } else if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(
        "The input directory does not exist. Please check the path."
      );
    }
    process.exit(1);
  }
}

async function processDirectory(
  inputPath: string,
  outputPath: string
): Promise<void> {
  try {
    await fs.ensureDir(outputPath);
    const files = await fs.readdir(inputPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await processDirectory(
          path.join(inputPath, file.name),
          path.join(outputPath, file.name)
        );
      } else {
        await optimizeImage(
          path.join(inputPath, file.name),
          outputPath,
          1920,
          80
        );
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${inputPath}:`, error);
    throw error;
  }
}

optimizeImages().catch(console.error);
