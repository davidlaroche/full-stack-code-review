import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";

import { parse } from "csv-parse";
import Fastify from "fastify";
import Fstatic from "@fastify/static";
import multipart from "@fastify/multipart";
import pino from "pino";
import pretty from "pino-pretty";

import { insertRows, selectRows } from "./crud.js";

export async function parseCSV(filename) {
  return new Promise((resolve, _) => {
    const records = [];
    const parser = parse(fs.readFileSync(filename), {
      delimiter: ",",
      skip_empty_lines: true,
      skip_records_with_error: true,
    });
    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    parser.on("end", function () {
      parser.end();
      resolve(records);
    });
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logger = pino(pretty());
export const app = Fastify({
  logger,
  disableRequestLogging: true,
});

// Plugins
app.register(multipart);
app.register(Fstatic, {
  root: path.join(__dirname, "..", "public"),
  prefix: "/public/",
});

// Routes
app.get("/favicon.ico", function (_, reply) {
  reply.code(404).send();
});
app.get("/", function (_, reply) {
  reply.sendFile("index.html");
});

app.post("/", async function (request, reply) {
  const body = await request.file();
  const email = body.fields.email.value;
  const fileData = body.fields.file;

  if (!email || !fileData) {
    reply.status(400).send({ status: "ko" });
  } else {
    // Write file
    const buffer = await body.toBuffer();
    const filename = `${randomBytes(8).toString("hex")}.csv`;
    const destFolder = path.join(__dirname, "..", "uploads", email);
    const pathToFile = path.join(destFolder, filename);
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder);
    }
    fs.writeFileSync(pathToFile, buffer, {
      encoding: "utf-8",
    });

    // Parse Data
    let dataset = await parseCSV(pathToFile);
    console.log({ dbg: dataset.length });
    // Insert in DB
    await insertRows(email, dataset);
    console.log(
      "[%s] Insert %s record(s) for %s",
      new Date(Date.now()).toISOString(),
      dataset.length,
      email
    );
    reply.send({ status: "ok", size: dataset.length });
  }
});
