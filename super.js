const fs = require('fs');
const superagent = require('superagent');
const cheerio = require('cheerio');

const main = () => {

  const fetchPage = (page) => {
    superagent.get('http://id.priceprice.com/harga-hp/?page=' + page, (err, response) => {
      const html = response.text;
      const selector = cheerio.load(html);

      selector('.itemBoxIn').each((index, element) => {
        const itemName = selector(element).find('.itmName h3').text();
        const itemPrice = selector(element).find('.price').text().match(/[\d.]+/)
        fs.appendFileSync('price.csv', itemName + ',' + itemPrice + '\n');
      });

      if (page < 5) {
        fetchPage(page + 1);
      }
    });
  };

  fetchPage(1);
};

main();
