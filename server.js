const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require('json2csv').Parser;
const express = require('express');
const path = require('path');
const app = express();
const csv = require('csv-parser');
app.set('views', path.join(`${__dirname}`, 'views')) 
app.set('view engine', 'ejs') 


const movie = `http://localhost:3000/`;

(async () => {
    let imdbData = [];
    const response = await request({
      uri: movie,
      headers: {
        "accept": "text/plain,charset=UTF-8,application/xhtml+xml",
        "accept-encoding": "gzip, deflate, br",
        "accpet-language": "en-GB, en-US;q=0.9,en;q=0.8"
      },
      gzip: true
    })

    let $ = cheerio.load(response);
    let upper = $('div[class="card-header"]').text().trim();
    let title = $('div[class="card-body"] > h5').text().trim();
    let cardBody = $('div[class ="card-body"] > p').text().trim();
    let cardButton = $('div[class ="card-body"] > a').text().trim()
    imdbData.push({
      upper,
      title, 
      cardBody,
      cardButton
    });
    const j2cp = new json2csv();
    const csv = j2cp.parse(imdbData);
    fs.writeFileSync("./uploads/imdb.csv", csv, "utf-8");
  }
  
)();


app.get('/', (req, res) => {
  res.render('index');
})



const results = [];
  

app.get('/create', (req,res) => {
  fs.createReadStream('./uploads/imdb.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    res.render('newFile', {data: results})
  });
 
  
  
  
  
})

app.listen(3000, () => {
  console.log(`Server is running on 3000`)
})