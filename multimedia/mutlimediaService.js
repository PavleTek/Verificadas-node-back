require("dotenv").config();
const sharp = require("sharp");
const path = require("path");
const prisma = require("../prisma.js");
const canvas = require("canvas");
const faceapi = require("face-api.js");
const fs = require("fs").promises;

// Patching the environment to use face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const beforeApprovalFolderPath = process.env.BEFORE_APPROVAL_IMAGES_FOLDER_PATH;
const imagesFolderPath = process.env.IMAGES_FOLDER_PATH;
const watermarkPath = process.env.WATERMARK_PATH;

function createimagesObject(request, active, bluredFace) {
  return {
    request: request,
    active: active,
    bluredFace: bluredFace,
  };
}

async function loadModels() {
  const modelsPath = path.join(__dirname, "..", "..", "face_models"); // Adjust the path to where you've stored the models
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
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
    const imagePath = path.join(__dirname, "..", beforeApprovalFolderPath, imageFileName);
    const outputPath = path.join(__dirname, "..", imagesFolderPath, imageFileName);

    // Load the input image and get its metadata
    const inputImage = sharp(imagePath);
    const inputMetadata = await inputImage.metadata();

    const editedWaterMarkPath = path.join(__dirname, watermarkPath);
    // Load the watermark image, resize it if necessary, and get its metadata
    const watermarkBuffer = await sharp(editedWaterMarkPath)
      .resize(200) // Optional: Resize watermark. Adjust or remove as necessary.
      .toBuffer();
    const watermarkMetadata = await sharp(watermarkBuffer).metadata();

    // Calculate the proportional size of the watermark
    const watermarkWidth = Math.round(inputMetadata.width); // Adjust the watermark size as necessary (20% of input image width)
    const watermarkHeight = Math.round((watermarkWidth / watermarkMetadata.width) * watermarkMetadata.height);

    // Resize the watermark image
    const resizedWatermarkBuffer = await sharp(watermarkBuffer).resize(watermarkWidth, watermarkHeight).toBuffer();

    // Calculate the position to center the watermark
    const left = inputMetadata.width / 2 - watermarkWidth / 2;
    const top = inputMetadata.height / 2 - watermarkHeight / 2;

    // Composite the watermark over the input image at the calculated position
    await inputImage
      .composite([
        {
          input: resizedWatermarkBuffer,
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

async function blurFaces(imageFileName) {
  try {
    //get image path and final path
    const imagePath = path.join(__dirname, "..", imagesFolderPath, imageFileName);
    const outputPath = path.join(__dirname, "..", imagesFolderPath, `blured_${imageFileName}`);
    // load models for face detection
    await loadModels();

    const inputImageBuffer = await canvas.loadImage(imagePath);
    const imageCanvas = canvas.createCanvas(inputImageBuffer.width, inputImageBuffer.height);
    const ctx = imageCanvas.getContext("2d");
    ctx.drawImage(inputImageBuffer, 0, 0);

    // Detect faces
    const detections = await faceapi.detectAllFaces(imageCanvas); // Adjusted to just detect faces without landmarks or descriptors
    if (detections.length > 0) {
      const det = detections[0]; // Get the first detection

      const { _x: x, _y: y, _width: width, _height: height } = det._box;
      const startX = parseInt(x);
      const startY = parseInt(y);
      const widthInt = parseInt(width);
      const heightInt = parseInt(height);

      try {
        const originalBuffer = await sharp(imagePath).toBuffer();

        // Blur the extracted region
        const blurredRegionBuffer = await sharp(originalBuffer).extract({ left: startX, top: startY, width: widthInt, height: heightInt }).blur(7).toBuffer();

        // Composite the blurred region onto the original image
        await sharp(originalBuffer)
          .composite([{ input: blurredRegionBuffer, left: startX, top: startY }])
          .toFile(outputPath);
      } catch (err) {
        // Handle errors
        console.error(err);
      }
    }

    return `blured_${imageFileName}`;
  } catch (error) {
    console.log(error);
    return "";
  }
}

async function deleteImage(imageFileName, type) {
  try {
    const imagePath = path.join(__dirname, "..", imagesFolderPath, imageFileName);
    const fileExists = await fs
      .access(imagePath)
      .then(() => true)
      .catch(() => false);
    if (fileExists) {
      await fs.unlink(imagePath);
    }
  } catch (error) {
    console.error(`Error deleting image ${imageFileName}:`, error);
    return false;
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
    const activeImagestToDelete = girl.images.active;
    const blurredFaceImagestoDelete = girl.images.bluredFace;
    const allImagesToDelete = activeImagestToDelete.concat(blurredFaceImagestoDelete);

    let activeImages = [];
    let bluredFaceImages = [];
    for (const image of requestImagesToApprove) {
      const watermarkedImage = await addWatermarkToImage(image);
      const bluredFaceImage = await blurFaces(image);
      if (bluredFaceImage !== "") {
        bluredFaceImages.push(bluredFaceImage);
      }
      if (watermarkedImage !== "") {
        activeImages.push(watermarkedImage);
      }
    }
    for (const image of allImagesToDelete) {
      await deleteImage(image, "active");
    }
    const newImagesObject = createimagesObject([], activeImages, bluredFaceImages);
    const updatedImagesGirl = await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: {
        images: newImagesObject,
      },
    });
    return { status: 200, data: newImagesObject };
  } catch (error) {
    return { status: 500, data: error };
  }
}

module.exports = { saveImagesRequestToGirl, approveImageRequestForGirl };
