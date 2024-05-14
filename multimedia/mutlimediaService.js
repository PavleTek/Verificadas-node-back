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

const watermarkPath = process.env.WATERMARK_PATH;

const imagesFolder = process.env.MULTIMEDIA_IMAGES_FOLDER;
const pendingImagesFolder = process.env.PENDING_MULTIMEDIA_IMAGES_FOLDER;
const videosFolder = process.env.MULTIMEDIA_VIDEOS_FOLDER;
const pendingVideosFolder = process.env.PENDING_MULTIMEDIA_VIDEOS_FOLDER;
const faceModelsFolder = process.env.FACE_MODELS_FOLDER;
const watermarkFileName = process.env.WATERMARK_FILENAME;

async function getAllFileNamesFromFolder(folder) {
  try {
    const folderPath = path.join(__dirname, "..", "..", folder);
    const filesAndDirectories = await fs.readdir(folderPath);

    // Optionally, if you want to include only files and exclude directories,
    // you can further filter the result using fs.stat (this step is optional)
    const filesOnly = [];
    for (const item of filesAndDirectories) {
      const fullPath = `${folderPath}/${item}`;
      const stat = await fs.stat(fullPath);
      if (stat.isFile()) {
        filesOnly.push(item);
      }
    }

    // Return the array of filenames
    return filesOnly;
  } catch (error) {
    console.error("Failed to read folder or process files:", error);
    throw error; // or return an empty array, depending on how you want to handle errors
  }
}

function createimagesObject(request, active, bluredFace) {
  return {
    request: request,
    active: active,
    bluredFace: bluredFace,
  };
}

async function loadModels() {
  const modelsPath = path.join(__dirname, "..", "..", faceModelsFolder); // Adjust the path to where you've stored the models
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
}

async function saveImagesRequestToGirl(images, girlId) {
  try {
    const now = new Date();
    const imageFileNames = images.map((imageFile) => imageFile.filename);
    const girl = await prisma.girl.findUnique({
      where: {
        id: girlId,
      },
    });
    const girlUser = await prisma.user.findUnique({
      where: {
        girlId: girlId,
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
    if (girlUser !== undefined) {
      await prisma.notification.create({
        data: {
          type: "MultimediaRequest",
          fromUserId: girlUser.id,
          date: now,
          searchId: girlUser.id,
        },
      });
    }
    return { status: 200, data: girlImages };
  } catch (error) {
    console.log(error);
    return { status: 500, data: error };
  }
}

async function compressAndResizeImage(imageBuffer, targetSize, width, height) {
  let quality = 90;
  let compressedImage = await sharp(imageBuffer)
    .resize(width, height)
    .jpeg({ quality })
    .toBuffer();
  let imageSize = compressedImage.length;

  while (imageSize > targetSize && quality > 10) {
    quality -= 5;
    compressedImage = await sharp(imageBuffer)
      .resize(width, height)
      .jpeg({ quality })
      .toBuffer();
    imageSize = compressedImage.length;
  }

  return compressedImage;
}

async function setMainActiveImage(req) {
  try {
    const { mainImageIndex, girlId } = req.body;
    const girl = await prisma.girl.findUnique({
      where: {
        id: girlId,
      },
    });
    const request = [...girl.images.request];
    const active = [...girl.images.active];
    const bluredFace = [...girl.images.bluredFace];
    if (mainImageIndex >= 0 && mainImageIndex < active.length) {
      const item = active.splice(mainImageIndex, 1)[0];
      active.unshift(item);
    }
    if (mainImageIndex >= 0 && mainImageIndex < bluredFace.length) {
      const item = bluredFace.splice(mainImageIndex, 1)[0];
      bluredFace.unshift(item);
    }
    const updatedImages = createimagesObject(request, active, bluredFace);
    await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: {
        images: updatedImages,
      },
    });
    return { status: 200, data: updatedImages };
  } catch (error) {
    console.error("Error setting girl main image");
    return { status: 500, data: error };
  }
}

async function saveProfilePictureRequestToGirl(images, girlId) {
  try {
    const now = new Date();
    const imageFileNames = images.map((imageFile) => imageFile.filename);
    const profilePictureRequestName = imageFileNames[0];
    const girlUser = await prisma.user.findUnique({
      where: {
        girlId: girlId,
      },
    });
    await prisma.girl.update({
      where: {
        id: girlId,
      },
      data: {
        requestProfilePicture: profilePictureRequestName,
      },
    });
    if (girlUser !== undefined) {
      await prisma.notification.create({
        data: {
          type: "MultimediaRequest",
          fromUserId: girlUser.id,
          date: now,
          searchId: girlUser.id,
        },
      });
    }
    return { status: 200, data: profilePictureRequestName };
  } catch (error) {
    console.log(error);
    return { status: 500, data: error };
  }
}

async function approveProfilePictureForGirl(girlId) {
  try {
    const girl = await prisma.girl.findUnique({
      where: {
        id: girlId,
      },
    });
    const approvedProfilePicture = girl.requestProfilePicture;
    if (approvedProfilePicture) {
      const imagePath = path.join(__dirname, "..", "..", pendingImagesFolder, approvedProfilePicture);
      const outputPath = path.join(__dirname, "..", "..", imagesFolder, approvedProfilePicture);
      const imageBuffer = await fs.readFile(imagePath);

      // Target maximum file size in bytes
      const MAX_SIZE = 10 * 1024; // 10KB
      let compressedImage = await compressImageToTargetSize(imageBuffer, MAX_SIZE);

      // Write the compressed image to the output path
      await fs.writeFile(outputPath, compressedImage);

      // Update database after image processing
      if (girl.profilePicture !== "") {
        await deleteImage(girl.profilePicture);  // Ensure deleteImage function is implemented
      }

      const girlUser = await prisma.user.findUnique({
        where: {
          girlId: girlId,
        },
      });

      await prisma.girl.update({
        where: {
          id: girlId,
        },
        data: {
          profilePicture: approvedProfilePicture,
          requestProfilePicture: null,
        },
      });

      await prisma.notification.deleteMany({
        where: {
          fromUserId: girlUser.id,
        },
      });

      return { status: 200, data: approvedProfilePicture };
    } else {
      return { status: 500, data: "There was no profile picture to approve" };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, data: error };
  }
}

async function addWatermarkToImage(imageFileName) {
  try {
    const imagePath = path.join(__dirname, "..", "..", pendingImagesFolder, imageFileName);
    const outputPath = path.join(__dirname, "..", "..", imagesFolder, imageFileName);
    const completeWaterMarkPath = path.join(__dirname, "..", "..", watermarkFileName);

    // Load the input image and get its metadata
    const inputImage = sharp(imagePath);
    const inputMetadata = await inputImage.metadata();

    // First, ensure the watermark is resized correctly
    const watermarkResizeOptions = {
      width: parseInt(inputMetadata.width * 0.98),
      // Remove the height property to allow proportional resizing based solely on width
      fit: sharp.fit.inside, // Ensures the watermark is scaled down to fit within the input image dimensions, maintaining aspect ratio
    };

    // Resize the watermark
    const resizedWatermark = sharp(completeWaterMarkPath).resize(watermarkResizeOptions);
    const resizedWatermarkBuffer = await resizedWatermark.toBuffer();
    const watermarkMetadata = await sharp(resizedWatermarkBuffer).metadata();

    // Calculate the position to center the watermark
    const left = (inputMetadata.width - watermarkMetadata.width) / 2;
    const top = (inputMetadata.height - watermarkMetadata.height) / 2;

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
    console.log("Adding Watermark Error", error);
    return "";
  }
}

async function blurFaces(imageFileName) {
  try {
    //get image path and final path
    const imagePath = path.join(__dirname, "..", "..", imagesFolder, imageFileName);
    const outputPath = path.join(__dirname, "..", "..", imagesFolder, `blured_${imageFileName}`);
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
        const blurredRegionBuffer = await sharp(originalBuffer).extract({ left: startX, top: startY, width: widthInt, height: heightInt }).blur(9).toBuffer();

        // Composite the blurred region onto the original image
        await sharp(originalBuffer)
          .composite([{ input: blurredRegionBuffer, left: startX, top: startY }])
          .toFile(outputPath);
      } catch (err) {
        console.error(err);
      }
    } else {
      const originalBuffer = await sharp(imagePath).toBuffer();
      await sharp(originalBuffer).toFile(outputPath);
    }

    return `blured_${imageFileName}`;
  } catch (error) {
    console.log("Bluring Faces Error", error);
    return "";
  }
}

