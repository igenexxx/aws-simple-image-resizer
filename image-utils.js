import {parse} from "node:path";
import sharp from "sharp";
import {getNewFilePath} from "./utils.js";

export const cropImage = async (image, width, height) => {
  return await sharp(image)
    .resize(width, height, {
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    })
    .toBuffer();
};

// get content type using file name
export const getContentType = (fileName) => {
  const {ext} = parse(fileName);

  return `image/${ext.replace('.', '')}`
}
