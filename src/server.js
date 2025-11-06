import app from "./app.js";
import dotenv from "dotenv";
import { getWorkerId } from "./config/zookeeper.js";
import { Snowflake } from "./services/snowflakeService.js";
import {connectDB} from "./config/db.js";

await connectDB();

dotenv.config();

const PORT = process.env.PORT || 5002;

export let snowflake;

const init = async () => {
  try {
    const workerId = await getWorkerId();
    console.log("Connecting to Zookeeper to get worker ID...");
    snowflake = new Snowflake(workerId);
    console.log(`Snowflake initialized with worker ID: ${workerId}`);
    
    app.listen(PORT, () => {
      console.log(`URL Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1);
  }
};

init();
