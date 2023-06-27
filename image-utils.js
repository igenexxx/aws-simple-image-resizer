import {parse} from "node:path";
import sharp from "sharp";

export const cropImage = (width, height) => async (image) => {
  try {
    return await sharp(image)
      .resize(width, height, {
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .toBuffer();
  } catch (err) {
    console.log("Crop image error", err);
  }
};

export const getContentType = (fileName) => {
  const {ext} = parse(fileName);

  return `image/${ext.replace('.', '')}`
}
