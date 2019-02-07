const Telegraf = require("telegraf");

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://heroku-app-name.herokuapp.com";
const API_TOKEN = "TOKEN_FROM_BOT_FATHER";
const bot = new Telegraf(API_TOKEN);

bot.use(Telegraf.log());

bot.start(ctx => ctx.reply("Hello"));

if (process.env.NODE_ENV === "production") {
  console.log("Production!");
  bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
  bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
} else {
  bot.launch();
}
