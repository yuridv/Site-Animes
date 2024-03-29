console.log(`[Base]=> Starting...`)
const express = require("express");
let { routes, verify } = require('./src/Routes/routes')

express()
  .use(express.json())

  // .get('*', (req, res) => res.status(200).json({ status: 'online', path: '/', version: '0.1' }))
  

  .get('*', (req, res) => {
    
  })

  .post('*', async function(req, res) {
    try {
      let route = await verify(await routes, req.params[0].replace('/','').split("/"))
      if (route.error) return res.status(500).send(route)
      let result = await route(req, res)
      if (result) return res.status(result.status ? result.status : 200).send(result)
      return res.status(500).send(`A API não retornou nenhuma resposta! Tente novamente...`)
    } catch (err) {
      console.log(err)
      console.log(`[ROUTE /] => ${err}`)
      return { status: 500, error: 'Ocorreu algum erro na minha API! Reporte ao Yuri...' }
    }
  })

  .listen(process.env.PORT || 3000, function (err) {
    if (err) return console.log(`[Base]=> Error Loading:\n${err}`)
    console.log(`[Base]=> Successfully Loaded!`)
  });