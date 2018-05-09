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
const SHIPPING_SERVICE_URL = functions.config().sty_shipping.url;
const SHIPPING_SERVICE_TOKEN = functions.config().sty_shipping.token;
// const SHIPPING_SERVICE_URL = 'https://0bcb3848.ngrok.io';
exports.posShippingRequestOnCreate = functions.firestore
    .document('/users-pos-data/{vendorId}/retail-orders/{retailOrderId}/shipping-request/{fsShipmentKey}')
    .onCreate((event) => __awaiter(this, void 0, void 0, function* () {
    console.log("shippingOnCreate called");
    const newData = event.data.data();
    const vendorId = Number(event.params.vendorId);
    const retailOrderId = Number(event.params.retailOrderId);
    const fsShipmentKey = event.params.fsShipmentKey;
    const data = yield createShipping(buildPayload(vendorId, retailOrderId, fsShipmentKey, newData));
    console.log("updateRefAfterCreate id", data.id);
    if (data.id) {
        yield updateRefAfterCreate(event.data.ref, data.id);
    }
    return 0;
}));
function updateRefAfterCreate(ref, shippingId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ref
            .set({ shippingId }, { merge: true })
            .catch((err) => handleError(err));
    });
}
function buildPayload(vendorId, retailOrderId, fsShipmentKey, newData) {
    return {
        title: newData.title,
        middler: newData.middler,
        fsShipmentKey,
        retailOrderId,
        vendorId,
        shipmentData: newData.shipmentData,
        items: newData.items
    };
}
function createShipping(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("createShipping payload", payload);
        // PATCH or SAVE
        const method = 'POST';
        const uri = SHIPPING_SERVICE_URL + '/deliveries';
        const res = yield request({
            uri,
            method,
            json: true,
            headers: {
                'content-type': 'application/json',
                'authorization': `Static ${SHIPPING_SERVICE_TOKEN}`
            },
            body: payload,
            resolveWithFullResponse: true
        });
        if (res.statusCode >= 400) {
            throw new Error(`Update quantity HTTP Error: ${res.statusCode}.`);
        }
        return res.body;
    });
}
;
function handleError(err) {
    console.error(err);
    throw new Error(err.ErrorMessage);
}
//# sourceMappingURL=onCreate.js.map