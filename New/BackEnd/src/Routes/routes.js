const { readdirSync } = require("fs");
let routes = {}

function routes(dir = '', obj = {}) {
  readdirSync('./src/Routes/'+dir).forEach(async(file) => {
    file = file.split('.').map(r=> r.toLowerCase())
    if (['routes'].includes(file[0])) return;
    if (file[1] == 'js') return obj[file[0]] = require(`${dir || '.'}/${file[0]}`)
    obj[file[0]] = {}
    await routes(`${dir || '.'}/${file[0]}`, obj[file[0]])
  })
  return obj;
}(async() => {
  routes = routes;
})

async function route(params) {
  console.log(req)
}

async function verify(routes, params) {
  console.log(routes)
  if (params[0] && routes[params[0]]) routes = routes[params[0]]
  if (params[1] && routes[params[1]]) routes = routes[params[1]]
  if (params[2] && routes[params[2]]) routes = routes[params[2]]
  if (params[3] && routes[params[3]]) routes = routes[params[3]]
  if (routes && typeof routes == 'function') return routes
  return { error: `A rota da API não é valida...` }
}

module.exports = {
  routes: routes(),
  route: route,
  verify: verify
}