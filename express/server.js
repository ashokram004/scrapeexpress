'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<html> <head> <title>BMS tracker by mahildeep</title> <style> body{ background-color: rgb(223, 237, 250); } #form{ margin-left :750px; font-size : 30px; margin-top:20px; font-family:arial; } #details{ margin-top: 50px; background-color: whitesmoke; border-radius: 20px; height: fit-content; width: 600px; font-family: Arial, Helvetica, sans-serif; text-align: center; margin-left: 680px; padding-top: 30px; font-size: 14px; box-shadow: 0px 0px 8px 5px rgb(190, 214, 230); } #mname{ font-size: 35px; color: orange; margin-top: 10px; } #mdate{ margin-top: -20px; margin-bottom: 30px; font-size: 25px; } #button{ cursor: pointer; font-size: 25px; margin-top: 20px; height: 50px; width: 150px; background-color: rgb(47, 137, 255); box-shadow: 0px 0px 3px 2px gray; border-radius: 20px; border: none; margin-left: 150px; } #url{ height:60px; width:450px; outline : none; border : none; border-radius : 10px; font-size : 20px; background-color:white; padding-left:20px; padding-right:20px; color : gray; } #heading{ border: 1px solid transparent; height: 105px; width: 505px; background-color: wheat; margin-left:50px; margin-bottom: 20px; border-radius: 20px; } #total{ margin-top: 45px; } </style> </head> <body> <form action="/getHtml" method="post" id="form"> <input type="text" name="url" id="url" autocomplete="off" placeholder="Enter BMS movie link here"> <br/> <input type="submit" id="button" value="Show" > </form> </body> </html>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
