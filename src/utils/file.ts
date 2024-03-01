import * as fs from "fs";

export const readFromJSON = (file: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", function (err, data) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

export const writeToJSON = (file: string, data: any) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify(data), "utf-8", function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
