const mongoose = require('mongoose');
mongoose.connect(process.env.dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, error => {
  if (error) {
    console.log(`[Animes WebSite] => Erro na DataBase: ${error}`);
    return process.exit(1);
  }
  return console.log(`[Animes WebSite] => Database Connected!`);
});


var MoldeBase = new mongoose.Schema({ _id: String })
var MoldeResponses = new mongoose.Schema({
  _id: String,
  author: String,
  comment: String,
  spoiler: Boolean,
  moment: Number,
})
var MoldeComments = new mongoose.Schema({
  _id: String,
  author: String,
  comment: String,
  spoiler: Boolean,
  moment: Number,
  responses: [MoldeResponses]
})
var MoldeAnime = new mongoose.Schema({
  _id: String,
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  comments: [MoldeComments]
})
var animeSchema = new mongoose.Schema({
  _id: String,
  animes: [MoldeAnime]
})

var MoldeListAnime = new mongoose.Schema({
  _id: String,
  image: String,
  name: String,
  type: String,
  legend: String
})
var MoldeUser = new mongoose.Schema({
  _id: String,
  password: String,
  role: String,
  type: String,
  name: String,
  about: String,
  avatar: String,
  banner: String,
  date: String,
  comments: Number,
  videos: Number,
  list: {
    favoritos: [MoldeListAnime],
    assistir: [MoldeListAnime],
    assistido: [MoldeListAnime],
    assistindo: [MoldeListAnime],
  }
})
var userSchema = new mongoose.Schema({
  _id: String,
  users: [MoldeUser]
})

var Users = mongoose.model('Users', userSchema)
exports.Users = Users
var Animes = mongoose.model('Animes', animeSchema)
exports.Animes = Animes