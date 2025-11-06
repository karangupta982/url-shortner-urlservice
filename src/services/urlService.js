import { createUrl, findUrlByShortId, deleteUrlByShortId, getAllUrlsByUser } from "../models/urlModel.js";
import { encodeBase64 } from "../utils/base64Encoder.js";
import { Snowflake } from "./snowflakeService.js";
import { getWorkerId } from "../config/zookeeper.js";

let snowflake;

(async () => {
  const workerId = await getWorkerId();
  snowflake = new Snowflake(workerId);
})();

export const shortenUrlService = async (longUrl, userId, expiry) => {
  const snowflakeId = snowflake.nextId();
  const shortId = encodeBase64(snowflakeId);

  await createUrl(shortId, longUrl, userId, expiry);
  return { shortId, longUrl };
};

export const getUrlByShortIdService = async (shortId) => {
  return await findUrlByShortId(shortId);
};

export const deleteUrlService = async (shortId) => {
  await deleteUrlByShortId(shortId);
};

export const getAllUrlsService = async (userId) => {
  return await getAllUrlsByUser(userId);
};
