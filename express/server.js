'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const locateChrome = require('locate-chrome');
const { default: puppeteer } = require("puppeteer");

const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',async (req, res) => {
  res.send(`
    <html>
    <head>
        <title>BMS tracker by mahildeep</title>
        <style> 
    body{
        background-color: rgb(223, 237, 250);
    }
    #form{
        margin-left :750px;
        font-size : 30px;
        margin-top:20px;
        font-family:'arial';
    }
    #details{
        margin-top: 50px;
        background-color: whitesmoke;
        border-radius: 20px;
        height: fit-content;
        width: 600px;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        margin-left: 680px;
        padding-top: 30px;
        font-size: 14px;
        box-shadow: 0px 0px 8px 5px rgb(190, 214, 230);
    }
    #mname{
        font-size: 35px;
        color: orange;
        margin-top: 10px;
    }
    #mdate{
        margin-top: -20px;
        margin-bottom: 30px;
        font-size: 25px;
    }
    #button{
        cursor: pointer;
        font-size: 25px;
        margin-top: 20px;
        height: 50px;
        width: 150px;
        background-color: rgb(47, 137, 255);
        box-shadow: 0px 0px 3px 2px gray;
        border-radius: 20px;
        border: none;
        margin-left: 150px;
    }
    #url{
        height:60px;
        width:450px;
        outline : none;
        border : none;
        border-radius : 10px;
        font-size : 20px;
        background-color:white;
        padding-left:20px;
        padding-right:20px;
        color : gray;
    }
    #heading{
        border: 1px solid transparent;
        height: 105px;
        width: 505px;
        background-color: wheat;
        margin-left:50px;
        margin-bottom: 20px;
        border-radius: 20px;
    }
    #total{
        margin-top: 45px;
    }
    </style>
    </head>
    <body>
        <form action="/getHtml" method="post" id="form">
            <input type="text" name="url" id="url" autocomplete="off" placeholder="Enter BMS movie link here"> <br/>
            <input type="submit"  id="button"  value="Show" >
        </form>
    </body>
    </html>
    `);
});

app.post('/getHtml', async (req, res) => {
  const url = req.body.url;
    const result = await webscrape(url);
    res.send(`
    <html>
    <head>
        <title>BMS tracker by mahildeep</title>
        <style> 
    body{
        background-color: rgb(223, 237, 250);
    }
    #form{
        margin-left :750px;
        font-size : 30px;
        margin-top:20px;
        font-family:'arial';
    }
    #details{
        margin-top: 50px;
        background-color: whitesmoke;
        border-radius: 20px;
        height: fit-content;
        width: 600px;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        margin-left: 680px;
        padding-top: 30px;
        font-size: 14px;
        box-shadow: 0px 0px 8px 5px rgb(190, 214, 230);
    }
    #mname{
        font-size: 35px;
        color: orange;
        margin-top: 10px;
    }
    #mdate{
        margin-top: -20px;
        margin-bottom: 30px;
        font-size: 25px;
    }
    #button{
        cursor: pointer;
        font-size: 25px;
        margin-top: 20px;
        height: 50px;
        width: 150px;
        background-color: rgb(47, 137, 255);
        box-shadow: 0px 0px 3px 2px gray;
        border-radius: 20px;
        border: none;
        margin-left: 150px;
    }
    #url{
        height:60px;
        width:450px;
        outline : none;
        border : none;
        border-radius : 10px;
        font-size : 20px;
        background-color:white;
        padding-left:20px;
        padding-right:20px;
        color : gray;
    }
    #heading{
        border: 1px solid transparent;
        height: 105px;
        width: 505px;
        background-color: wheat;
        margin-left:50px;
        margin-bottom: 20px;
        border-radius: 20px;
    }
    #total{
        margin-top: 45px;
    }
    </style>
    </head>
    <body>
        <form action="/getHtml" method="post" id="form">
            <input type="text" name="url" id="url" autocomplete="off" placeholder="Enter BMS movie link here">  <br/>
            <input type="submit"  id="button"  value="Show">
        </form>
        ${result}
    </body>
    </html>
    `);
});


async function webscrape(url) {
  const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));
  const browser = await puppeteer.launch({ executablePath });
  const page = await browser.newPage()
  page.setUserAgent("Chrome/73.0.3683.75")
  await page.goto(url)
  var moviename = await page.$eval(".cinema-name-wrapper",(el) => el.innerText)
  moviename = moviename.substring(0, Math.min(moviename.length, 30));
  var region = await page.$eval("#spnSelectedRegion",(el) => el.innerText)
  var mdate = await page.$eval(".slick-active",(el) => el.innerText)
  mdate = (mdate.split("\n")).join(" ")
  var content = await page.$eval("#venuelist",(el) => el.innerHTML)
  
  var sold = 0 
  if(content.includes("showtime-pill-container _sold"))
  {
      sold = (content.match(/showtime-pill-container _sold/g)).length
  }

  var filling = 0 
  if(content.includes("showtime-pill-container _filling"))
  {
      filling = (content.match(/showtime-pill-container _filling/g)).length
  }

  var available = 0 
  if(content.includes("showtime-pill-container _available"))
  {
      available = (content.match(/showtime-pill-container _available/g)).length
  }

  var total = sold + filling + available

  var brate = (((sold+filling)*100) / total).toFixed(2)
  
  return `
      <div id="details">
      <div id="heading">
          <h1 id="mname">${moviename}</h1><br>
          <h1 id="mdate">${region} , ${mdate}</h1><br>
      </div>
          <h1 id="total">Total shows : ${total}</h1><br>
          <h1 id="sold">Sold out : ${sold}</h1><br>
          <h1 id="filling">Fast filling : ${filling}</h1><br>
          <h1 id="available">Available shows : ${available}</h1> <br>
          <h1 id="booking">Booking rate : ${brate}%</h1><br>
      </div>
  `;

  /*
  app.engine('html', require('ejs').renderFile);
  app.get('/', function(req, res) {
      res.render(__dirname + "/views/index.html", {moviename:moviename,mdate:mdate, sold:sold, filling:filling, available:available,total:total,region:region});
  }); */

  }


app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
