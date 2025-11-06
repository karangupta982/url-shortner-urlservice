import cassandra from "cassandra-driver";
import dotenv from "dotenv";

dotenv.config();

const { ASTRA_DB_KEYSPACE, ASTRA_DB_APPLICATION_TOKEN } = process.env;

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  "token",
  ASTRA_DB_APPLICATION_TOKEN
);

const client = new cassandra.Client({
  cloud: {
    secureConnectBundle: "./secure-connect-url-shortner.zip",
  },
  keyspace: ASTRA_DB_KEYSPACE,
  authProvider,
});

export const ensureSchema = async () => {
  try {
    // Table 1: For direct lookups by short_id
    const createUrlsTableQuery = `
      CREATE TABLE IF NOT EXISTS urls (
        short_id text PRIMARY KEY,
        long_url text,
        user_id text,
        created_at timestamp,
        expiry timestamp
      );
    `;

    // Table 2: For listing all URLs by user_id efficiently
    const createUrlsByUserTableQuery = `
      CREATE TABLE IF NOT EXISTS urls_by_user (
        user_id text,
        short_id text,
        long_url text,
        created_at timestamp,
        expiry timestamp,
        PRIMARY KEY (user_id, short_id)
      );
    `;

    await client.execute(createUrlsTableQuery);
    console.log("Table 'urls' ensured (exists or created)");

    await client.execute(createUrlsByUserTableQuery);
    console.log("Table 'urls_by_user' ensured (exists or created)");

  } catch (err) {
    console.error("Error ensuring schema:", err);
  }
};

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to Astra DB (Cassandra CQL API)");
    await ensureSchema(); 
  } catch (err) {
    console.error("Cassandra connection error:", err);
    process.exit(1);
  }
};

export default client;