async function deleteImage(imageFileName, type) {
  try {
    const imagePath = path.join(__dirname, "..", "..", imagesFolder, imageFileName);
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

async function deleteRequestImage(imageFileName, type) {
  try {
    const imagePath = path.join(__dirname, "..", "..", pendingImagesFolder, imageFileName);
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
    const girlUser = await prisma.user.findFirst({
      where: {
        girlId: girlId,
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
    await prisma.notification.deleteMany({
      where: {
        fromUserId: girlUser.id,
      },
    });
    return { status: 200, data: newImagesObject };
  } catch (error) {
    console.error("Error approving images", error);
    return { status: 500, data: error };
  }
}

async function cleanMultimediaData() {
  try {
    const allGirls = await prisma.girl.findMany();
    let imagesToKeep = [];
    // let videosToKeep = [];
    const allRequestImages = await getAllFileNamesFromFolder(pendingImagesFolder);
    // const alLRequestVideos = await getAllFileNamesFromFolder(beforeApproveVideoFolderPath);
    allGirls.forEach((girl) => {
      if (girl.requestProfilePicture) {
        imagesToKeep.push(girl.requestProfilePicture);
      }
      imagesToKeep = imagesToKeep.concat(girl.images.request);
      // videosToKeep = videosToKeep.concat(girl.videos.request);
    });
    const imagesToDelete = allRequestImages.filter((element) => !imagesToKeep.includes(element));
    imagesToDelete.forEach(async (image) => {
      await deleteRequestImage(image);
    });
    // // const videosToDelete = array1.filter((element) => !array2.includes(element));
    // videosToDelete.forEach(async image => {
    //   await deleteImage(image)
    // });
    return { status: 200 };
  } catch (error) {
    console.error("Error trying to clean multimedia", error);
    return { status: 200, data: error };
  }
}

module.exports = {
  saveImagesRequestToGirl,
  approveImageRequestForGirl,
  saveProfilePictureRequestToGirl,
  approveProfilePictureForGirl,
  setMainActiveImage,
  cleanMultimediaData,
};
