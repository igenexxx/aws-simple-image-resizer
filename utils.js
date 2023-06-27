import { parse } from 'node:path';
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { config } from "./config.js";
import {getContentType} from "./image-utils.js";

const s3 = new S3Client({ region: config.s3.region });
export const getObject = bucket => async (key) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  console.log("params", params);

  try {
    const { Body } = await s3.send(new GetObjectCommand(params));

    return Buffer.concat(await Body.toArray())
  } catch (err) {
    console.log("Get file error", err);
  }
};

export const createOrPutImageObject = (bucket, key) => async (body) => {
  const params = {
    Bucket: bucket.concat('-resized'),
    Key: key,
    Body: body,
    ContentType: getContentType(key),
  };

  console.log("params", params);

  try {
    await s3.send(new PutObjectCommand(params));
  } catch (err) {
    console.log("Put file error", err);
  }
}

export const getNewFilePath = (filePath) => {
  const { dir, name, ext } = parse(filePath);

  return `${dir}/${uuidv4()}-${name}${ext}`;
};

export const asyncPipe = (...fns) => (x) => fns.reduce(async (y, f) => f(await y), x);
