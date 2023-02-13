const { Strategy } = require("passport-discord");
const session = require("express-session");
const bodyparser = require("body-parser");
const nodemailer = require('nodemailer');
const Discord = require("discord.js");
const passport = require("passport");
const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const moment = require(`moment`);
moment.locale("pt-BR");
var codes = [];

module.exports.load = async (client, database) => {
  passport.serializeUser((user, done) => { done(null, user); });
  passport.deserializeUser((obj, done) => { done(null, obj); });
  passport.use(new Strategy({
    clientID: client.user.id,
    clientSecret: process.env.secret,
    callbackURL: process.env.url+`/login`,
    scope: ['identify', 'guilds.join']
  }, function(accessToken, refreshToken, profile, done) { process.nextTick(function() { return done(null, profile); }); }));
  express()
    .use(bodyparser.json())
    .use(bodyparser.urlencoded({ extended: true }))
    .engine("html", require("ejs").renderFile)
    .use(express.static(require('path').join(__dirname, '/public')))
    .set("view engine", "ejs")
    .use(session({ secret: process.env.secret, resave: false, saveUninitialized: false }))
    .use(passport.initialize())
    .use(passport.session())
    .get('/logout', function(req, res) { req.logout(); res.redirect('/') })
    .get('/login', passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) {
      if (req.user && !client.guilds.cache.get(process.env.guildID).members.cache.get(req.user.id)) {
        var accessToken = req.user.accessToken
        client.users.fetch(req.user.id).then((user) => { client.guilds.cache.get(process.env.guildID).addMember(user, { accessToken }); });
        database.Users.findById('Users', async (error, usersTable) => {
          if (usersTable.users.findIndex(r => r._id == req.user.id) >= 0) return res.redirect("/")
          usersTable.users[usersTable.users.length] = { _id: req.user.id, password: "discord", name: req.user.username, type: "discord", date: moment(new Date()-0).format('DD/MM/YYYY'), avatar: "https://pbs.twimg.com/profile_images/794107415876747264/g5fWe6Oh_400x400.jpg", role: "Membro", banner: "#000000", about: "Não definido...", skipIntro: false, skipEp: false }
          usersTable.save()
          return res.redirect("/")
        })
      } else if(req.user && client.guilds.cache.get(process.env.guildID).members.cache.get(req.user.id)) {
        database.Users.findById('Users', async (error, usersTable) => {
          if (usersTable.users.findIndex(r => r._id == req.user.id) >= 0) return res.redirect("/")
          usersTable.users[usersTable.users.length] = { _id: req.user.id, password: "discord", name: req.user.username, type: "discord", date: moment(new Date()-0).format('DD/MM/YYYY'), avatar: "https://pbs.twimg.com/profile_images/794107415876747264/g5fWe6Oh_400x400.jpg", role: "Membro", banner: "#000000", about: "Não definido...", skipIntro: false, skipEp: false }
          usersTable.save()
          return res.redirect("/")
        })
      } else { return res.redirect('/login'); }
    })
    .get('/', async function(req, res) {
      database.Users.findById('Users', async (error, usersTable) => {
        var top = [];
        usersTable.users.forEach((member, index, members) => {
          var points = member.videos + member.comments
          member.index = index
          if (top.length) {
            for (let i = 0; i < top.length; ++i) {
              if (points > (top[i].videos + top[i].comments)) {
                top.splice(i, 0, member); break;
              }
            }
            if (top.length < 3) top.push(member);
            if (top.length > 3) top.pop();
          } else { top[0] = member }
        })
        res.render(__dirname+'/views/main.ejs', {
          moment: moment,
          usersTable: usersTable,
          user: req.user ? req.user : false,
          tops: top ? top : false
        });
      })
    })
    .get('/lancamentos', async function(req, res) {
      database.Users.findById('Users', async (error, usersTable) => {
        res.render(__dirname+'/views/page.ejs', {
          title: `Lançamentos - Animes Star™`,
          name: "Últimos Episódios Lançados",
          moment: moment,
          usersTable: usersTable,
          user: req.user ? req.user : false,
        });
      })
    })
    .get('/donghuas', async function(req, res) {
      database.Users.findById('Users', async (error, usersTable) => {
        res.render(__dirname+'/views/page.ejs', {
          title: `Últimos Donghuas - Animes Star™`,
          name: "Últimos Donghuas Lançados",
          moment: moment,
          usersTable: usersTable,
          user: req.user ? req.user : false,
        });
      })
    })
    .get('/calendario', async function(req, res) {
      database.Users.findById('Users', async (error, usersTable) => {
        res.render(__dirname+'/views/calendar.ejs', {
          title: `Calendário - Animes Star™`,
          moment: moment,
          usersTable: usersTable,
          user: req.user ? req.user : false,
        });
      })
    })
    .get('/search/:anime', async function(req, res) {
      database.Users.findById('Users', async (error, usersTable) => {
        res.render(__dirname+'/views/page.ejs', {
          title: `Pesquisando: ${req.params.anime.replace("+"," ")} - Animes Star™`,
          name: "Resultado de sua pesquisa:",
          moment: moment,
          usersTable: usersTable,
          user: req.user ? req.user : false,
        });
      })
    })
    .get('/letra/:leater', async function(req, res) {
      database.Users.findById('Users', async (error, usersTable) => {
        res.render(__dirname+'/views/animes.ejs', {
          title: `Letra: ${req.params.leater} - Animes Star™`,
          name: `Ordenar pela letra ${req.params.leater.toUpperCase()}:`,
          moment: moment,
          usersTable: usersTable,
          user: req.user ? req.user : false,
        });
      })
    })
    .get('/anime/:anime', async function(req, res) {
      database.Users.findById('Users', async (error, usersTable) => {
        var anime = false
        await getAnime(req.params.anime).then((result)=>{ anime = result.animes })
        if (!anime || !anime.name || !anime.image) return res.redirect("/")
        database.Animes.findById('Animes', async (error, animesTable) => {
          if (!animesTable) { var animesTable = new database.Animes({_id: 'Animes'}); animesTable.save() }
          res.render(__dirname+'/views/anime.ejs', {
            title: `Assistir ${anime.name} - Animes Star™`,
            anime: anime,
            moment: moment,
            date: new Date(),
            usersTable: usersTable,
            user: req.user ? req.user : false,
            animeTable: animesTable.animes[animesTable.animes.findIndex(r=> r._id == anime.id)] ? animesTable.animes[animesTable.animes.findIndex(r=> r._id == anime.id)] : false
          });
        })
      })
    })
    .get('/:anime', async function(req, res) {
      if(req.params.anime !== "animes" && req.params.anime !== "filmes" && req.params.anime !== "generos" && req.params.anime !== "dublados") return res.redirect("/")
      database.Users.findById('Users', async (error, usersTable) => {
        res.render(__dirname+'/views/animes.ejs', {
          title: `Lista de Animes - Animes Star™`,
          moment: moment,
          usersTable: usersTable,
          user: req.user ? req.user : false,
        });
      })
    })
    .get('/*', async function(req, res) { return res.redirect('/') })
    .post('/account', function(req, res) {
      database.Users.findById('Users', async (error, usersTable) => {
        if (req.body.type == "login" && req.body.email && req.body.password) {
          if (usersTable.users.findIndex(r=>r._id == req.body.email) < 0) return res.status(500).send('Esse email não está cadastrado!');
          if (usersTable.users.findIndex(r=> r._id == req.body.email && r.type == "discord") >= 0 && req.user && req.user.id == req.body.email) {
            res.send({ user: usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email && r.type == "discord")], index: usersTable.users.findIndex(r=>r._id == req.body.email) })
          } else {
            if (usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password && r.type == "default") < 0) return res.status(500).send('A senha está incorreta!');
            res.send({ user: usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email)], index: usersTable.users.findIndex(r=>r._id == req.body.email) })
          }
        } else if (req.body.type == "register" && req.body.email) {
          if (!req.body.changePass && usersTable.users.findIndex(r=>r._id == req.body.email) >= 0) return res.status(500).send('O email ja foi cadastrado!');
          if (req.body.changePass && usersTable.users.findIndex(r=>r._id == req.body.email) < 0) return res.status(500).send('Esse email não está cadastrado!');
          var code = ""
          var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for ( var i = 0; i < 5; i++ ) { code += characters.charAt(Math.floor(Math.random() * characters.length)) }
          if (codes.findIndex(r=> r._id == req.body.email) >= 0) codes[codes.findIndex(r=> r._id == req.body.email)] = { _id: req.body.email, code: code }
          if (codes.findIndex(r=> r._id == req.body.email) < 0) codes[codes.length] = { _id: req.body.email, code: code }
          var transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 587, auth: { user: process.env.email, pass: process.env.password } });
          if (!req.body.changePass) transporter.sendMail({ from: `"Animes Star" <${process.env.email}>`, to: req.body.email, subject: "Verificação de Email", text: `Olá ${req.body.name}, enviamos o seu codigo de verifição do email!`, html: `<div style="width: 80%; margin-inline: 10%; margin-top: 6vh; background: black"><div style="border: 0.5vh solid black; width: 100%; text-shadow: 0.6vh 0.6vh 1.3vh rgb(0, 0, 0); text-align: center; height: 40vh; background-image: url('https://wallpapercave.com/wp/wp2745301.jpg'); background-size: cover; background-position: center;"><div style="padding-top: 10vh; width: 100%; height: 100%; background: linear-gradient(to bottom,rgba(3, 3, 3, 0.8) 0%,rgba(3, 3, 3, 0.2) 30%,rgba(3, 3,3, 0.2) 0%,rgba(3, 3, 3, 1) 100%);"><a style="font-size: 8vh; font-weight: 800; color: white">Animes <span style="color: red">Star</span></a><br/><a style="font-size: 2vh; font-weight: 400; color: white">Seja bem-vindo ao nosso site de animes!</a></div></div>  <div style="padding-left: 10%; width: 90%; padding-top: 2vh; padding-bottom: 3vh; border: 0.5vh solid black; text-shadow: 0.6vh 0.6vh 1.3vh rgb(0, 0, 0); background: black"><div><a style="font-size: 3.5vh; color: white; font-weight: 700">Olá <span style="color: purple">${req.body.name}</span></a></div><div style="padding-top: 2vh"><a style="font-size: 1.5vh; color: white; font-weight: 400">Estamos lhe enviando esse email de verificação pois você está prestes a criar uma conta em nosso site!</a></div><div style="padding-top: 1vh"><a style="font-size: 1.5vh; color: white; font-weight: 400">Para concluir seu cadastro você deve colocar no nosso site o codigo que está logo abaixo:</a></div><div style="padding-top: 2vh"><a style="font-size: 2.5vh; color: white; font-weight: 400">Codigo: <span style="color: red; font-size: 3vh">${code}</span></a></div><div style="padding-top: 3vh"><a style="font-size: 1.5vh; color: white; font-weight: 400">Caso não esteja tentando criar uma conta em nosso site, entre em contato com nossa equipe para estarmos tomando as devidas providencias!</a></div><div style="padding-top: 2vh"><a href="${process.env.url}" style="font-size: 1.8vh; color: white; font-weight: 600">Nosso Site: <span style="color: purple">${process.env.url}</span></a></div><div style="padding-top: 2vh"><a style="font-size: 1.5vh; color: purple; font-weight: 400">A equipe da Star lhe deseja um otimo dia!</a></div></div></div>` }).then(info => { res.send('sucess') }).catch(err => { res.status(500).send('Não foi possivel enviar o email de verificação') });
          if (req.body.changePass) transporter.sendMail({ from: `"Animes Star" <${process.env.email}>`, to: req.body.email, subject: "Mudar Senha", text: `Olá ${req.body.name}, enviamos o seu codigo de verifição do email!`, html: `<div style="width: 80%; margin-inline: 10%; margin-top: 6vh; background: black"><div style="border: 0.5vh solid black; width: 100%; text-shadow: 0.6vh 0.6vh 1.3vh rgb(0, 0, 0); text-align: center; height: 40vh; background-image: url('https://wallpapercave.com/wp/wp2745301.jpg'); background-size: cover; background-position: center;"><div style="padding-top: 10vh; width: 100%; height: 100%; background: linear-gradient(to bottom,rgba(3, 3, 3, 0.8) 0%,rgba(3, 3, 3, 0.2) 30%,rgba(3, 3,3, 0.2) 0%,rgba(3, 3, 3, 1) 100%);"><a style="font-size: 8vh; font-weight: 800; color: white">Animes <span style="color: red">Star</span></a><br/><a style="font-size: 2vh; font-weight: 400; color: white">Seja bem-vindo ao nosso site de animes!</a></div></div>  <div style="padding-left: 10%; width: 90%; padding-top: 2vh; padding-bottom: 3vh; border: 0.5vh solid black; text-shadow: 0.6vh 0.6vh 1.3vh rgb(0, 0, 0); background: black"><div><a style="font-size: 3.5vh; color: white; font-weight: 700">Olá <span style="color: purple">${usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email)].name}</span></a></div><div style="padding-top: 2vh"><a style="font-size: 1.5vh; color: white; font-weight: 400">Estamos lhe enviando esse email de verificação pois você está prestes a mudar a senha de sua conta em nosso site!</a></div><div style="padding-top: 1vh"><a style="font-size: 1.5vh; color: white; font-weight: 400">Para concluir você deve colocar no nosso site o codigo que está logo abaixo:</a></div><div style="padding-top: 2vh"><a style="font-size: 2.5vh; color: white; font-weight: 400">Codigo: <span style="color: red; font-size: 3vh">${code}</span></a></div><div style="padding-top: 3vh"><a style="font-size: 1.5vh; color: white; font-weight: 400">Caso não esteja tentando mudar a senha de sua conta em nosso site, entre em contato com nossa equipe para estarmos tomando as devidas providencias!</a></div><div style="padding-top: 2vh"><a href="${process.env.url}" style="font-size: 1.8vh; color: white; font-weight: 600">Nosso Site: <span style="color: purple">${process.env.url}</span></a></div><div style="padding-top: 2vh"><a style="font-size: 1.5vh; color: purple; font-weight: 400">A equipe da Star lhe deseja um otimo dia!</a></div></div></div>` }).then(info => { res.send('sucess') }).catch(err => { res.status(500).send('Não foi possivel enviar o email de verificação') });
        } else if (req.body.type == "verify" && req.body.email && req.body.password && req.body.code && req.body.name) {
          if (usersTable.users.findIndex(r=>r._id == req.body.email) >= 0) return res.status(500).send('O email ja foi cadastrado!');
          if (codes.findIndex(r=> r._id == req.body.email) < 0) return res.status(500).send('Não foi possivel verificar seu email!');
          if (codes[codes.findIndex(r=> r._id == req.body.email)].code == req.body.code) {
            usersTable.users[usersTable.users.length] = { _id: req.body.email, password: req.body.password, name: req.body.name, type: "default", date: moment(new Date()-0).format('DD/MM/YYYY'), avatar: "https://pbs.twimg.com/profile_images/794107415876747264/g5fWe6Oh_400x400.jpg", role: "Membro", banner: "#000000", about: "Não definido...", skipIntro: false, skipEp: false }
            usersTable.save()
            res.send({ user: usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email)], index: usersTable.users.findIndex(r=>r._id == req.body.email) })
          } else return res.status(500).send('O codigo é invalido!');
        } else if (req.body.type == "changePass" && req.body.email && req.body.password && req.body.code) {
          if (usersTable.users.findIndex(r=>r._id == req.body.email) < 0) return res.status(500).send('O email não existe!');
          if (codes.findIndex(r=> r._id == req.body.email) < 0) return res.status(500).send('Não foi possivel mudar sua senha!');
          if (codes[codes.findIndex(r=> r._id == req.body.email)].code == req.body.code) {
            usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email)].password = req.body.password
            usersTable.save()
            return res.send({ user: usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email)], index: usersTable.users.findIndex(r=>r._id == req.body.email) } )
          } else return res.status(500).send('O codigo é invalido!');   
        } else if (req.body.type == "changeAccount" && req.body.email && req.body.password && req.body.date) {
          if (usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password) < 0) return res.status(500).send('Você não está logado!');
          for(var key in req.body.date) {
            var value = req.body.date[key];
            if (value == "true") value = true; if (value == "false") value = false
            if (usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password)]) usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password)][key] = value
          }
          usersTable.save()
          return res.send({ user: usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password)], index: req.body.index} )
        } else return res.status(500).send('Ocorreu algum erro!');
      })
    })
    .post('/loadBanners', async function(req, res) {
      var banners = false
      var calendars = false
      await getBannerAnimes().then((result)=>{ banners = result }).catch()
      res.send({ banners: banners })
    })
    .post('/loadMainPage', async function(req, res) {
      var calendars = false
      var newEps = false
      var tops = false
      await getMainPage().then((result)=>{
        calendars = result.calendar;
        newEps = result.animes;
        tops = result.tops;
      }).catch()
      res.send({ calendars: calendars, newEps: newEps, tops: tops })
    })
    .post('/loadFilms', async function(req, res) {
      var films = false
      await getFilms().then((result)=>{
        films = result.films;
      }).catch()
      res.send({ films: films })
    })
    .post('/loadSearch', async function(req, res) {
      var animes = false
      var pages = false
      await searchAnimes(req.body.anime, req.body.page).then((result)=>{ animes = result.animes; pages = result.pages }).catch()
      res.send({ animes: animes, pages: pages })
    })
    .post('/loadNewEps', async function(req, res) {
      var newEps = false
      var pages = false
      await getNewEps(req.body.page).then((result)=>{
        newEps = result.animes;
        pages = result.pages;
      }).catch()
      res.send({ newEps: newEps, pages: pages })
    })
    .post('/loadCalendar', async function(req, res) {
      var calendar = false
      await getCalendar(req.body.date).then((result)=>{ calendar = result.animes }).catch()
      res.send({ calendar: calendar })
    })
    .post('/loadAnimes', async function(req, res) {
      var animes = false
      var pages = false
      await getAnimes(req.body.page).then((result)=>{ animes = result.animes; pages = result.pages }).catch()
      res.send({ animes: animes, pages: pages })
    })
    .post('/loadLeaters', async function(req, res) {
      var animes = false
      var pages = false
      await getLeaters(req.body.anime, req.body.page).then((result)=>{ animes = result.animes; pages = result.pages }).catch()
      res.send({ animes: animes, pages: pages })
    })
    .post('/like', async function(req, res) {
      database.Animes.findById('Animes', async (error, animesTable) => {
        if (!animesTable) { var animesTable = new database.Animes({_id: 'Animes'}); animesTable.save() }
        if (animesTable.animes.findIndex(r=> r._id == req.body.anime) >= 0) {
          if (req.body.remove == "false") {
            animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].like = Number(animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].like) - 1
            if (animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].like < 0) animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].like = 0
          } else {
            animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].like = Number(animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].like) + 1
          }
        } else {
          animesTable.animes[animesTable.animes.length] = { _id: req.body.anime, like: 1, dislike: 0 }
        }
        animesTable.save()
        res.send('true')
      })
    })
    .post('/dislike', async function(req, res) {
      database.Animes.findById('Animes', async (error, animesTable) => {
        if (!animesTable) { var animesTable = new database.Animes({_id: 'Animes'}); animesTable.save() }
        if (animesTable.animes.findIndex(r=> r._id == req.body.anime) >= 0) {
          if (req.body.remove == "false") {
            animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].dislike = Number(animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].dislike) - 1
            if (animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].dislike < 0) animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].dislike = 0
          } else {
            animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].dislike = Number(animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].dislike) + 1
          }
        } else {
          animesTable.animes[animesTable.animes.length] = { _id: req.body.anime, like: 0, dislike: 1 }
        }
        animesTable.save()
        res.send('true')
      })
    })
    .post('/comment', async function(req, res) {
      if (req.body.anime && (req.user || (req.body.email && req.body.password)) && req.body.comment && req.body.comment.length <= 1000) {
        database.Animes.findById('Animes', async (error, animesTable) => {
          if (!animesTable) { var animesTable = new database.Animes({_id: 'Animes'}); animesTable.save() }
          database.Users.findById('Users', async (error, usersTable) => {
            if (usersTable.users.findIndex(r=> r._id == req.body.email && r.type == "discord") >= 0 && req.user && req.user.id == req.body.email) {
              if (animesTable.animes.findIndex(r=> r._id == req.body.anime) >= 0) {
                animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments[animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.length] = {
                  _id: newID(animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments, animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.length),
                  author: usersTable.users.findIndex(r=> r._id == req.body.email && r.type == "discord"),
                  comment: req.body.comment,
                  spoiler: req.body.spoiler,
                  moment: new Date(),
                }
              } else {
                var index = animesTable.animes.length
                animesTable.animes[index] = { _id: req.body.anime, comments: [] }
                animesTable.animes[index].comments[0] = {
                  _id: 0,
                  author: usersTable.users.findIndex(r=> r._id == req.body.email && r.type == "discord"),
                  comment: req.body.comment,
                  spoiler: req.body.spoiler,
                  moment: new Date(),
                }
              }
              usersTable.users[usersTable.users.findIndex(r=> r._id == req.body.email && r.type == "discord")].comments += 1
              usersTable.save()
              animesTable.save()
              return res.send('true')
            } else if (usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password && r.type == "default") >= 0) {
              if (animesTable.animes.findIndex(r=> r._id == req.body.anime) >= 0) {
                animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments[animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.length] = {
                  _id: newID(animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments, animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.length),
                  author: usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password && r.type == "default"),
                  comment: req.body.comment,
                  spoiler: req.body.spoiler,
                  moment: new Date(),
                }
              } else {
                var index = animesTable.animes.length
                animesTable.animes[index] = { _id: req.body.anime, comments: [] }
                animesTable.animes[index].comments[0] = {
                  _id: 0,
                  author: usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password && r.type == "default"),
                  comment: req.body.comment,
                  spoiler: req.body.spoiler,
                  moment: new Date(),
                }
              }
              usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password && r.type == "default")].comments += 1
              usersTable.save()
              animesTable.save()
              return res.send('true')
            } else return res.status(500).send('false');
          })
        })
      } else return res.status(500).send('false');
    })
    .post('/responseComment', async function(req, res) {
      if (req.body.anime && (req.user || (req.body.email && req.body.password)) && req.body.commentID && req.body.comment && req.body.comment.length <= 1000) {
        database.Animes.findById('Animes', async (error, animesTable) => {
          database.Users.findById('Users', async (error, usersTable) => {
            if ((usersTable.users.findIndex(r=> r._id == req.body.email && r.type == "discord") >= 0 && req.user && req.user.id == req.body.email) || usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password && r.type == "default") >= 0) {
              if (animesTable.animes.findIndex(r=> r._id == req.body.anime) >= 0 && animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.findIndex(r=>r._id == req.body.commentID) >= 0) {
                var comentario = animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments[animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.findIndex(r=>r._id == req.body.commentID)]
                comentario.responses[comentario.responses.length] = {
                  _id: newID(comentario.responses, comentario.responses.length),
                  author: usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password),
                  comment: req.body.comment,
                  spoiler: req.body.spoiler,
                  moment: new Date(),
                }
                usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password)].comments += 1
                usersTable.save()
                animesTable.save()
                return res.send('true')
              } else return res.status(500).send('false');
            } else return res.status(500).send('false');
          })
        })
      } else return res.status(500).send('false');
    })
    .post('/deleteResponse', async function(req, res) {
      if (req.body.anime && (req.user || (req.body.email && req.body.password)) && req.body.responseID && req.body.commentID) {
        database.Animes.findById('Animes', async (error, animesTable) => {
          database.Users.findById('Users', async (error, usersTable) => {
            if ((usersTable.users.findIndex(r=> r._id == req.body.email && r.type == "discord") >= 0 && req.user && req.user.id == req.body.email) || usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password && r.type == "default") >= 0) {
              if (animesTable.animes.findIndex(r=> r._id == req.body.anime) >= 0 && animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.findIndex(r=>r._id == req.body.commentID) >= 0) {
                var comentario = animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments[animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.findIndex(r=>r._id == req.body.commentID)]
                if (comentario.responses.findIndex(r=> r._id == req.body.responseID) >= 0 && comentario.responses[comentario.responses.findIndex(r=> r._id == req.body.responseID)]) {
                  if (comentario.responses[comentario.responses.findIndex(r=> r._id == req.body.responseID)].author == usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password)) {
                    usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password)].comments -= 1
                    usersTable.save()
                  }
                  comentario.responses.splice(comentario.responses.findIndex(r=> r._id == req.body.responseID), 1)
                  animesTable.save()
                  return res.send('true')
                } else return res.status(500).send('false');
              } else return res.status(500).send('false');
            } else return res.status(500).send('false');
          })
        })
      } else return res.status(500).send('false');
    })
    .post('/deleteComment', async function(req, res) {
      if (req.body.email && req.body.password && req.body.commentID && req.body.anime) {
        database.Animes.findById('Animes', async (error, animesTable) => {
          if (animesTable.animes.findIndex(r=> r._id == req.body.anime) >= 0) {
            database.Users.findById('Users', async (error, usersTable) => {
              if ((req.user && req.body.email == req.user.id && usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password && r.type == "discord") >= 0) || (usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password && r.type == "default") >= 0)) {
                if (animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.findIndex(r=> r._id == req.body.commentID) >= 0 && animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments[animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.findIndex(r=> r._id == req.body.commentID)] && (animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments[animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.findIndex(r=> r._id == req.body.commentID)].author == usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password) || (usersTable.users[usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password)].role == "Developer" || usersTable.users[usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password)].role == "CEO" || usersTable.users[usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password)].role == "Administrator" || usersTable.users[usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password)].role == "Moderator" || usersTable.users[usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password)].role == "Support"))) {
                  if (animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments[animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.findIndex(r=> r._id == req.body.commentID)].author == usersTable.users.findIndex(r=> r._id == req.body.email && r.password == req.body.password)) {
                    usersTable.users[usersTable.users.findIndex(r=>r._id == req.body.email && r.password == req.body.password)].comments -= 1
                    usersTable.save()
                  }
                  animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.splice(animesTable.animes[animesTable.animes.findIndex(r=> r._id == req.body.anime)].comments.findIndex(r=> r._id == req.body.commentID), 1)
                  animesTable.save()
                  return res.send("true")
                } else return res.status(500).send('false');
              } else return res.status(500).send('false');
            })
          } else return res.status(500).send('false');
        })
      } else return res.status(500).send('false');
    })
    .post('/report', async function(req, res) {
      if (req.body.author && req.body.email && req.body.password && req.body.report && req.body.comment && req.body.commentID && req.body.commentAuthor && req.body.url && req.body.anime) {
        database.Users.findById('Users', async (error, usersTable) => {
          if ((req.user && req.user.id == req.body.email && usersTable.users[req.body.author] && usersTable.users[req.body.commentAuthor] && usersTable.users[req.body.author].email == req.body.email) || (usersTable.users[req.body.author] && usersTable.users[req.body.author]._id == req.body.email && usersTable.users[req.body.author].password == req.body.password)) {
            var embed = new Discord.MessageEmbed()
              .setTitle(`• Reporte ${req.body.report}`)
              .addField(`**> Reportador:**`, `***Nome:*** *${usersTable.users[req.body.author].name}* - ***Email/Discord:*** *${usersTable.users[req.body.author]._id}* - ***ID:*** *${req.body.author}*`)
              .addField(`**> Reportado:**`, `***Nome:*** *${usersTable.users[req.body.commentAuthor].name}* - ***Email/Discord:*** *${usersTable.users[req.body.commentAuthor]._id}* - ***ID:*** *${req.body.commentAuthor}*`)
              .addField(`**> Informações:**`,`***URL:*** *${req.body.url}* - ***AnimeID:*** *${req.body.anime}* - ***ComentarioID:*** *${req.body.commentID}*`)
              .addField(`**> Comentario:**`,`*${req.body.comment}*`)
              .setColor('#ff0000')
            client.channels.cache.get(process.env.report).send({ embeds: [embed] })
            res.send("true")
          } else return res.status(500).send('false');
        })
      } else return res.status(500).send('false');
    })
    .listen(3000, function (err) {
      if (err) return console.log(`[Animes WebSite] => Site Error:\n${err}`)
      console.log(`[Animes WebSite] => WebSite Loaded!`)
    });
}
function newID(array, id) {
  if (array.findIndex(r => r._id == id) >= 0) return newID(array, Number(id)+1)
  return Number(id);
}

