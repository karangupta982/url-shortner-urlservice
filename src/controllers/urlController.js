import { createUrl, findUrlByShortId, deleteUrlByShortId, getAllUrlsByUser } from "../models/urlModel.js";
import { encodeBase64 } from "../utils/base64Encoder.js";
import { Snowflake } from "../services/snowflakeService.js";
import { getWorkerId } from "../config/zookeeper.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { snowflake } from "../server.js";




export const shortenUrl = async (req, res, next) => {
  try {
    console.log("Shorten URL controller triggered");
    const { longUrl, expiry } = req.body;
    const userId = req.user?.id || "anonymous";

    console.log("long Id", longUrl);
    console.log("expiry", expiry);
    if (!snowflake) throw new Error("Snowflake ID generator not initialized");

    const snowflakeId = snowflake.nextId();
    const shortId = encodeBase64(snowflakeId);

    await createUrl(shortId, longUrl, userId, expiry);

    return successResponse(res, { shortId, longUrl });
  } catch (err) {
    next(err);
  }
};


export const getUrl = async (req, res, next) => {
  try {
    const { shortId } = req.params;
    console.log("####Fetching URL for shortId:#######", shortId);
    const url = await findUrlByShortId(shortId);
    if (!url) return errorResponse(res, "URL not found", 404);
    // return successResponse(res, url);
    return res.redirect(url);
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const userId = req.user?.id || "anonymous";

    await deleteUrlByShortId(shortId, userId);

    return successResponse(res, "URL deleted successfully");
  } catch (err) {
    next(err);
  }
};

export const getAllUrls = async (req, res, next) => {
  try {
    const urls = await getAllUrlsByUser(req.user.id);
    return successResponse(res, urls);
  } catch (err) {
    next(err);
  }
};
