const request = require('request');
const cheerio = require('cheerio');

const get = (req, res) => new Promise(async function (resolve, reject) {
  try {
    await request(`https://animesgratis.org/`, async function (error, response, body) {
      resolve({ status: 200 })
    })
  } catch(err) {
    console.log(err)
    console.log(`[ROUTE /base/get] => ${err}`)
    return { status: 500, error: 'Ocorreu algum erro na minha API! Reporte aos Desenvolvedores...' }
  }
})

module.exports = get