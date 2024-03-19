require("dotenv").config();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const prisma = require("../prisma.js");
const { blurFaces } = require("face-api.js");

const imageFolderPath = process.env.IMAGES_FOLDER_PATH;
const watermarkPath = process.env.WATERMARK_PATH;

async function saveImagesRequestToGirl(images, girlId) {
  try {
    const imageFileNames = images.map((imageFile) => imageFile.filename);
    const girl = await prisma.girl.findUnique({
      where: {
        id: girlId,
      },
    });
    const girlOriginalImages = girl.images;
    girlOriginalImages.request = imageFileNames;
    const updatedGirl = await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: {
        images: girlOriginalImages,
      },
    });
    console.log(updatedGirl);
    return { status: 200 };
  } catch (error) {
    return { status: 500, data: error };
  }
}

async function addImageWatermarkCentered(inputImagePath, outputPath) {
  try {
    const inputFileName = "image_girlId56_1710027795222.jpg";
    const inputImagePath = path.join(__dirname, imageFolderPath, inputFileName);
    outputPath = path.join(__dirname, imageFolderPath, `_watermarked${inputFileName}`);

    // Load the input image and get its metadata
    const inputImage = sharp(inputImagePath);
    const inputMetadata = await inputImage.metadata();

    const editedWaterMarkPath = path.join(__dirname, watermarkPath);
    // Load the watermark image, resize it if necessary, and get its metadata
    const watermarkBuffer = await sharp(editedWaterMarkPath)
      .resize(200) // Optional: Resize watermark. Adjust or remove as necessary.
      .toBuffer();
    const watermarkMetadata = await sharp(watermarkBuffer).metadata();

    // Calculate the position to center the watermark
    const left = inputMetadata.width / 2 - watermarkMetadata.width / 2;
    const top = inputMetadata.height / 2 - watermarkMetadata.height / 2;

    // Composite the watermark over the input image at the calculated position
    await inputImage
      .composite([
        {
          input: watermarkBuffer,
          left: Math.round(left),
          top: Math.round(top),
          blend: "over",
        },
      ])
      .toFile(outputPath);

    console.log("Watermark added successfully");
    return { status: 200, data: {} };
  } catch (error) {
    console.error("Error adding image watermark:", error);
    return { status: 500, data: error };
  }
}

module.exports = { saveImagesRequestToGirl, addImageWatermarkCentered };
