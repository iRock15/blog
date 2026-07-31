const fs = require("fs/promises");

const readFile = async (fileName) => {
  return JSON.parse(await fs.readFile(fileName, "utf-8"));
};

const writeFile = async (fileName, data) => {
  await fs.writeFile(fileName, JSON.stringify(data), "utf-8");
};
module.exports = { readFile, writeFile };
