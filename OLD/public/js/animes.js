var blockListAnimes = false
var menus = [
  { name: "type", active: false, menu: "allsT", default: "allsT" },
  { name: "gender", active: false, menu: [], default: "allsG" },
  { name: "idioma", active: false, menu: "allsI", default: "allsI" },
  { name: "ano", active: false, menu: "allsA", default: "allsA" },
]
function openMenuAnimes(menu) {
  menus.forEach((item, index)=>{
    if (item.name !== menu) {
      item.active = false
      document.getElementById(`${item.name}`).style.display = 'none'
    }
  })
  if (menu !== "close") {
    if (menus.findIndex(r=>r.name == menu) >= 0 && menus[menus.findIndex(r=>r.name == menu)].active) {
      menus[menus.findIndex(r=>r.name == menu)].active = false
      document.getElementById(`${menu}`).style.display = 'none'
    } else if (menus.findIndex(r=>r.name == menu) >= 0) {
      menus[menus.findIndex(r=>r.name == menu)].active = true
      document.getElementById(`${menu}`).style.display = 'flex'
    }
  }
}
async function setMenuAnimes(menu, type) {
  if (blockListAnimes || menus.findIndex(r=>r.name == menu) < 0) return;
  await menus.forEach(async (item, index)=>{
    if (item.name == "gender" && menu == "gender") {
      if (type == "allsG") {
        await item.menu.forEach((item2, index)=>{ document.getElementById(`${item2}`).style.background = 'rgba(30,30,30,1)'  });
        document.getElementById(`${menus[1].default}`).style.background = 'rgba(150,0,0,0.9)'
        menus[1].menu = []
      } else document.getElementById(`${item.default}`).style.background = 'rgba(30,30,30,1)'
    } else {
      document.getElementById(`${item.menu}`).style.background = 'rgba(30,30,30,1)'
      if (!menus[1].active && menus[1].menu.length >= 1) {
        document.getElementById(`${menus[1].default}`).style.background = 'rgba(150,0,0,0.9)'
        await menus[1].menu.forEach((item2, index)=>{ document.getElementById(`${item2}`).style.background = 'rgba(30,30,30,1)'  });
        menus[1].menu = []
      }
    }
    if (item.name !== menu) {
      item.menu = item.default
      document.getElementById(`${item.default}`).style.background = 'rgba(150,0,0,0.9)'
    }
  })
  if (menu == "gender") {
    if (type == "allsG") {
      menus[1].menu = []
    } else if (menus[1].menu.findIndex(r=>r==type) >= 0) {
      menus[1].menu.splice(menus[1].menu.findIndex(r=>r==type), 1)
      document.getElementById(`${type}`).style.background = 'rgba(30,30,30,1)'
    } else {
      menus[1].menu[menus[1].menu.length] = type                      
      document.getElementById(`${type}`).style.background = 'rgba(150,0,0,0.9)'
    }
  } else {
    menus[menus.findIndex(r=>r.name == menu)].menu = type
    document.getElementById(`${type}`).style.background = 'rgba(150,0,0,0.9)'
    openMenuAnimes('close')
  }
  loadAnimes(1, false)
}

