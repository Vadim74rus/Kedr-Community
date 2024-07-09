const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')

const token = '7047574030:AAEYPN4swoPvyWEfBSEcTgrEybNXLAfowuk';
const webAppUrl = 'https://kedr-community.netlify.app/';
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


bot.on('message',   async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === '/start') {
      await bot.sendMessage(chatId,'Ниже появится кнопка', {
          reply_markup: {
              inline_keyboard: [
                  [{text: 'Заполните форму', web_app: {url: webAppUrl}}]
              ]
          }
      })
  }

});

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT' + PORT))
