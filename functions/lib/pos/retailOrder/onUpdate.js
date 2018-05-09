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
const request = require("request-promise");
const ORDER_SERVICE_URL = functions.config().sty_order.url;
const ORDER_SERVICE_TOKEN = functions.config().sty_order.token;
// const ORDER_SERVICE_URL = 'https://00e9433d.ngrok.io';
exports.posRetailOrderOnUpdate = functions.firestore
    .document('/users-pos-data/{vendorId}/retail-orders/{retailOrderId}')
    .onUpdate((event) => __awaiter(this, void 0, void 0, function* () {
    const retailOrderId = Number(event.params.retailOrderId);
    const newData = event.data.data();
    const previousData = event.data.previous.data();
    const newState = event.data.data().state;
    console.log("ORDER_SERVICE_URL", ORDER_SERVICE_URL);
    console.log("newData.state", newData.state);
    if (newData.state === previousData.state) {
        return 0;
    }
    switch (newState) {
        case 'Confirmed':
            yield updateState(retailOrderId, newState);
            break;
        case 'Out of Stock':
            yield updateState(retailOrderId, newState);
            break;
    }
    return 0;
}));
function updateState(id, newState) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = { state: newState };
        console.log("updateState payload", payload);
        const resChangeState = yield request({
            uri: ORDER_SERVICE_URL + `/retail-orders/${id}/state`,
            method: 'POST',
            json: true,
            headers: {
                'content-type': 'application/json',
                'authorization': `Static ${ORDER_SERVICE_TOKEN}`
            },
            body: payload,
            resolveWithFullResponse: true
        });
        if (resChangeState.statusCode >= 400) {
            throw new Error(`Update quantity HTTP Error: ${resChangeState.statusCode}.`);
        }
    });
}
;
//# sourceMappingURL=onUpdate.js.map