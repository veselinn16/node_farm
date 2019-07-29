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
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(
    /{%NOT_ORGANIC%}/g,
    product.organic ? "organic" : "not-organic"
  );

  return output;
};

// JSON
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

// Array of JS ojects
const dataObj = JSON.parse(data);

const server = http.createServer((req, response) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    // Overview page
    response.writeHead(200, {
      "Content-type": "text/html"
    });

    // loop over products and replace template code with real data
    const cardsHTML = dataObj
      .map(el => replaceTemplate(templateCard, el))
      .join("");

    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

    response.end(output);
  } else if (pathName === "/product") {
    // Product page
    response.end("Products mane");
  } else if (pathName === "/api") {
    // API
    response.writeHead(200, {
      "Content-type": "application/json"
    });
    response.end(data);
  } else {
    // 404 page
    response.writeHead(404, {
      "Content-type": "text/html"
    });
    response.end("<h1>Invalid page mane</h1>");
  }
});

server.listen(8000, "127.0.0.1", () =>
  console.log("Listening for requests on port 8000")
);
