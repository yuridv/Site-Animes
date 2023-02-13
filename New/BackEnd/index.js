console.log(`[Animes]=> Starting...`)
require('dotenv-safe').config();
const bodyparser = require("body-parser");
const express = require("express");
const routes = require('./src/Routes/routes');

express()
  .use(require('cors')())
  .use(express.json())
  .use(bodyparser.json())
  .use(bodyparser.json({limit: '100mb', extended: true}))
  .use(bodyparser.urlencoded({limit: '100mb', extended: true}))

  .get('*', (req, res) => res.status(200).json({ status: 'online', path: '/api', version: '0.1' }))
  .post('*', async function(req, res) {
    try {
      if (req.params[0]) {
        var params = req.params[0].replace('/','').split("/")
        var rota = false
        if (params[0] && routes[params[0]]) {
          if (params[1] && routes[params[0]][params[1]]) {
            if (params[2] && routes[params[0]][params[1]][params[2]]) {
              if (params[2] && routes[params[0]][params[1]][params[2]][params[3]]) {
                rota = routes[params[0]][params[1]][params[2]][params[3]]
              } else rota = routes[params[0]][params[1]][params[2]]
            } else rota = routes[params[0]][params[1]]
          } else rota = routes[params[0]]
        } else return res.status(500).json({ status: 500, error: 'URL da API não encontrada...' })
        if (rota && typeof rota == 'function') {
          var result = await rota(req, res);
          if (result) return res.status(result.status || 200).json(result)
          return res.status(500).json({ status: 500, error: 'A minha API não retornou uma resposta valida...' })
        } else return res.status(500).json({ status: 500, error: 'URL da API não está correta...' })
      } else return res.status(500).json({ status: 500, error: 'URL da API não foi colocada...' })
    } catch(err) {
      console.log(err)
      console.log(`[ROUTE /] => ${err}`)
      return { status: 500, error: 'Ocorreu algum erro na minha API! Reporte ao Yuri...' }
    }
  })
  .listen(process.env.PORT || 3000, function (err) {
    if (err) return console.log(`[Animes]=> Error Loading:\n${err}`)
    console.log(`[Animes]=> Successfully Loaded!`)
  });