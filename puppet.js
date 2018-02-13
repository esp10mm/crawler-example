const fs = require('fs');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const main = async () => {
  const browser = await puppeteer.launch({ ignoreHTTPSError: true, headless: false });

  const fetchPage = async (p) => {
    const page = await browser.newPage();
    await page.goto(`http://id.priceprice.com/harga-hp/?page=${p}`);
    await page.waitFor('#itemList');

    const html = await page.content();
    const $ = cheerio.load(html);

    $('.itemBoxIn').each((i, element) => {
      const itemName = $(element).find('.itmName h3').text();
      const itemPrice = $(element).find('.price').text().match(/[\d.]+/)
      fs.appendFileSync('price.csv', `${itemName},${itemPrice}\n`);
    });
    await page.close();
  };

  for (let i = 1; i < 5; i += 1) {
    await fetchPage(i);
  }

  await browser.close();
};

main();
