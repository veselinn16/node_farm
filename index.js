const fs = require("fs");
const http = require("http");
const url = require("url");

/////////////////////////
// FILES

// Synchronous version of readFile
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocade: ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File is written!");

// Asynchronous version of readFile
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//         console.log("File is written!");
//       });
//     });
//   });
// });
// console.log("Will read file!");

/////////////////////////
// SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObj = JSON.parse(data);

const server = http.createServer((req, response) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    response.end("Overview page mane!");
  } else if (pathName === "/product") {
    response.end("Products mane");
  } else if (pathName === "/api") {
    response.writeHead(200, {
      "Content-type": "application/json"
    });
    response.end(data);
  } else {
    response.writeHead(404, {
      "Content-type": "text/html"
    });
    response.end("<h1>Invalid page mane</h1>");
  }
});

server.listen(8000, "127.0.0.1", () =>
  console.log("Listening for requests on port 8000")
);
