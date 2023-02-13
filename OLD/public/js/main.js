var banners = false
var calendars = false
var lastFilms = false
var lastDubs = false
function loadAnimes(arrow) {
  var bannersBase = []
  bannersBase[bannersBase.length] = { url: "57344", name: "Shingeki no Kyojin: The Final Season Parte 2", desc: "Séculos atrás, a humanidade foi levada a quase extinção por criaturas humanóides monstruosas conhecidas como Titãs, que parecem caçar e devorar humanos não por fome, mas sim por prazer. Para garantir sua sobrevivência, os remanescentes da humanidade começaram a viver dentro de enormes muralhas, resultando em cem anos sem um único encontro com um Titã. No entanto, esta frágil calma logo é quebrada quando um Titã colossal consegue romper a parede exterior, supostamente inexpugnável, reacendendo a luta pela sobrevivência contra as abominações comedoras de gente. A história segue Eren Yeager, quando ele se alista em uma unidade militar de elite, que combate os titãs fora da proteção das muralhas, junto de sua irmã adotiva Mikasa Ackerman e seu amigo de infância Armin Arlert, e a corrida para descobrir uma maneira de derrotá-los antes das últimas muralhas serem rompidas.", date: "2022", img:"https://www.animeunited.com.br/oomtumtu/2021/11/shingeki-kudasai.jpg" }
  bannersBase[bannersBase.length] = { url: "3285", name: "Kimetsu no Yaiba", desc: "Japão, era Taisho. Tanjiro, um bondoso jovem que ganha a vida vendendo carvão, descobre que sua família foi massacrada por um demônio. E pra piorar, Nezuko, sua irmã mais nova e única sobrevivente, também foi transformada num demônio. Arrasado com esta sombria realidade, Tanjiro decide se tornar um matador de demônios para fazer sua irmã voltar a ser humana, e para matar o demônio que matou sua família. Um triste conto sobre dois irmãos, onde os destinos dos humanos e dos demônios se entrelaçam!", date: "2019", img:"https://selectgame.gamehall.com.br/wp-content/uploads/2021/07/Tanjirou-e-Nezuko-Kimetsu-no-Yaiba-4K-Wallpaper-Papel-de-Parede-scaled.jpg" }
  bannersBase[bannersBase.length] = { url: "29601", name: "Death Note", desc: "O jovem estudante Light Yagami achar um caderno com poderes sobrenaturais, chamado Death Note, no qual era possível matar uma pessoa apenas escrevendo seu nome no caderno. Quando o descobre, Light tenta eliminar todos os criminosos do mundo e dar à sociedade um mundo livre do mal. Mas seus planos começam a sair de rumo quando o detetive L resolver contrariar Light.", date: "2006", img:"https://a-static.besthdwallpaper.com/death-note-ryuk-papel-de-parede-1680x1050-78226_5.jpg" }
  if (bannersBase.length > 0) { banners = bannersBase
    document.getElementById('banners').innerHTML = ``
    bannersBase.forEach((banner, index)=>{ document.getElementById('banners').innerHTML += `<div id="banner${index+1}" style="width: 100%; min-width: 100%; height: 100%; ${index == 0 ? '' : 'display: flex'}"><div style="width: 100%; height: 100%; background: url('${banner.img}'); background-size: cover; background-position: center;"><div style="width: 100%; height: 100%; background: linear-gradient(to bottom,rgba(3, 3, 3, 0.8) 0%,rgba(3, 3, 3, 0.2) 30%,rgba(3, 3,3, 0.2) 0%,rgba(3, 3, 3, 1) 100%);"><div class="width70 padding-top73" style="display: flex; width: 40%; padding-top: 16.5%; padding-left: 4%"><a class="fontSize3 maxWidth67" style="cursor: pointer; font-size: 6.3vh; font-weight: 600; max-width: 85%; text-shadow: 1vh 1vh 1.3vh rgb(0, 0, 0);" onclick="location.href = '/anime/${banner.url}'">${banner.name}</a><div style="margin-left: 1.5vh; margin-top: 1.3vh;"><a class="fontSize1-6" style="font-size: 2vh; font-weight: 300; padding-inline: 1.2vh; padding-block: 0.8vh; background: red; border-radius: 1vh; box-shadow: 0.5vh 0.5vh 1.5vh rgb(0, 0, 0); text-shadow: 0.5vh 0.5vh 1.5vh rgb(0, 0, 0);"><i class="fas fa-calendar-alt"></i> ${banner.date}</a></div></div><div class="limitLine2 width70" style="width: 40%; padding-top:1.5vh; padding-left: 4%; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 4;"><a style="font-size: 2vh; text-shadow: 0.5vh 0.5vh 1.5vh rgb(0, 0, 0);">${banner.desc}</a></div><div class="width70" style="display: flex; margin-top: 5vh; padding-left: 4%;"><a class="backgroundRed fontSize1-6" style="font-weight: 600; cursor: pointer; font-size: 3vh; background: rgba(255,0,0,0.6); padding-inline: 2vh; padding-block: 1.1vh; border-radius: 2vh"><i class="fad fa-play" style="padding-right: 1vh"></i> Assistir agora</a><div class="backgroundGray fontSize1-6" style="font-size: 2.8vh; display: flex; cursor: pointer; padding-inline: 2vh; padding-block: 1.1vh; border-radius: 3vh; margin-left: 3vh; background: rgba(50,50,50,0.6)" onclick="location.href = '/anime/${banner.url}'"><a style="font-weight: 600;">Detalhes</a><i class="fad fa-angle-right" style="margin-left: 1vh; margin-top: 0.6vh"></i></div></div></div></div></div>` })
  } else { document.getElementById('banners').innerHTML = `<div style="width: 100%; margin-top: 15%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os banners...<br/>Reporte para nossa equipe!</a></div>` }
  $.ajax({ method: "post", url: `/loadBanners`,
    success: function(s) {
      document.getElementById('banners').innerHTML = ``
      if (s && s.banners && s.banners.length > 0) { banners = s.banners
        s.banners.forEach((banner, index)=>{ document.getElementById('banners').innerHTML += `<div id="banner${index+1}" style="width: 100%; min-width: 100%; height: 100%; ${index == 0 ? '' : 'display: flex'}"><div style="width: 100%; height: 100%; background: url('${banner.img}'); background-size: cover; background-position: center;"><div style="width: 100%; height: 100%; background: linear-gradient(to bottom,rgba(3, 3, 3, 0.8) 0%,rgba(3, 3, 3, 0.2) 30%,rgba(3, 3,3, 0.2) 0%,rgba(3, 3, 3, 1) 100%);"><div class="width70 padding-top73" style="display: flex; width: 40%; padding-top: 16.5%; padding-left: 4%"><a class="fontSize3 maxWidth67" style="cursor: pointer; font-size: 6.3vh; font-weight: 600; max-width: 85%; text-shadow: 1vh 1vh 1.3vh rgb(0, 0, 0);" onclick="location.href = '/anime/${banner.url}'">${banner.name}</a><div style="margin-left: 1.5vh; margin-top: 1.3vh;"><a class="fontSize1-6" style="font-size: 2vh; font-weight: 300; padding-inline: 1.2vh; padding-block: 0.8vh; background: red; border-radius: 1vh; box-shadow: 0.5vh 0.5vh 1.5vh rgb(0, 0, 0); text-shadow: 0.5vh 0.5vh 1.5vh rgb(0, 0, 0);"><i class="fas fa-calendar-alt"></i> ${banner.date}</a></div></div><div class="limitLine2 width70" style="width: 40%; padding-top:1.5vh; padding-left: 4%; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 4;"><a style="font-size: 2vh; text-shadow: 0.5vh 0.5vh 1.5vh rgb(0, 0, 0);">${banner.desc}</a></div><div class="width70" style="display: flex; margin-top: 5vh; padding-left: 4%;"><a class="backgroundRed fontSize1-6" style="font-weight: 600; cursor: pointer; font-size: 3vh; background: rgba(255,0,0,0.6); padding-inline: 2vh; padding-block: 1.1vh; border-radius: 2vh"><i class="fad fa-play" style="padding-right: 1vh"></i> Assistir agora</a><div class="backgroundGray fontSize1-6" style="font-size: 2.8vh; display: flex; cursor: pointer; padding-inline: 2vh; padding-block: 1.1vh; border-radius: 3vh; margin-left: 3vh; background: rgba(50,50,50,0.6)" onclick="location.href = '/anime/${banner.url}'"><a style="font-weight: 600;">Detalhes</a><i class="fad fa-angle-right" style="margin-left: 1vh; margin-top: 0.6vh"></i></div></div></div></div></div>` })
      } else { document.getElementById('banners').innerHTML = `<div style="width: 100%; margin-top: 15%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os banners...<br/>Reporte para nossa equipe!</a></div>` }
    },
    error: function(e) {}
  });
  $.ajax({ method: "post", url: `/loadMainPage`,
    success: function(s) {
      document.getElementById('calendars').innerHTML = ``
      if (s && s.calendars && s.calendars.length > 0) { calendars = s.calendars
        s.calendars.forEach((anime, index)=>{ document.getElementById('calendars').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" id="calendar${index+1}" class="calendarMain minWidth49-1 height32" title="${anime.name}" style="cursor: pointer; min-width: 19.1%; height: 42vh; margin-right: 1%; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 1vh;"><div class="textAvatar displayWebKit" style="position: relative; width: 100%; height: 100%; text-align: center; background: linear-gradient(to bottom,rgba(3, 3, 3, 1) 0%,rgba(3, 3, 3, 0.1) 22%,rgba(3, 3,3, 0.1) 70%,rgba(3, 3, 3, 1) 100%);"><div class="textAvatar2" style="opacity: 0; position: absolute; top: 40%; width: 100%; font-size: 6vh; color: red"><i class="fad fa-play"></i></div><div style="position: absolute; bottom: 2vh; margin-inline: 2vh; text-align: left"><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.name}</a></div><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: red">${anime.type}</a></div><div class="displayWebKit2" style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1; display: none;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: white">${anime.eps}</a></div></div></div></div>` })
      } else { document.getElementById('calendars').innerHTML = `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar o calendário...<br/>Reporte para nossa equipe!</a></div>` }

      document.getElementById('newEps').innerHTML = ``
      if (s && s.newEps && s.newEps.length > 0) {
        s.newEps.forEach((anime, index)=>{ if (index < 12) document.getElementById('newEps').innerHTML += `<div title="${anime.name}" class="textAvatar calendarMain maxWidth48 width48" style="max-width: 24%; width: 24%; margin-right: 1%; margin-bottom: 2vh"><div class="height15" style="cursor: pointer; width: 100%; height: 22vh; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 1vh;"><div style="position: relative; width: 100%; height: 100%; background: linear-gradient(to bottom,rgba(3, 3, 3, 1) 0%,rgba(3, 3, 3, 0.1) 22%,rgba(3, 3,3, 0.1) 70%,rgba(3, 3, 3, 1) 100%)"><div class="textAvatar2" style="text-align: center; opacity: 0; position: absolute; top: 40%; width: 100%; font-size: 6vh; color: red"><i class="fad fa-play"></i></div><div style="text-align: right; position: absolute; bottom: 2vh; right: 2vh; border-bottom: 0.1vh solid white; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0);"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.type}</a></div><div style="text-align: left; position: absolute; top: 2vh; left: 1vh; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); background: red; padding-inline: 1vh; border-radius: 1vh"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.res}</a></div></div></div><div style="margin-inline: 1vh; cursor: pointer; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0);"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.name}</a><a class="font-3" style="font-size: 1.8vh; font-weight: 600; color: gray; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.eps}</a></div></div>` })
      } else { document.getElementById('newEps').innerHTML = `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os lançamentos...<br/>Reporte para nossa equipe!</a></div>` }

      document.getElementById('loadPopulares').style.display = `none`
      if (s && s.tops && s.tops.length > 0) {
        s.tops.forEach((anime, index)=>{ if (index < 11) document.getElementById('tops').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" class="calendarMain2" style="cursor: pointer; margin-inline: 4%; display: flex; width: 92%; height: 12vh; background: rgba(10,10,10); margin-block: 1vh; border-radius: 0.8vh;"><div style="width: 20%; height: 10vh; margin-top:1vh; margin-left: 1vh; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 0.6vh;"><div style="background: linear-gradient(to bottom,rgba(10,10,10, 1) 0%,rgba(10,10,10, 0.1) 10%,rgba(10,10,10, 0.1) 90%,rgba(10,10,10, 1) 100%);"></div></div><div style="position: relative; width: 100%; height: 100%;"><div style="position: absolute; bottom: 2vh; left: 2vh; right: 5vh"><a class="font-3" style="font-size: 2vh; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.name}</a><a class="font-3" style="font-size: 1.8vh; color:red; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.type}</a><a class="font-3" style="font-size: 1.9vh; color:gray; font-weight: 600; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;">${anime.eps}</a></div><div style="position: absolute; bottom: 1vh; right: 1vh;"><div style="font-size: 3.5vh; color: red"><i class="fad fa-play-circle"></i></div></div></div></div>` })
      } else { document.getElementById('tops').innerHTML += `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os animes...<br/>Reporte para nossa equipe!</a></div>` }
    },
    error: function(e) {}
  });
    $.ajax({ method: "post", url: `/loadSearch`, data: { anime: `dublado`, page: 1 },
      success: function(s) {
        document.getElementById('dublados').innerHTML = ``
        if (s && s.animes && s.animes.length > 0) { lastDubs = s.animes
          s.animes.forEach((anime, index)=>{ document.getElementById('dublados').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" id="lastDubs${index+1}" class="calendarMain minWidth49-1 height32" title="${anime.name}" style="cursor: pointer; min-width: 19.1%; height: 42vh; margin-right: 1%; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 1vh;"><div class="textAvatar displayWebKit" style="position: relative; width: 100%; height: 100%; text-align: center; background: linear-gradient(to bottom,rgba(3, 3, 3, 1) 0%,rgba(3, 3, 3, 0.1) 22%,rgba(3, 3,3, 0.1) 70%,rgba(3, 3, 3, 1) 100%);"><div class="textAvatar2" style="opacity: 0; position: absolute; top: 40%; width: 100%; font-size: 6vh; color: red"><i class="fad fa-play"></i></div><div style="position: absolute; bottom: 2vh; margin-inline: 2vh; text-align: left"><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.name}</a></div><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: red">${anime.type}</a></div><div class="displayWebKit2" style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1; display: none;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: white">${anime.eps}</a></div></div></div></div>` })
        } else { document.getElementById('dublados').innerHTML = `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os animes dublados...<br/>Reporte para nossa equipe!</a></div>` }
      },
      error: function(e) {} 
    })
  $.ajax({ method: "post", url: `/loadFilms`,
    success: function(s) {
      document.getElementById('lastFilms').innerHTML = ``
      if (s && s.films && s.films.length > 0) { lastFilms = s.films
        s.films.forEach((anime, index)=>{ document.getElementById('lastFilms').innerHTML += `<div onclick="location.href = '/anime/${anime.url}'" id="lastFilms${index+1}" class="calendarMain minWidth49-1 height32" title="${anime.name}" style="cursor: pointer; min-width: 19.1%; height: 42vh; margin-right: 1%; background: url('${anime.img}'); background-size: cover; background-position: center; border-radius: 1vh;"><div class="textAvatar displayWebKit" style="position: relative; width: 100%; height: 100%; text-align: center; background: linear-gradient(to bottom,rgba(3, 3, 3, 1) 0%,rgba(3, 3, 3, 0.1) 22%,rgba(3, 3,3, 0.1) 70%,rgba(3, 3, 3, 1) 100%);"><div class="textAvatar2" style="opacity: 0; position: absolute; top: 40%; width: 100%; font-size: 6vh; color: red"><i class="fad fa-play"></i></div><div style="position: absolute; bottom: 2vh; margin-inline: 2vh; text-align: left"><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2.2vh; font-weight: 600; color: white">${anime.name}</a></div><div style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: red">${anime.type}</a></div><div class="displayWebKit2" style="width: 100%; text-shadow: 0.7vh 0.7vh 0.9vh rgb(0, 0, 0); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1; display: none;"><a class="font-3" style="font-size: 2vh; font-weight: 600; color: white">${anime.eps}</a></div></div></div></div>` })
      } else { document.getElementById('lastFilms').innerHTML = `<div style="width: 100%; margin-top: 2%; text-align: center; color: red; font-size: 2vh"><a>Ocorreu algum erro ao carregar os filmes...<br/>Reporte para nossa equipe!</a></div>` }
    },
    error: function(e) {}
  });
}

var block = false
var widthBanner = 0
var banner = 0
function changeBanner(arrow) {
  if (block || !banners) return;
  block = true
  var reset = false
  widthBanner = arrow == "next" ? widthBanner-100 : widthBanner+100
  var aux = arrow == "next" ? widthBanner+100 : widthBanner-100;
  if (arrow == "next" && widthBanner < -Number(`${banners.length}`)*100+100) {
    widthBanner = 0;
    aux = -Number(`${banners.length}`)*100+100;
    arrow = "previous"
    reset = true
  } else if (arrow == "previous" && widthBanner > 0) {
    widthBanner = -Number(`${banners.length}`)*100+100;
    aux = 0
    arrow = "next"
    reset = true
  }
  if (reset) { var moveBanner = setInterval(editBanner, 10); } else { var moveBanner = setInterval(editBanner, 40); }
  function editBanner() {
    aux = arrow == "next" ? aux-10 : aux+10
    document.getElementById(`banner1`).style.marginLeft = `${aux}%`
    if (aux == widthBanner) {
      block = false
      reset = false
      clearInterval(moveBanner);
    }
  }
}

var block2 = false
var calendar = 0
function changeCalendar(arrow) {
  if (block2 || !calendars) return;
  if (Number(`${calendars.length}`) <= 5) return;
  if (window.screen.width < 900 && Number(`${calendars.length}`) <= 2) return;
  block2 = true
  var maxWidth = -Number(`${calendars.length-5}`)*Number(`${window.screen.width < 900 ? 50.1 : 20.1}`)
  if (window.screen.width < 900) maxWidth = -Number(`${calendars.length-2}`)*Number(`${window.screen.width < 900 ? 50.1 : 20.1}`)
  var aux = calendar
  calendar = arrow == "next" ? calendar-Number(`${window.screen.width < 900 ? 50.1 : 20.1}`) : calendar+Number(`${window.screen.width < 900 ? 50.1 : 20.1}`)
  var reset = false
  if (arrow == "next" && calendar < maxWidth) {
    calendar = 0
    arrow = "previous"
    reset = true
  } else if (arrow == "previous" && calendar > 0) {
    calendar = maxWidth
    arrow = "next"
    reset = true
  }
  var moveBanner = setInterval(editBanner, reset ? 10 : 60);
  function editBanner() {
    aux = arrow == "next" ? aux-Number(`${window.screen.width < 900 ? 8.35 : 3.35}`) : aux+Number(`${window.screen.width < 900 ? 8.35 : 3.35}`)
    if ((arrow == "next" && aux <= calendar) || (arrow == "previous" && aux >= calendar)) {
      document.getElementById(`calendar1`).style.marginLeft = `${calendar}%`;
      clearInterval(moveBanner);
      block2 = false
    } else document.getElementById(`calendar1`).style.marginLeft = `${aux}%`;
  }
}
var block3 = false
var lastFilm = 0
function changeLastFilms(arrow) {
  if (block3 || !lastFilms) return;
  if (Number(`${lastFilms.length}`) <= 5) return;
  if (window.screen.width < 900 && Number(`${lastFilms.length}`) <= 2) return;
  block3 = true
  var maxWidth = -Number(`${lastFilms.length-5}`)*Number(`${window.screen.width < 900 ? 50.1 : 20.1}`)
  if (window.screen.width < 900) maxWidth = -Number(`${lastFilms.length-2}`)*Number(`${window.screen.width < 900 ? 50.1 : 20.1}`)
  var aux = lastFilm
  lastFilm = arrow == "next" ? lastFilm-Number(`${window.screen.width < 900 ? 50.1 : 20.1}`) : lastFilm+Number(`${window.screen.width < 900 ? 50.1 : 20.1}`)
  var reset = false
  if (arrow == "next" && lastFilm < maxWidth) {
    lastFilm = 0
    arrow = "previous"
    reset = true
  } else if (arrow == "previous" && lastFilm > 0) {
    lastFilm = maxWidth
    arrow = "next"
    reset = true
  }
  var moveBanner = setInterval(editBanner, reset ? 10 : 60);
  function editBanner() {
    aux = arrow == "next" ? aux-Number(`${window.screen.width < 900 ? 8.35 : 3.35}`) : aux+Number(`${window.screen.width < 900 ? 8.35 : 3.35}`)
    if ((arrow == "next" && aux <= lastFilm) || (arrow == "previous" && aux >= lastFilm)) {
      document.getElementById(`lastFilms1`).style.marginLeft = `${lastFilm}%`;
      clearInterval(moveBanner);
      block3 = false
    } else document.getElementById(`lastFilms1`).style.marginLeft = `${aux}%`;
  }
}
var block4 = false
var lastDub = 0
function changeLastDubs(arrow) {
  if (block4 || !lastDubs) return;
  if (Number(`${lastDubs.length}`) <= 5) return;
  if (window.screen.width < 900 && Number(`${lastDubs.length}`) <= 2) return;
  block4 = true
  var maxWidth = -Number(`${lastDubs.length-5}`)*Number(`${window.screen.width < 900 ? 50.1 : 20.1}`)
  if (window.screen.width < 900) maxWidth = -Number(`${lastDubs.length-2}`)*Number(`${window.screen.width < 900 ? 50.1 : 20.1}`)
  var aux = lastDub
  lastDub = arrow == "next" ? lastDub-Number(`${window.screen.width < 900 ? 50.1 : 20.1}`) : lastDub+Number(`${window.screen.width < 900 ? 50.1 : 20.1}`)
  var reset = false
  if (arrow == "next" && lastDub < maxWidth) {
    lastDub = 0
    arrow = "previous"
    reset = true
  } else if (arrow == "previous" && lastDub > 0) {
    lastDub = maxWidth
    arrow = "next"
    reset = true
  }
  var moveBanner = setInterval(editBanner, reset ? 10 : 60);
  function editBanner() {
    aux = arrow == "next" ? aux-Number(`${window.screen.width < 900 ? 8.35 : 3.35}`) : aux+Number(`${window.screen.width < 900 ? 8.35 : 3.35}`)
    if ((arrow == "next" && aux <= lastDub) || (arrow == "previous" && aux >= lastDub)) {
      document.getElementById(`lastDubs1`).style.marginLeft = `${lastDub}%`;
      clearInterval(moveBanner);
      block4 = false
    } else document.getElementById(`lastDubs1`).style.marginLeft = `${aux}%`;
  }
}
(function () {
  loadAnimes()
  setInterval(changeBanner, 10000, 'next');
  setInterval(changeCalendar, 11000, 'next');
  setInterval(changeLastFilms, 12000, 'next');
})();