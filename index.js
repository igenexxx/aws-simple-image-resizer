import {
  asyncPipe,
  createOrPutImageObject,
  getNewFilePath,
  getObject,
} from "./utils.js";
import {cropImage} from "./image-utils.js";

export const handler = async (event) => {
  const [{ s3: { bucket: { name: bucketName }, object: { key } } }] = event.Records;

  console.log("bucket", bucketName);
  console.log("key", key);

  try {
    return await asyncPipe(
      getObject(bucketName),
      cropImage(200, 200),
      createOrPutImageObject(bucketName, getNewFilePath(key)),
    )(key);
  } catch (err) {
    console.error("Error", err);
  }
}
