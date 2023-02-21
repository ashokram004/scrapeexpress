'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Enter a URL to get HTML content:</h1>');
  res.write('<form action="/getHtml" method="post">');
  res.write('<input type="text" name="url">');
  res.write('<button type="submit">Get HTML</button>');
  res.write('</form>');
  res.end();
});

router.post('/getHtml', async (req, res) => {
  try {
    const url = req.body.url;
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    res.send($.html());
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
