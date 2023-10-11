const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
var bodyParser = require('body-parser')
const port = process.env.port || 5001;
app.use(bodyParser.json());

async function hashtagGenerator(hashtagKeyword){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://all-hashtag.com/hashtag-generator.php');
    await page.evaluate((keyword)=>{
        document.querySelector('#keyword').value = keyword;
        document.querySelector('#input-top').click();
    }, hashtagKeyword);
    await page.click('.btn-gen');
    await page.waitForSelector('#copy-hashtags');
    const hashtagResult = await page.evaluate(()=>{
        return document.querySelector('#copy-hashtags').textContent;
    });
    await browser.close();
    const hashtagTrim = hashtagResult.trim();
    const hashtagList = hashtagTrim.split("  ");
    return hashtagList;
}

app.get('/hashtag', async (req,res)=>{
        const keyword = req.body.keyword;
        if(!keyword){
            res.status(400).send({status: false, message: 'please pass the keyword'});
        } else {
            const result = await hashtagGenerator(keyword);
            res.status(200).send({status: true, message: 'success', data: result});
        }
});


app.listen(port, ()=>{
    console.log('connected');
});

