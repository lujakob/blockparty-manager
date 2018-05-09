import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as request from 'request-promise';
import * as telegraf from 'telegraf';

try {
  admin.initializeApp(functions.config().firebase);
} catch (e) {}

const TELEGRAM_URL = functions.config().telegram.url;
const CHAT_ID = functions.config().telegram.chat_id;
const TOKEN = functions.config().telegram.token;
const APP_URL = 'http://blockparty.lukasjakob.com/airdrop/detail';

export const airdropsOnCreate = functions.firestore
  .document('/airdrops/{id}')
  .onCreate(async event => {
    const id = event.params.id;
    const newData = event.data.data();

    const text = `New airdop 🎉 - ${APP_URL}/${id}`;

    const bot = new telegraf.Telegram(TOKEN, {});
    bot.sendMessage(
      CHAT_ID,
      text
    )
      .then((res) => console.log(res))
      .catch((e) => console.log(e));

    // const link = `${APP_URL}/${id}`;
    // const text = encodeURIComponent(`New airdrop '${newData.title}' - go to ${link}`);
    // const uri = `${TELEGRAM_URL}/sendMessage?chat_id=${CHAT_ID}&text=${text}`;
    // console.log('text', text);
    // console.log('airdrop', newData);
    // console.log("uri", uri);

    // const message = await request({
    //   uri,
    //   method: 'GET',
    //   resolveWithFullResponse: true
    // });
    //
    // if (message.statusCode >= 400) {
    //   await event.data.ref
    //     .set({status: 'FATAL_ERROR'}, {merge: true})
    //     .catch((err) => handleError(err));
    //
    //   throw new Error(`HTTP Error: ${message.statusCode}, airdrop: ${id}`);
    // }
    // return 0;

    return 0;
  });

function handleError(err) {
  console.error(err);
  throw new Error(err.ErrorMessage);
}

