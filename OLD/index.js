console.log(`[Animes WebSite] => Starting...`)

const database = require("./database.js");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", async () => {
  console.log(`[Animes WebSite] => Discord Connected! [${client.guilds.cache.size} Guilds & ${client.users.cache.size} Users]`)
  await require("./website").load(client, database);
})

client.login(process.env.token).catch((e)=>{console.log('[Site Star™] => Token Invalido!')})
