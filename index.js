import {asyncPipe, createOrPutImageObject, getNewFilePath, getObject, partialRight} from "./utils.js";
import {cropImage} from "./image-utils.js";

export const handler = async (event) => {
  const { bucket, key } = event.Records[0].s3.object;

  return await asyncPipe(
    getObject,
    partialRight(cropImage, 200, 200),
    createOrPutImageObject(bucket, getNewFilePath(key)),
  ).catch(console.error);
}
