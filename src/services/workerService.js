import zookeeper from "node-zookeeper-client";
import dotenv from "dotenv";

dotenv.config();

const ZK_CONNECTION_STRING = process.env.ZOOKEEPER_URL || "localhost:2181";
const WORKER_PATH = "/workers";

export const registerWorker = async () => {
  return new Promise((resolve, reject) => {
    const client = zookeeper.createClient(ZK_CONNECTION_STRING);

    client.once("connected", () => {
      console.log("Connected to ZooKeeper for worker registration.");

      client.exists(WORKER_PATH, (err, stat) => {
        if (err) return reject(err);

        if (!stat) {
          client.create(WORKER_PATH, (error) => {
            if (error && error.getCode() !== zookeeper.Exception.NODE_EXISTS) {
              return reject(error);
            }
            createWorkerNode(client, resolve, reject);
          });
        } else {
          createWorkerNode(client, resolve, reject);
        }
      });
    });

    client.connect();
  });
};

const createWorkerNode = (client, resolve, reject) => {
  client.create(
    `${WORKER_PATH}/worker-`,
    Buffer.from("active"),
    zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL,
    (error, path) => {
      if (error) return reject(error);

      const workerId = parseInt(path.split("-").pop());
      console.log("Worker registered with ID:", workerId);
      resolve(workerId);
    }
  );
};
