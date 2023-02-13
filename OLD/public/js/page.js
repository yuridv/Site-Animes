function searchAnimes(anime, page) {
  if (!anime) return; 
  document.getElementById("animes").innerHTML = `<div style="position: relative; width: 100%; height: 30vh"><div style="position: absolute; top: 30%; left: 50%; margin-top: -2vh; margin-left: -2vh"><div class="loader-wheel"></div><div class="loader-text font-5"></div></div></div>`
  document.getElementById("pages").innerHTML = ``
  $.ajax({ method: "post", url: `/loadSearch`,
    data: { anime: anime, page: page },
    success: function(s) {
      document.getElementById('animes').innerHTML = ``
      if (s && s.animes && s.animes.length > 0) {
        s.animes.forEach((anime, index)=>{ document.getElementById('animes').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" class="calendarMain minWidth40 height32" title="${anime.name}" style="cursor: pointer; min-width: 18%; height: 42vh; margin-right: 1%; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 1vh;"><div class="textAvatar displayWebKit" style="width: 100%; height: 100%; text-align: center; background: linear-gradient(to bottom,rgba(3, 3, 3, 1) 0%,rgba(3, 3, 3, 0.1) 22%,rgba(3, 3,3, 0.1) 70%,rgba(3, 3, 3, 1) 100%);"><div style="position: relative; width: 100%; height:100%"><div class="textAvatar2" style="opacity: 0; position: absolute; top: 40%; width: 100%; font-size: 6vh; color: red"><i class="fad fa-play"></i></div><div style="position: absolute; bottom: 2vh; margin-inline: 2vh; text-align: left"><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.name}</a></div><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: red">${anime.type}</a></div><div class="displayWebKit2" style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1; display: none;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: white">${anime.eps}</a></div></div></div></div></div>` })
      } else { document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 8%; text-align: center; color: red; font-size: 3.5vh"><a>Não encontramos nenhum anime com esse nome...<br/>` }

      if (s && s.pages && s.pages.length > 0) {
        if (page-1 <= 0) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="searchAnimes('${window.location.pathname.split('/')[2]}','${Number(page)-1}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        s.pages.forEach((page,index)=>{
          if (page.number == "...") {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else if (page.select) {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; ${page.select ? "cursor: not-allowed;" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else {
            document.getElementById("pages").innerHTML += `<a onclick="searchAnimes('${window.location.pathname.split('/')[2]}','${page.number}')" ${page.select ? "" : 'class="buttonRed"'} style="color: white; text-decoration: none; ${page.select ? "" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          }
        })
        if (page+1 > Number(s.pages[s.pages.length-1].number.replace(".",""))) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="searchAnimes('${window.location.pathname.split('/')[2]}','${Number(page)+1}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
      }
    },
    error: function(e) {
      document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 8%; text-align: center; color: red; font-size: 3.5vh"><a>Não encontramos nenhum anime com esse nome...<br/>`
    } 
  })
}
function lastAnimes(page) {
  document.getElementById("animes").innerHTML = `<div style="position: relative; width: 100%; height: 30vh"><div style="position: absolute; top: 30%; left: 50%; margin-top: -2vh; margin-left: -2vh"><div class="loader-wheel"></div><div class="loader-text font-5"></div></div></div>`
  document.getElementById("pages").innerHTML = ``
  page = `${page}`
  page = page.replace(".","")
  page = Number(page)
  $.ajax({ method: "post", url: `/loadNewEps`, data: { page: page },
    success: function(s) {
      document.getElementById('animes').innerHTML = ``
      if (s && s.newEps && s.newEps.length > 0) {
        s.newEps.forEach((anime, index)=>{ document.getElementById('animes').innerHTML += `<div title="${anime.name}" class="textAvatar calendarMain maxWidth48 width48" style="max-width: 24%; width: 24%; margin-right: 1%; margin-bottom: 2vh"><div class="height15" style="cursor: pointer; width: 100%; height: 22vh; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 1vh;"><div style="width: 100%; height: 100%; background: linear-gradient(to bottom,rgba(3, 3, 3, 1) 0%,rgba(3, 3, 3, 0.1) 22%,rgba(3, 3,3, 0.1) 70%,rgba(3, 3, 3, 1) 100%)"><div style="position: relative; width: 100%; height:100%"><div class="textAvatar2" style="text-align: center; opacity: 0; position: absolute; top: 40%; width: 100%; font-size: 6vh; color: red"><i class="fad fa-play"></i></div><div style="text-align: right; position: absolute; bottom: 2vh; right: 2vh; border-bottom: 0.1vh solid white; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0);"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.type}</a></div><div style="text-align: left; position: absolute; top: 2vh; left: 1vh; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); background: red; padding-inline: 1vh; border-radius: 1vh"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.res}</a></div></div></div></div><div style="margin-inline: 1vh; cursor: pointer; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0);"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.name}</a><a class="font-3" style="font-size: 1.8vh; font-weight: 600; color: gray; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.eps}</a></div></div>` })
      } else { document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os lançamentos...<br/>Reporte para nossa equipe!</a></div>` }
      if (s && s.pages && s.pages.length > 0) {
        if (page-1 <= 0) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="lastAnimes('${Number(page)-1}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        s.pages.forEach((page,index)=>{
          if (page.number == "...") {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else if (page.select) {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; ${page.select ? "cursor: not-allowed;" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else {
            document.getElementById("pages").innerHTML += `<a onclick="lastAnimes('${page.number}')" ${page.select ? "" : 'class="buttonRed"'} style="color: white; text-decoration: none; ${page.select ? "" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          }
        })
        if (page+1 > Number(s.pages[s.pages.length-1].number.replace(".",""))) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="lastAnimes('${Number(page)+1}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
      }
    },
    error: function(e) {
      document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os lançamentos...<br/>Reporte para nossa equipe!</a></div>`
    }  
  });
}
function lastDonghuas(page) {
  document.getElementById("animes").innerHTML = `<div style="position: relative; width: 100%; height: 30vh"><div style="position: absolute; top: 30%; left: 50%; margin-top: -2vh; margin-left: -2vh"><div class="loader-wheel"></div><div class="loader-text font-5"></div></div></div>`
  document.getElementById("pages").innerHTML = ``
  page = `${page}`
  page = page.replace(".","")
  page = Number(page)
  $.ajax({ method: "post", url: `/loadNewDonghuas`,
    data: { page: page },
    success: function(s) {
      document.getElementById('animes').innerHTML = ``
      if (s && s.newDonghuas && s.newDonghuas.length > 0) {
        s.newDonghuas.forEach((anime, index)=>{ document.getElementById('animes').innerHTML += `<div title="${anime.name}" class="textAvatar calendarMain maxWidth48 width48" style="max-width: 24%; width: 24%; margin-right: 1%; margin-bottom: 2vh"><div class="height15" style="cursor: pointer; width: 100%; height: 22vh; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 1vh;"><div style="width: 100%; height: 100%; background: linear-gradient(to bottom,rgba(3, 3, 3, 1) 0%,rgba(3, 3, 3, 0.1) 22%,rgba(3, 3,3, 0.1) 70%,rgba(3, 3, 3, 1) 100%)"><div style="position: relative; width: 100%; height:100%"><div class="textAvatar2" style="text-align: center; opacity: 0; position: absolute; top: 40%; width: 100%; font-size: 6vh; color: red"><i class="fad fa-play"></i></div><div style="text-align: right; position: absolute; bottom: 2vh; right: 2vh; border-bottom: 0.1vh solid white; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0);"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.type}</a></div><div style="text-align: left; position: absolute; top: 2vh; left: 1vh; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); background: red; padding-inline: 1vh; border-radius: 1vh"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.res}</a></div></div></div></div><div style="margin-inline: 1vh; cursor: pointer; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0);"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.name}</a><a class="font-3" style="font-size: 1.8vh; font-weight: 600; color: gray; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.eps}</a></div></div>` })
      } else { document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os lançamentos...<br/>Reporte para nossa equipe!</a></div>` }
      if (s && s.pages && s.pages.length > 0) {
        if (page-1 <= 0) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="lastDonghuas('${Number(page)-1}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-left"></i></a>`
        s.pages.forEach((page,index)=>{
          if (page.number == "...") {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else if (page.select) {
            document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; ${page.select ? "cursor: not-allowed;" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          } else {
            document.getElementById("pages").innerHTML += `<a onclick="lastDonghuas('${page.number}')" ${page.select ? "" : 'class="buttonRed"'} style="color: white; text-decoration: none; ${page.select ? "" : 'cursor: pointer;'} font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; ${page.select ? "background: rgba(120,0,0,0.9);" : 'background: red;'} padding-block: 0.5vh; padding-inline: 1.2vh">${page.number}</a>` 
          }
        })
        if (page+1 > Number(s.pages[s.pages.length-1].number.replace(".",""))) {
          document.getElementById("pages").innerHTML += `<a style="color: white; text-decoration: none; cursor: not-allowed; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
        } else document.getElementById("pages").innerHTML += `<a onclick="lastDonghuas('${Number(page)+1}')" class="buttonRed" style="color: white; text-decoration: none; cursor: pointer; font-size: 2.6vh; margin-inline: 0.2vh; border-radius: 0.5vh; background: red; padding-block: 0.5vh; padding-inline: 1.2vh"><i class="fad fa-angle-right"></i></a>`
      }
    },
    error: function(e) {
      document.getElementById('animes').innerHTML = `<div style="width: 100%; margin-top: 8%; text-align: center; color: red; font-size: 2vh">Ocorreu algum erro ao carregar o calendário...<br/>Reporte para nossa equipe!</a><br/>`
    } 
  })
}
function loadPopulares() {
  $.ajax({ method: "post", url: `/loadMainPage`,
    success: function(s) {
      document.getElementById('loadPopulares').style.display = `none`
      if (s && s.tops && s.tops.length > 0) {
          s.tops.forEach((anime, index)=>{ if (index < 8) document.getElementById('tops').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" class="calendarMain" style="cursor: pointer; margin-inline: 4%; display: flex; width: 92%; height: 12vh; background: rgba(10,10,10); margin-block: 1vh; border-radius: 0.8vh;"><div style="width: 20%; height: 10vh; margin-top:1vh; margin-left: 1vh; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 0.6vh;"><div style="background: linear-gradient(to bottom,rgba(10,10,10, 1) 0%,rgba(10,10,10, 0.1) 10%,rgba(10,10,10, 0.1) 90%,rgba(10,10,10, 1) 100%);"></div></div><div style="position: relative; width: 100%; height: 100%;"><div style="position: absolute; bottom: 2vh; left: 2vh; right: 5vh"><a class="font-3" style="font-size: 2vh; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.name}</a><a class="font-3" style="font-size: 1.8vh; color:red; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.type}</a><a class="font-3" style="font-size: 1.9vh; color:gray; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.eps}</a></div><div style="position: absolute; bottom: 1vh; right: 1vh;"><div style="font-size: 3.5vh; color: red"><i class="fad fa-play-circle"></i></div></div></div></div>` })
      } else { document.getElementById('tops').innerHTML += `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os animes...<br/>Reporte para nossa equipe!</a></div>` }
    },
    error: function(e) {}
  });
}
(function () {
  loadPopulares()
  if (window.location.pathname.split('/')[1] == "search") searchAnimes(`${window.location.pathname.split('/')[2]}`,1)
  if (window.location.pathname.split('/')[1] == "lancamentos") lastAnimes(1)
  if (window.location.pathname.split('/')[1] == "donghuas") lastDonghuas(1)
})();