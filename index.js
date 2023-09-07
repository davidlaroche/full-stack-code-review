import { app } from "./src/app.js";

const start = async () => {
  try {
    await app.listen({ port: 8000 });
    console.log(`⚡️ Server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
  }
};
start();
