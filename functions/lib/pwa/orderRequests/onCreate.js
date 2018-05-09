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
const request = require("request-promise");
const STY_ORDER_URL = functions.config().sty_order.url;
const STY_ORDER_TOKEN = functions.config().sty_order.token;
// const STY_ORDER_URL = 'https://08269115.ngrok.io';
try {
    admin.initializeApp(functions.config().firebase);
}
catch (e) { } // You do that because the admin SDK can only be initialized once.
const fieldValue = admin.firestore.FieldValue;
exports.pwaOrderRequestsOnCreate = functions.firestore
    .document('/order-requests/{orderId}')
    .onCreate((event) => __awaiter(this, void 0, void 0, function* () {
    const payload = buildShopOrderPayload(event.data.data());
    const orderRequestId = event.params.orderId;
    console.log('orderRequestOnCreate: ' + event.params.orderId + ', payload: ', payload);
    const order = yield request({
        uri: `${STY_ORDER_URL}/shop-orders`,
        method: 'POST',
        json: true,
        headers: {
            'content-type': 'application/json',
            'authorization': `Static ${STY_ORDER_TOKEN}`
        },
        body: payload,
        resolveWithFullResponse: true
    });
    if (order.statusCode >= 400) {
        yield event.data.ref
            .set({ status: 'FATAL_ERROR' }, { merge: true })
            .catch((err) => handleError(err));
        throw new Error(`HTTP Error: ${order.statusCode}, orderRequestId: ${orderRequestId}`);
    }
    console.log('sty-service-order id: ', order.body.id, order.body);
    yield updateOrderRequestAfterCreate(event.data.ref, order.body.id);
    yield createOrder(order.body);
}));
function buildShopOrderPayload(payload) {
    return {
        userId: payload.userId,
        userLanguage: payload.userLanguage,
        vendors: payload.vendors,
        payment: {
            token: payload.payment.token,
            email: payload.payment.email
        }
    };
}
function updateOrderRequestAfterCreate(ref, orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ref
            .set({ orderId }, { merge: true })
            .catch((err) => handleError(err));
    });
}
function createOrder(orderData) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = Object.assign(orderData, {
            createdAt: fieldValue.serverTimestamp(),
            updatedAt: fieldValue.serverTimestamp()
        });
        for (const retailOrder of orderData.retailOrders) {
            yield admin.firestore().doc(`/orders/${orderData.id}/retail-orders/${retailOrder.id.toString()}`)
                .set(retailOrder, { merge: true })
                .catch((err) => handleError(err));
        }
        yield admin.firestore().doc(`/orders/${orderData.id}`)
            .set(payload, { merge: true })
            .catch((err) => handleError(err));
    });
}
function handleError(err) {
    console.error(err);
    throw new Error(err.ErrorMessage);
}
//# sourceMappingURL=onCreate.js.map