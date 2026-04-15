import { v2 as cloudinary } from "cloudinary";
import {
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} from "../utils/config.js";
import fs from "fs";
import path from "path";
import ApiError from "../utils/ApiError.js";

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

export const uploadOnCloudinary = async (localFilePath, folder) => {
  // check if file path exists
  if (!fs.existsSync(localFilePath)) {
    throw new ApiError(404, `File not found at ${localFilePath}`);
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto",
    });

    // delete local file after successful upload
    fs.unlinkSync(localFilePath);

    return {
      secure_url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    // delete local file even if upload fails
    fs.unlinkSync(localFilePath);
    throw new ApiError(500, error.message);
  }
};
