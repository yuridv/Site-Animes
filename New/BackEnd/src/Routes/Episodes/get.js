// const request = require("request");
// const cheerio = require("cheerio");

const get = (req, res) => new Promise(async function (resolve, reject) {
  try {
    // await request(`https://animes.vision/animes/yuusha-party-wo-tsuihou-sareta-beast-tamer-saikyoushu-no-nekomimi-shoujo-to-deau-dublado/episodio-02/dublado`, async function (error, response, body) {
    //   if (error) return console.log(`[ROUTE /episodes/get] => Erro Request:\n${error}`)
    //   var $ = cheerio.load(body, { xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false } });
    //   var result = false
    //   $('script').each(function(i,element) {
    //     if (element.children && element.children[0] && element.children[0].data.includes("document.getElementById('dplayer_sd')")) {
    //       result = element.children[0].data
    //       result = result.slice(result.indexOf(`url: `)+6,result.indexOf(`type: `)).replaceAll(' ','').replaceAll('\n','').replace('",','')
    //     }
    //   })
    //   if (result) return resolve({ status: 200, url: result })
    //   return resolve({ status: 200, error: `URL not found...` })
    // })
  } catch(err) {
    console.log(err)
    console.log(`[ROUTE /episodes/get] => ${err}`)
    return { status: 500, error: 'Ocorreu algum erro na minha API! Reporte ao Yuri...' }
  }
})

module.exports = get