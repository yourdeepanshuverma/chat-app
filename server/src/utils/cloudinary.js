import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { getBase64 } from "../lib/helper.js";

const uploadToCloudinary = asyncHandler(async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const filePromises = await Promise.all(uploadPromises);

    const formattedFiles = filePromises.map((file) => ({
      public_id: file.public_id,
      url: file.secure_url,
    }));
    return formattedFiles;
  } catch (error) {
    throw new Error("Failed to upload files to Cloudinary", error);
  }
});

const deleteFromCloudinary = asyncHandler(async () => {
  console.log("deleted");
});

export { uploadToCloudinary, deleteFromCloudinary };
