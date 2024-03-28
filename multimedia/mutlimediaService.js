require("dotenv").config();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const prisma = require("../prisma.js");
const { blurFaces } = require("face-api.js");
const { request } = require("http");

const beforeApprovalFolderPath = "../" + process.env.BEFORE_APPROVAL_IMAGES_FOLDER_PATH;
const imagesFolderPath = "../" + process.env.IMAGES_FOLDER_PATH;
const watermarkPath = process.env.WATERMARK_PATH;

function createimagesObject(request, active, bluredFace) {
  return {
    request: request,
    active: active,
    blurredFaceActive: bluredFace,
  };
}

async function saveImagesRequestToGirl(images, girlId) {
  try {
    const imageFileNames = images.map((imageFile) => imageFile.filename);
    const girl = await prisma.girl.findUnique({
      where: {
        id: girlId,
      },
    });
    const girlImages = girl.images;
    girlImages.request = imageFileNames;
    await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: {
        images: girlImages,
      },
    });
    return { status: 200, data: girlImages };
  } catch (error) {
    console.log(error);
    return { status: 500, data: error };
  }
}

async function addWatermarkToImage(imageFileName) {
  try {
    const imagePath = path.join(__dirname, beforeApprovalFolderPath, imageFileName);
    const outputPath = path.join(__dirname, imagesFolderPath, imageFileName);

    // Load the input image and get its metadata
    const inputImage = sharp(imagePath);
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
    return `${imageFileName}`;
  } catch (error) {
    console.log(error);
    return "";
  }
}

async function approveImageRequestForGirl(girlId) {
  try {
    const girl = await prisma.girl.findUnique({
      where: {
        id: girlId,
      },
    });
    const requestImagesToApprove = girl.images.request;
    let activeImages = [];
    for (const image of requestImagesToApprove) {
      const waterMarkedImage = await addWatermarkToImage(image);
      if (waterMarkedImage !== "") {
        activeImages.push(waterMarkedImage);
      }
    }
    const newImagesObject = createimagesObject([], activeImages, []);
    const updatedImagesGirl = await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: {
        images: newImagesObject,
      },
    });
    console.log("should be returning 200");
    return { status: 200, data: newImagesObject };
  } catch (error) {
    return { status: 500, data: error };
  }
}

module.exports = { saveImagesRequestToGirl, approveImageRequestForGirl };
