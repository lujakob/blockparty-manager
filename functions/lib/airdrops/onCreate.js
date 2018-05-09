"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const telegraf = require("telegraf");
try {
    admin.initializeApp(functions.config().firebase);
}
catch (e) { }
const TELEGRAM_URL = functions.config().telegram.url;
const CHAT_ID = functions.config().telegram.chat_id;
const TOKEN = functions.config().telegram.token;
const APP_URL = 'http://blockparty.lukasjakob.com/airdrop/detail';
exports.airdropsOnCreate = functions.firestore
    .document('/airdrops/{id}')
    .onCreate((event) => __awaiter(this, void 0, void 0, function* () {
    const id = event.params.id;
    const newData = event.data.data();
    const text = `New airdop 🎉 - ${APP_URL}/${id}`;
    const bot = new telegraf.Telegram(TOKEN, {});
    bot.sendMessage(CHAT_ID, text)
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
}));
function handleError(err) {
    console.error(err);
    throw new Error(err.ErrorMessage);
}
//# sourceMappingURL=onCreate.js.map