var getAnime = (anime) => new Promise(async function (resolve, reject) {
  await request(`https://animesonehd.xyz/${anime}/`, async function (error, response, body) {
    if (error) return console.log(`[getAnime] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var animes = {
      id: anime,
      name: $(".epContainer .epTitulo").children().remove().end().text().replace("– Todos os Episódios",""),
      image: $("#anime #capaAnime img").attr('src'),
      sinopse: $(".epContainer #sinopse2").children().remove().end().text(),
      eps: [],
    }
    $("#anime .boxAnimeSobre .boxAnimeSobreLinha").each(function(index, element) {
      if (element.children.filter(r=>r.name=="b")[0].children[0].data) animes[element.children.filter(r=>r.name=="b")[0].children[0].data.toLowerCase().replace(/[^a-zA-Z]/g, "")] = element.children.filter(r=>r.type=="text")[0].data
    })
    $("#anime .boxAnimeSobre .boxAnimeSobreLinha a").each(function(index, element) {
      animes[element.children[0].data.toLowerCase().replace(/[^a-zA-Z]/g, "")] = element.parent.next.data
    })
    $(".epContainer .SingleBox a").each(function(index, element) {
      if (element.attribs.href.includes("https://animesonehd.xyz/")) {
        if (!animes.temp1) {
          animes.temp1 = {
            name: element.children[0].children[0].children[0].data,
            url: element.attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
          }
        } else if (!animes.temp2) {
          animes.temp2 = {
            name: element.children[0].children[0].children[0].data,
            url: element.attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
          }
        }
      }
    })
    $(".ListaContainer a").each(function(index, element) {
      var titleAux = element.attribs.title.replace(element.attribs.title.slice(0, element.attribs.title.indexOf("–")+1),"")
      var title = titleAux.replace(titleAux.slice(0, titleAux.indexOf("–")+2),"")
      var epAux = element.attribs.title.replace(element.attribs.title.slice(0, element.attribs.title.indexOf("Episódio")+9),"")
      var ep = epAux.replace(epAux.slice(epAux.indexOf("–")-1, epAux.length),"")
      animes.eps[animes.eps.length] = {
        url: element.attribs.href.replace("https://animesonehd.xyz/","").replace("/",""),
        title: title,
        ep: Number(ep) ? `Episódio ${ep}` : title,
        img: animes.image
      }
    })
    resolve({ animes: animes })
  })
})
var getCalendar = (date) => new Promise(async function (resolve, reject) {
  await request(`https://animesonehd.xyz/calendario/`, async function (error, response, body) {
    if (error) return console.log(`[getCalendar] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var molde = []
    $(".uAnisContainer #CalendarioSystem").each(function(index, element2) {
      if (element2.children.filter(r=>r.attribs&&r.attribs.class=="CalendarioTitulo")[0].children[0].data == date) {
        element2.children.filter(r=>r.name=="ul")[0].children.filter(r=>r.name=="a").forEach((element)=>{
          molde[molde.length] = {
            name: element.attribs.title,
            src: element.attribs.href,
            url: element.attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
          }
        })
      }
    })
    var animes = []
    molde.forEach(async (anime, index)=>{
      await request(anime.src, async function (error, response, body) {
        if (error) return console.log(`[getCalendar(2)] => Erro na API:\n${error}`)
        var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
        $("#anime #capaAnime img").each(function(index, element) {
          animes[animes.length] = {
            name: anime.name,
            eps: anime.name.includes("Dublado") || anime.name.includes("dublado") ? "Dublado" : "Legendado",
            type: anime.name.includes("Filme") || anime.name.includes("filme") || anime.name.includes("Movie") || anime.name.includes("movie") ? "Filme" : "Anime",
            img: element.attribs.src,
            url: anime.url
          }
        })
        if (animes.length == molde.length) resolve({ animes: animes })
      })
    })
  })
})
var getLeaters = (anime, page) => new Promise(async function (resolve, reject) {
  await request(`https://animesonehd.xyz/lista-de-animes/page/${page}/?letra=${anime}`, async function (error, response, body) {
    if (error) return console.log(`[getAnimes] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var animes = []
    $(".uAnisContainer .AnimesItem a").each(function(index, element2) {
      var element = element2.children.filter(r=>r.name=="div"&&r.attribs&&r.attribs.class=="AnimesCapa")[0].children.filter(r=>r.name=="img")[0]
      animes[animes.length] = {
        name: element.attribs.title,
        eps: element.attribs.title.includes("Dublado") || element.attribs.title.includes("dublado") ? "Dublado" : "Legendado",
        type: element.attribs.title.includes("Filme") || element.attribs.title.includes("filme") || element.attribs.title.includes("Movie") || element.attribs.title.includes("movie") ? "Filme" : "Anime",
        img: element.attribs.src,
        url: element2.attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
      }
    })
    var pages = []
    $(".mAlign .page-numbers").each(function(index, element) {
      if (Number(element.children[0].data) || element.children[0].data == "&hellip;") {
        pages[pages.length] = {
          number: element.children[0].data == "&hellip;" ? "..." : element.children[0].data,
          select: element.attribs.class == "page-numbers current" ? true : false
        }
      }
    })
    resolve({ animes: animes, pages: pages })
  })
})
var getAnimes = (page) => new Promise(async function (resolve, reject) {
  await request(`https://animesonehd.xyz/lista-de-animes/page/${page}/`, async function (error, response, body) {
    if (error) return console.log(`[getAnimes] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var animes = []
    $(".uAnisContainer .AnimesItem a").each(function(index, element2) {
      var element = element2.children.filter(r=>r.name=="div"&&r.attribs&&r.attribs.class=="AnimesCapa")[0].children.filter(r=>r.name=="img")[0]
      animes[animes.length] = {
        name: element.attribs.title,
        eps: element.attribs.title.includes("Dublado") || element.attribs.title.includes("dublado") ? "Dublado" : "Legendado",
        type: element.attribs.title.includes("Filme") || element.attribs.title.includes("filme") || element.attribs.title.includes("Movie") || element.attribs.title.includes("movie") ? "Filme" : "Anime",
        img: element.attribs.src,
        url: element2.attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
      }
    })
    var pages = []
    $(".mAlign .page-numbers").each(function(index, element) {
      if (Number(element.children[0].data) || element.children[0].data == "&hellip;") {
        pages[pages.length] = {
          number: element.children[0].data == "&hellip;" ? "..." : element.children[0].data,
          select: element.attribs.class == "page-numbers current" ? true : false
        }
      }
    })
    resolve({ animes: animes, pages: pages })
  })
})
var getNewEps = (page) => new Promise(async function (resolve, reject) {
  await request(`https://animesonehd.xyz/page/${page}/`, async function (error, response, body) {
    if (error) return console.log(`[getNewEps] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var animes = []
    $(".EpisodiosItem a").each(function(index, element) {
      animes[animes.length] = {
        name: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosDesc")[0].children[0].data,
        eps: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosInfo")[0].children[0].data,
        img: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosCapa")[0].children.filter(r=>r.name=="img")[0].attribs.src,
        type: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosDesc")[0].children[0].data.includes("Dublado") || element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosDesc")[0].children[0].data.includes("dublado") ? "DUB" : "LEG",
        res: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosQualidade")[0].children[0].data.includes("FullHD") ? "FHD" : element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosQualidade")[0].children[0].data,
        date: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosData")[0].children[0].data
       }
    })
    var pages = []
    $(".Episodios .mAlign .page-numbers").each(function(index, element) {
      if (Number(element.children[0].data) || element.children[0].data == "&hellip;") {
        pages[pages.length] = {
          number: element.children[0].data == "&hellip;" ? "..." : element.children[0].data,
          select: element.attribs.class == "page-numbers current" ? true : false
        }
      }
    })
    resolve({ animes: animes, pages: pages })
  })
})
var searchAnimes = (anime, page) => new Promise(async function (resolve, reject) {
  await request(`https://animesonehd.xyz/page/${page}/?s=${anime}`, async function (error, response, body) {
    if (error) return console.log(`[searchAnimes] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var animes = []
    $(".uAnisContainer .AnimesItem a").each(function(index, element2) {
      var element = element2.children.filter(r=>r.name=="div"&&r.attribs&&r.attribs.class=="AnimesCapa")[0].children.filter(r=>r.name=="img")[0]
      animes[animes.length] = {
        name: element.attribs.title,
        eps: element.attribs.title.includes("Dublado") || element.attribs.title.includes("dublado") ? "Dublado" : "Legendado",
        type: element.attribs.title.includes("Filme") || element.attribs.title.includes("filme") || element.attribs.title.includes("Movie") || element.attribs.title.includes("movie") ? "Filme" : "Anime",
        img: element.attribs.src,
        url: element2.attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
      }
    })
    var pages = []
    $(".uAnisContainer .mAlign .page-numbers").each(function(index, element) {
      if (Number(element.children[0].data) || element.children[0].data == "&hellip;") {
        pages[pages.length] = {
          number: element.children[0].data == "&hellip;" ? "..." : element.children[0].data,
          select: element.attribs.class == "page-numbers current" ? true : false
        }
      }
    })
    resolve({ animes: animes, pages: pages })
  })
})
var verifyAnimes = (anime) => new Promise(async function (resolve, reject) {
  await request(`https://animesonehd.xyz/?s=${anime.name}`, async function (error, response, body) {
    if (error) return console.log(`[searchAnimes] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var animes = false
    $(".uAnisContainer .AnimesItem a").each(function(index, element2) {
      if (!animes) {
        var element = element2.children.filter(r=>r.name=="div"&&r.attribs&&r.attribs.class=="AnimesCapa")[0].children.filter(r=>r.name=="img")[0]
        animes = {
          name: element.attribs.title.replace("– Todos os Episódios",""),
          desc: anime.desc,
          date: anime.date,
          img: anime.img,
          url: element2.attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
        }
      }
    })
    if (!animes) { resolve("not found") } else {
    resolve(animes) }
  })
})
var getBannerAnimes = () => new Promise(async function (resolve, reject) {
  await request("https://animes.vision/", async function (error, response, body) {
    if (error) return console.log(`[getBannerAnimes] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var animes = []
    var banners = []
    $(".deslide-item").each(async function (index, element) { if (element.children.filter(r=> r.name == "div" && r.attribs.class == "deslide-item-content")[0].children.filter(r=> r.name == "div" && r.attribs.class == "desi-buttons")[0].children.filter(r=> r.name == "a" && r.attribs.class == "btn btn-primary btn-radius mr-2")[0].attribs.href.includes("animes" && "vision")) animes[animes.length] = { name: element.children.filter(r=> r.name == "div" && r.attribs.class == "deslide-item-content")[0].children.filter(r=> r.name == "div" && r.attribs.class == "desi-head-title dynamic-name")[0].children[0].data, desc: element.children.filter(r=> r.name == "div" && r.attribs.class == "deslide-item-content")[0].children.filter(r=> r.name == "div" && r.attribs.class == "desi-description")[0].children[0].data, date: element.children.filter(r=> r.name == "div" && r.attribs.class == "deslide-item-content")[0].children.filter(r=> r.name == "div" && r.attribs.class == "sc-detail")[0].children.filter(r=> r.name == "div" && r.attribs.class == "scd-item m-hide")[0].children[1].data, img: element.children.filter(r=> r.name == "div" && r.attribs.class == "deslide-cover")[0].children.filter(r=> r.name == "div" && r.attribs.class == "deslide-cover-img")[0].children.filter(r=> r.name == "img")[0].attribs.src } });
    for (var i = 0; i < animes.length; i++) { await verifyAnimes(animes[i]).then((anime)=>{ if (anime !== "not found") banners[banners.length] = anime }) }
    banners[banners.length] = { url: "3285", name: "Kimetsu no Yaiba", desc: "Japão, era Taisho. Tanjiro, um bondoso jovem que ganha a vida vendendo carvão, descobre que sua família foi massacrada por um demônio. E pra piorar, Nezuko, sua irmã mais nova e única sobrevivente, também foi transformada num demônio. Arrasado com esta sombria realidade, Tanjiro decide se tornar um matador de demônios para fazer sua irmã voltar a ser humana, e para matar o demônio que matou sua família. Um triste conto sobre dois irmãos, onde os destinos dos humanos e dos demônios se entrelaçam!", date: "2019", img:"https://selectgame.gamehall.com.br/wp-content/uploads/2021/07/Tanjirou-e-Nezuko-Kimetsu-no-Yaiba-4K-Wallpaper-Papel-de-Parede-scaled.jpg" }
    banners[banners.length] = { url: "29601", name: "Death Note", desc: "O jovem estudante Light Yagami achar um caderno com poderes sobrenaturais, chamado Death Note, no qual era possível matar uma pessoa apenas escrevendo seu nome no caderno. Quando o descobre, Light tenta eliminar todos os criminosos do mundo e dar à sociedade um mundo livre do mal. Mas seus planos começam a sair de rumo quando o detetive L resolver contrariar Light.", date: "2006", img:"https://a-static.besthdwallpaper.com/death-note-ryuk-papel-de-parede-1680x1050-78226_5.jpg" }
    resolve(banners)
  })
})

var getMainPage = () => new Promise(async function (resolve, reject) {
  await request(`https://animesonehd.xyz/`, async function (error, response, body) {
    if (error) return console.log(`[getMainPage] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var calendar = []
    $(".bTitulo").each(function(index, elementBase) {
      if (elementBase.attribs && elementBase.attribs['data-titulo'] && elementBase.attribs['data-titulo'] == "Lançamentos do Dia") {
        elementBase.children.filter(r=>r.name=="div"&&r.attribs.class=="main-carousel")[0].children.filter(r=>r.attribs&&r.attribs.class=="AnimesItem").forEach((anime, index)=>{
          if (anime.children.filter(r=>r.name=="a")[0].children.filter(r=>r.name=="div"&&r.attribs.class=="AnimesCapa")[0].children.filter(r=>r.name=="img")[0]) {
            var element = anime.children.filter(r=>r.name=="a")[0].children.filter(r=>r.name=="div"&&r.attribs.class=="AnimesCapa")[0].children.filter(r=>r.name=="img")[0]
            calendar[calendar.length] = {
              name: element.attribs.title,
              eps: element.attribs.title.includes("Dublado") || element.attribs.title.includes("dublado") ? "Dublado" : "Legendado",
              type: element.attribs.title.includes("Filme") || element.attribs.title.includes("filme") || element.attribs.title.includes("Movie") || element.attribs.title.includes("movie") ? "Filme" : "Anime",
              img: element.attribs.src,
              url: anime.children.filter(r=>r.name=="a")[0].attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
            }
          }
        })
      }
    })
    var animes = []
    $(".EpisodiosItem a").each(function(index, element) {
      animes[animes.length] = {
        name: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosDesc")[0].children[0].data,
        eps: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosInfo")[0].children[0].data,
        img: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosCapa")[0].children.filter(r=>r.name=="img")[0].attribs.src,
        type: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosDesc")[0].children[0].data.includes("Dublado") || element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosDesc")[0].children[0].data.includes("dublado") ? "DUB" : "LEG",
        res: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosQualidade")[0].children[0].data.includes("FullHD") ? "FHD" : element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosQualidade")[0].children[0].data,
        date: element.children.filter(r=>r.name=="div"&&r.attribs.class=="EpisodiosData")[0].children[0].data
      }
    })
    var tops = []
    $(".bTitulo").each(function(index, elementBase) {
      if (elementBase.attribs && elementBase.attribs['data-titulo'] && elementBase.attribs['data-titulo'] == "Mais Populares da Semana") {
        elementBase.children.filter(r=>r.name=="div"&&r.attribs.class=="main-carousel")[0].children.filter(r=>r.attribs&&r.attribs.class=="AnimesItem").forEach((anime, index)=>{
          if (anime.children.filter(r=>r.name=="a")[0].children.filter(r=>r.name=="div"&&r.attribs.class=="AnimesCapa")[0].children.filter(r=>r.name=="img")[0]) {
            var element = anime.children.filter(r=>r.name=="a")[0].children.filter(r=>r.name=="div"&&r.attribs.class=="AnimesCapa")[0].children.filter(r=>r.name=="img")[0]
            tops[tops.length] = {
              name: element.attribs.title,
              eps: element.attribs.title.includes("Dublado") || element.attribs.title.includes("dublado") ? "Dublado" : "Legendado",
              type: element.attribs.title.includes("Filme") || element.attribs.title.includes("filme") || element.attribs.title.includes("Movie") || element.attribs.title.includes("movie") ? "Filme" : "Anime",
              img: element.attribs.src,
              url: anime.children.filter(r=>r.name=="a")[0].attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
            }
          }
        })
      }
    })
    resolve({calendar: calendar, animes: animes, tops: tops})
  })
})

var getFilms = () => new Promise(async function (resolve, reject) {
  await request("https://animesonehd.xyz/?s=movie", async function (error, response, body) {
    if (error) return console.log(`[getFilms] => Erro na API:\n${error}`)
    var $ = cheerio.load(body, {xml: { normalizeWhitespace: true, decodeEntities: true, withStartIndices: false, withEndIndices: false },});
    var films = []
    $(".uAnisContainer .AnimesItem a").each(function(index, element2) {
      var element = element2.children.filter(r=>r.name=="div"&&r.attribs&&r.attribs.class=="AnimesCapa")[0].children.filter(r=>r.name=="img")[0]
      if (element.attribs.title.includes("Filme") || element.attribs.title.includes("filme") || element.attribs.title.includes("Movie") || element.attribs.title.includes("movie")) {
        films[films.length] = {
          name: element.attribs.title,
          eps: element.attribs.title.includes("Dublado") || element.attribs.title.includes("dublado") ? "Dublado" : "Legendado",
          type: "Filme",
          img: element.attribs.src,
          url: element2.attribs.href.replace("https://animesonehd.xyz/","").replace("/","")
        }
      }
    })
    resolve({ films: films })
  })
})