import { parse } from 'node:fs';
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { config } from "./config.js";
import { tmpdir } from "node:os";
import {getContentType} from "./image-utils.js";

const s3 = new S3Client({ region: config.s3.region });
export const getObject = async (bucket, key) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const { Body } = await s3.send(new GetObjectCommand(params));
    return Body;
  } catch (err) {
    console.log("Error", err);
  }
};

// upload file to s3
const createOrPutImageObjectOriginal = async (bucket, key, body) => {
  const params = {
    Bucket: bucket.concat('-resized'),
    Key: key,
    Body: body,
    ContentType: getContentType(key),
  };

  try {
    await s3.send(new PutObjectCommand(params));
  } catch (err) {
    console.log("Error", err);
  }
}

export const getNewFilePath = (filePath) => {
  const { dir, name, ext } = parse(filePath);

  return `${dir}/${uuidv4()}-${name}${ext}`;
};

export const partialRight = (fn,...presetArgs) => (...laterArgs) => fn( ...laterArgs, ...presetArgs );

export const partial = (fn) => {
  const curryize = (...startParams) => (...remainedParams) => {
    const allParams = [...startParams, ...remainedParams];
    return allParams.length < fn.length ? curryize(...allParams) : fn(...allParams);
  };

  return curryize();
};

export const asyncPipe = (...fns) => (x) => fns.reduce(async (y, f) => f(await y), x);

export const createOrPutImageObject = partial(createOrPutImageObjectOriginal);
