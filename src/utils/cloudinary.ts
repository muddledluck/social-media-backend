import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";

const setupCloudinary = () => {
  // Return "https" URLs by setting secure: true
  cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
};

export const uploadImage = async (
  imagePath: string,
  customOptions: UploadApiOptions
): Promise<UploadApiResponse | undefined> => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    ...customOptions,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getAssetInfo = async (publicId: string) => {
  // Return colors in the response
  const options = {
    colors: true,
  };

  try {
    // Get details about the asset
    const result = await cloudinary.api.resource(publicId, options);
    console.log({ assetInfo: result });
    return result.colors;
  } catch (error) {
    console.error(error);
  }
};

export default setupCloudinary;
