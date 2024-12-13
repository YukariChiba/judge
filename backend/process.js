import * as fs from "fs";
import * as cliProgress from "cli-progress";
import csv from "csvtojson";
import { MongoClient } from "mongodb";
import { exit, env } from "process";

const db_uri = env.db_uri;
const db_database = env.db_database;
const db_collection = env.db_collection;

const data_path = "../data";
const data_path_suffix = "裁判文书数据_马克数据网";
const data_file_suffix = "裁判文书数据";

const process_start_year = 2019;
const process_end_year = 2019;

const headers = [
  "source_link", // 原始链接
  "case_id", // 案号
  "title", // 案件名称
  "court", // 法院
  "region", // 所属地区
  "type", // 案件类型
  "type_id", // 案件类型编码
  "source", // 来源
  "judge_type", // 审理程序
  "judge_date", // 裁判日期
  "publish_date", // 公开日期
  "person", // 当事人
  "brief", // 案由
  "law_basis", // 法律依据
  "fulltext", // 全文
];

const csv_options = {
  headers: headers,
  fork: true,
  trim: false,
};

const client = new MongoClient(db_uri);
const database = client.db(db_database);
const judgedb = database.collection(db_collection);

const months = Array(12)
  .fill()
  .map((_, i) => i + 1);

function process_case(c) {
  // person 当事人
  if (c.person === "") c.person = [];
  else c.person = c.person.split(/[,；]/);
  // brief 案由
  if (c.brief === "") c.brief = null;
  // judge_type 审理程序
  if (c.judge_type === "") c.judge_type = null;
  // law_basis 法律依据
  if (c.law_basis === "") c.law_basis = [];
  else {
    const lawitems = c.law_basis.split("；");
    c.law_basis = lawitems.map((lawitem) => {
      const lawinfo = lawitem.split(/[:：]/);
      return { law: lawinfo[0], lawitem: lawinfo[1] };
    });
  }
  return c;
}

async function process(csvFilePath) {
  if (!fs.existsSync(csvFilePath)) return;
  var totcount = 0;
  await csv(csv_options)
    .fromFile(csvFilePath)
    .subscribe(async (jsonObj) => {
      await judgedb.insertOne(process_case(jsonObj));
      totcount++;
    });
  return totcount;
}

const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: true,
    hideCursor: true,
    format: " {bar} | {year} - {yearcount} | {value}/{total}",
  },
  cliProgress.Presets.shades_grey
);

async function process_year(year) {
  var yearcount = 0;
  const curyear = multibar.create();
  curyear.start(12, 0, { year: year, yearcount: yearcount });

  for (const month of months) {
    const padmonth = String(month).padStart(2, "0");
    const month_data_file = `${data_path}/${year}年${data_path_suffix}/${year}年${padmonth}月${data_file_suffix}.csv`;
    const processed_counts = await process(month_data_file);
    yearcount += processed_counts;
    curyear.increment(1, {
      year: year,
      yearcount: yearcount,
    });
    multibar.update();
  }
  curyear.stop();
  multibar.update();
}

const years = Array(process_end_year - process_start_year + 1)
  .fill()
  .map((_, i) => i + process_start_year);

const promises = years.map((year) => process_year(year));

await Promise.all(promises);

multibar.stop();

console.log("Done extracting!");

exit(0);