async function loadAnimes(page, search) {
  if (search == "false") search = false
  if (!page) return;
  if (blockListAnimes) return;
  blockListAnimes = true
  document.getElementById("animes").innerHTML = `<div style="position: relative; width: 100%; height: 30vh"><div style="position: absolute; top: 30%; left: 50%; margin-top: -2vh; margin-left: -2vh"><div class="loader-wheel"></div><div class="loader-text font-5"></div></div></div>`
  document.getElementById("pages").innerHTML = ``
  if (menus[0].menu == "filme") search = "filme"
  if (menus[2].menu == "dublado") search = "dublado"
  if (menus[3].menu !== "allsA") search = menus[3].menu
  if (menus[1].menu.length >= 1) search = menus[1].menu.map(function(gen) { return gen }).join('+');
  $.ajax({ method: "post", url: search ? '/loadSearch' : '/loadAnimes', data: { anime: search, page: page },
    success: function(s) {
      blockListAnimes = false
      document.getElementById('animes').innerHTML = ``
      if (s && s.animes && s.animes.length > 0) {
        s.animes.forEach((anime, index)=>{ 
          if (menus[0].menu == "anime" && anime.type !== "Anime") return;
          if (menus[0].menu == "filme" && anime.type !== "Filme") return;
          if (menus[2].menu == "legendado" && anime.eps !== "Legendado") return;
          if (menus[2].menu == "dublado" && anime.eps !== "Dublado") return;
          document.getElementById('animes').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" class="calendarMain minWidth40 height32" title="${anime.name}" style="cursor: pointer; min-width: 18%; height: 42vh; margin-right: 1%; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 1vh;"><div class="textAvatar displayWebKit" style="width: 100%; height: 101%; text-align: center; background: linear-gradient(to bottom,rgba(3, 3, 3, 1) 0%,rgba(3, 3, 3, 0.1) 22%,rgba(3, 3,3, 0.1) 70%,rgba(3, 3, 3, 1) 100%);"><div style="position: relative; width: 100%; height:100%"><div class="textAvatar2" style="opacity: 0; position: absolute; top: 40%; width: 100%; font-size: 6vh; color: red"><i class="fad fa-play"></i></div><div style="position: absolute; bottom: 2vh; margin-inline: 2vh; text-align: left"><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.name}</a></div><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: red">${anime.type}</a></div><div class="displayWebKit2" style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1; display: none;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: white">${anime.eps}</a></div></div></div></div></div>`  
        })
      } else document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 8%; text-align: center; color: red; font-size: 3.5vh"><a>Não encontramos nenhum anime com esse filtro...<br/>`
      if (s && s.pages && s.pages.length > 0) {
        if (Number(page)-1 <= 0) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="loadAnimes(${Number(page)-1}','${search}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        s.pages.forEach((page,index)=>{
          if (page.number == "...") {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else if (page.select) {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; ${page.select ? "cursor: not-allowed;" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else {
            document.getElementById("pages").innerHTML += `<a onclick="loadAnimes('${page.number}','${search}')" ${page.select ? "" : 'class="buttonRed"'} style="color: white; text-decoration: none; ${page.select ? "" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          }
        })
        if (Number(page)+1 > s.pages[s.pages.length-1].number) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="loadAnimes('${Number(page)+1}','${search}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
      }
    },
    error: function(e) {
      blockListAnimes = false
      document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 8%; text-align: center; color: red; font-size: 3.5vh"><a>Não encontramos nenhum anime com esse nome...<br/>`
    }
  })
}
async function loadLeater(page, leater) {
  if (!page) return;
  if (blockListAnimes) return;
  blockListAnimes = true
  document.getElementById("animes").innerHTML = `<div style="position: relative; width: 100%; height: 30vh"><div style="position: absolute; top: 30%; left: 50%; margin-top: -2vh; margin-left: -2vh"><div class="loader-wheel"></div><div class="loader-text font-5"></div></div></div>`
  document.getElementById("pages").innerHTML = ``
  $.ajax({ method: "post", url: '/loadLeaters', data: { anime: leater, page: page },
    success: function(s) {
      blockListAnimes = false
      document.getElementById('animes').innerHTML = ``
      if (s && s.animes && s.animes.length > 0) {
        s.animes.forEach((anime, index)=>{ 
          document.getElementById('animes').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" class="calendarMain minWidth40 height32" title="${anime.name}" style="cursor: pointer; min-width: 18%; height: 42vh; margin-right: 1%; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 1vh;"><div class="textAvatar displayWebKit" style="width: 100%; height: 101%; text-align: center; background: linear-gradient(to bottom,rgba(3, 3, 3, 1) 0%,rgba(3, 3, 3, 0.1) 22%,rgba(3, 3,3, 0.1) 70%,rgba(3, 3, 3, 1) 100%);"><div style="position: relative; width: 100%; height:100%"><div class="textAvatar2" style="opacity: 0; position: absolute; top: 40%; width: 100%; font-size: 6vh; color: red"><i class="fad fa-play"></i></div><div style="position: absolute; bottom: 2vh; margin-inline: 2vh; text-align: left"><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.name}</a></div><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: red">${anime.type}</a></div><div class="displayWebKit2" style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1; display: none;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: white">${anime.eps}</a></div></div></div></div></div>`  
        })
      } else document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 8%; text-align: center; color: red; font-size: 3.5vh"><a>Não encontramos nenhum anime com esse filtro...<br/>`
      if (s && s.pages && s.pages.length > 0) {
        if (Number(page)-1 <= 0) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="loadAnimes(${Number(page)-1}','${leater}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        s.pages.forEach((page,index)=>{
          if (page.number == "...") {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else if (page.select) {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; ${page.select ? "cursor: not-allowed;" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else {
            document.getElementById("pages").innerHTML += `<a onclick="loadAnimes('${page.number}','${leater}')" ${page.select ? "" : 'class="buttonRed"'} style="color: white; text-decoration: none; ${page.select ? "" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          }
        })
        if (Number(page)+1 >= s.pages[s.pages.length-1].number) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="loadAnimes('${Number(page)+1}','${leater}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
      }
    },
    error: function(e) {
      blockListAnimes = false
      document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 8%; text-align: center; color: red; font-size: 3.5vh"><a>Não encontramos nenhum anime com esse nome...<br/>`
    }
  })
}
function loadPopulares() {
  $.ajax({ method: "post", url: `/loadMainPage`,
    success: function(s) {
      document.getElementById('loadPopulares').style.display = `none`
      if (s && s.tops && s.tops.length > 0) {
          s.tops.forEach((anime, index)=>{ if (index < 11) document.getElementById('tops').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" class="calendarMain" style="cursor: pointer; margin-inline: 4%; display: flex; width: 92%; height: 12vh; background: rgba(10,10,10); margin-block: 1vh; border-radius: 0.8vh;"><div style="width: 20%; height: 10vh; margin-top:1vh; margin-left: 1vh; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 0.6vh;"><div style="background: linear-gradient(to bottom,rgba(10,10,10, 1) 0%,rgba(10,10,10, 0.1) 10%,rgba(10,10,10, 0.1) 90%,rgba(10,10,10, 1) 100%);"></div></div><div style="position: relative; width: 100%; height: 100%;"><div style="position: absolute; bottom: 2vh; left: 2vh; right: 5vh"><a class="font-3" style="font-size: 2vh; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.name}</a><a class="font-3" style="font-size: 1.8vh; color:red; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.type}</a><a class="font-3" style="font-size: 1.9vh; color:gray; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.eps}</a></div><div style="position: absolute; bottom: 1vh; right: 1vh;"><div style="font-size: 3.5vh; color: red"><i class="fad fa-play-circle"></i></div></div></div></div>` })
      } else { document.getElementById('tops').innerHTML += `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os animes...<br/>Reporte para nossa equipe!</a></div>` }
    },
    error: function(e) {}
  });
}
(function () {
  loadPopulares()
  if (window.location.pathname.split('/')[1] == "filmes") {
    setMenuAnimes('type','filme')
  } else if (window.location.pathname.split('/')[1] == "dublados") {
    setMenuAnimes('idioma','dublado')
  } else if (window.location.pathname.split('/')[1] == "generos") {
    openMenuAnimes('gender')
    loadAnimes(1, false)
  } else if (window.location.pathname.split('/')[1] == "letra") {
    loadLeater(1, window.location.pathname.split('/')[2])
  } else {
    loadAnimes(1, false)
  }
})();