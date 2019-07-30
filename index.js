const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////
// SERVER
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// JSON
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

// Array of JS ojects
const dataObj = JSON.parse(data);

// Construct array of slugged product names
const slugs = dataObj.map(el =>
  slugify(el.productName, {
    lower: true
  })
);

const server = http.createServer((req, response) => {
  // query is the id of the product
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    // Overview page
    response.writeHead(200, {
      'Content-type': 'text/html'
    });

    // loop over products and replace template code with real data
    const cardsHTML = dataObj
      .map(el => replaceTemplate(templateCard, el))
      .join('');

    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);

    response.end(output);
  } else if (pathname === '/product') {
    // Product page
    // Get the appropriate product
    const product = dataObj[query.id];

    // Expect HTML to be served
    response.writeHead(200, {
      'Content-type': 'text/html'
    });

    // Replace template code with product data
    const output = replaceTemplate(templateProduct, product);

    response.end(output);
  } else if (pathname === '/api') {
    // API
    response.writeHead(200, {
      'Content-type': 'application/json'
    });
    response.end(data);
  } else {
    // 404 page
    response.writeHead(404, {
      'Content-type': 'text/html'
    });
    response.end('<h1>Invalid page mane</h1>');
  }
});

server.listen(8000, '127.0.0.1', () =>
  console.log('Listening for requests on port 8000')
);
