require('newrelic');
const Telegraf = require("telegraf");

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://solexchris.herokuapp.com/";
const API_TOKEN = "793236794:AAF9iFbvzhqu6NUHYvRjrtyU040V2yi_rOQ";
const bot = new Telegraf(API_TOKEN);

bot.use(Telegraf.log());

bot.help(({ reply }) => reply("Hello I'm the Solex Bot"));

const coffeeOrderSessions = [];

bot.command("orderopen", ctx => {
  const { from } = ctx.update.message;
  const coffeeGif = "CgADBAADdwADg731Uoi1wlQtUhaEAg";
  ctx.replyWithAnimation(coffeeGif, { caption: "Coffee Order Open!" });
  const newSession = {
    from,
    orders: [],
    isOrderOpen: true
  };
  coffeeOrderSessions.push(newSession);
});

bot.start(ctx => ctx.reply("Hello"));

if (process.env.NODE_ENV === "production") {
  bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
  bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
} else {
  bot.launch();
}
