import { createDbConnection } from "./db.js";
import { encryptData } from "./encrypt.js";

const tableName = "export";
let db = createDbConnection();

export async function insertRows(email, dataset) {
  dataset.map(async (record) => {
    await insertRow(email, record);
  });
  return 1;
}

async function insertRow(email, rawData) {
  const [url, username, pass, totp, extra, name, grouping, fav] = rawData;

  const result = await exists(email, url, username);
  if (!result) {
    db.run(
      `INSERT INTO ${tableName} (owner_email, url, username, password, totp, extra, name, grouping, fav) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        url,
        username,
        encryptData(pass),
        totp,
        extra,
        name,
        grouping,
        fav,
      ],
      function (error) {
        if (error) {
          console.error("SQL - cannot insert", error.message);
        }
        console.log(`Inserted a row for`, email);
      }
    );
  }
}

function exists(email, url, username) {
  return new Promise((resolve, _) => {
    const query = `SELECT * FROM ${tableName} WHERE owner_email = '${email}' AND url = '${url}' AND username = '${username}'`;
    db.all(query, function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        resolve(!!rows.length);
      }
    });
  });
}

export async function selectRows() {
  return new Promise((resolve, _) => {
    let records = [];
    db.each(
      `SELECT * FROM ${tableName}`,
      (error, row) => {
        records.push(row);
      },
      () => {
        resolve(records);
      }
    );
  });
}
