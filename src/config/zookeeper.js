import zookeeper from "node-zookeeper-client";
import dotenv from "dotenv";

dotenv.config();

const ZK_CONNECTION_STRING = process.env.ZOOKEEPER_URL || "localhost:2181";
const WORKER_PATH = "/workers";

export const getWorkerId = () => {
  return new Promise((resolve, reject) => {
    const client = zookeeper.createClient(ZK_CONNECTION_STRING);

    client.once("connected", () => {
      console.log("Connected to ZooKeeper");

      // Ensure /workers exists
      client.exists(WORKER_PATH, (err, stat) => {
        if (err) return reject(err);

        if (!stat) {
          client.create(WORKER_PATH, null, zookeeper.CreateMode.PERSISTENT, (error) => {
            if (error && error.getCode() !== zookeeper.Exception.NODE_EXISTS) {
              return reject(error);
            }

            createWorkerNode();
          });
        } else {
          createWorkerNode();
        }
      });

      function createWorkerNode() {
        client.create(
          `${WORKER_PATH}/worker-`,
          null,
          zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL,
          (error, path) => {
            if (error) return reject(error);
            const workerId = path.split("-").pop();
            console.log("Assigned Worker ID:", workerId);
            resolve(parseInt(workerId));
            client.close();
          }
        );
      }
    });

    client.connect();
  });
};
