import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import { env } from "process";

const db_uri = env.db_uri;
const db_database = env.db_database;
const db_collection = env.db_collection;

const app = express();
const address = env.api_address || "0.0.0.0";
const port = env.api_port || 3010;

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors());

const client = new MongoClient(db_uri);
const database = client.db(db_database);
const judgedb = database.collection(db_collection);

function jsonError(str) {
  return {
    message: str,
  };
}

function parseLimits(req) {
  const page = parseInt(req.params.page) || 1;
  const limit = Math.min(parseInt(req.params.limit) || 10, 100);
  const sort = {};
  sort[req.params.sortkey || "_id"] = 1;
  if (req.params.sortorder == "asc" || req.params.sortorder == 1)
    sort[req.params.sortkey || "_id"] = 1;
  else if (req.params.sortorder == "desc" || req.params.sortorder == -1)
    sort[req.params.sortkey || "_id"] = -1;
  const startIndex = (page - 1) * limit;
  return { startIndex, limit, sort };
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/cases/:page?/:limit?/:sortkey?/:sortorder?", async (req, res) => {
  const allowedsortkey = [
    "_id",
    "case_id",
    "type",
    "judge_type",
    "judge_date",
    "region",
  ];
  if (req.params.sortkey && !allowedsortkey.includes(req.params.sortkey)) {
    res.status(400).send(jsonError("Invalid argument"));
    return;
  }
  const allowedquerykeys = ["type_id", "judge_type", "person", "court"];
  if (
    req.query &&
    !Object.keys(req.query).every((v) => allowedquerykeys.includes(v))
  ) {
    res.status(400).send(jsonError("Invalid argument"));
    return;
  }
  const { startIndex, limit, sort } = parseLimits(req);
  let result = await judgedb
    .find(req.query, { projection: { fulltext: 0 } })
    .skip(startIndex)
    .limit(limit)
    .sort(sort)
    .toArray();
  var total = await judgedb.find(req.query).limit(1000).count();
  if (total == 1000) total = await judgedb.estimatedDocumentCount();
  if (!result) {
    res.status(404).send(jsonError("Not found"));
    return;
  } else res.send({ total, result }).status(200);
});

app.get("/case/:id", async (req, res) => {
  if (!req.params.id || !/^[0-9a-f]{24}$/.test(req.params.id)) {
    res.status(400).send(jsonError("Invalid argument"));
    return;
  }
  let result = await judgedb.findOne({ _id: new ObjectId(req.params.id) });
  if (!result) {
    res.status(404).send(jsonError("Not found"));
    return;
  } else res.send(result).status(200);
});

// TODO: performance issue
app.get("/group/:row", async (req, res) => {
  const allowed = ["region", "type", "judge_type"];
  if (!allowed.includes(req.params.row)) {
    res.send(jsonError("Invalid argument")).status(400);
    return;
  }
  let result = await judgedb.distinct(req.params.row);
  if (!result) {
    res.status(404).send(jsonError("Not found"));
    return;
  } else res.send(result).status(200);
});

app.get("/random", async (req, res) => {
  let result = await judgedb.aggregate([{ $sample: { size: 1 } }]).toArray();
  if (!result) {
    res.status(404).send(jsonError("Not found"));
    return;
  } else res.send(result[0]).status(200);
});

app.get("/count", async (_, res) => {
  const result = await judgedb.estimatedDocumentCount();
  res.send({ count: result }).status(200);
});

app.listen(port, address, () => {
  console.log(`listening on port ${port}`);
});
