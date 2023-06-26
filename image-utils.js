import {parse} from "node:path";
import sharp from "sharp";

export const cropImage = async (image, width, height) => {
  return await sharp(image)
    .resize(width, height, {
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    })
    .toBuffer();
};

export const getContentType = (fileName) => {
  const {ext} = parse(fileName);

  return `image/${ext.replace('.', '')}`
}
