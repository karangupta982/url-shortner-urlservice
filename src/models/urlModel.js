import client from "../config/db.js";

const TABLE = "urls";
const TABLE_BY_USER = "urls_by_user";



export const createUrl = async (shortId, longUrl, userId, expiry) => {
  const query1 = `
    INSERT INTO ${TABLE} (short_id, long_url, user_id, created_at, expiry)
    VALUES (?, ?, ?, toTimestamp(now()), ?)
  `;
  const query2 = `
    INSERT INTO ${TABLE_BY_USER} (user_id, short_id, long_url, created_at, expiry)
    VALUES (?, ?, ?, toTimestamp(now()), ?)
  `;

  await client.batch([
    { query: query1, params: [shortId, longUrl, userId, expiry] },
    { query: query2, params: [userId, shortId, longUrl, expiry] },
  ], { prepare: true });
};


export const findUrlByShortId = async (shortId) => {
  const query = `SELECT * FROM ${TABLE} WHERE short_id = ?`;
  const result = await client.execute(query, [shortId], { prepare: true });
  console.log(result.rows[0]);
//   return result.rows[0].long_url;
  return result.rows[0].long_url;
};

export const deleteUrlByShortId = async (shortId, userId) => {
  const query1 = `DELETE FROM ${TABLE} WHERE short_id = ?`;
  const query2 = `DELETE FROM ${TABLE_BY_USER} WHERE user_id = ? AND short_id = ?`;

  await client.batch([
    { query: query1, params: [shortId] },
    { query: query2, params: [userId, shortId] },
  ], { prepare: true });
};



export const getAllUrlsByUser = async (userId) => {
  const query = `SELECT * FROM ${TABLE_BY_USER} WHERE user_id = ?`;
  const result = await client.execute(query, [userId], { prepare: true });
  return result.rows;
};
