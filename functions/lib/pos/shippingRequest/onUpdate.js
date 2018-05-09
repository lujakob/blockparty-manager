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
const SHIPMENT_LABEL_CREATED_STATE = 'Shipment label created';
exports.posShippingRequestOnUpdate = functions.firestore
    .document('/users-pos-data/{vendorId}/retail-orders/{retailOrderId}/shipping-request/{fsShipmentKey}')
    .onUpdate((event) => __awaiter(this, void 0, void 0, function* () {
    const newData = event.data.data();
    const previousData = event.data.previous.data();
    const shippingId = newData.shippingId;
    console.log("newData", newData);
    if (newData.labelRequested === previousData.labelRequested) {
        return 0;
    }
    if (newData.labelRequested) {
        if (!shippingId) {
            console.log("shippingId is missing.");
        }
        else {
            yield updateDocumentLabelRequest(shippingId);
        }
    }
    return 0;
}));
function updateDocumentLabelRequest(shippingId) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = { state: SHIPMENT_LABEL_CREATED_STATE };
        console.log("updateState payload", shippingId, payload);
        const resChangeState = yield request({
            uri: SHIPPING_SERVICE_URL + `/deliveries/${shippingId}/update_shipment_state`,
            method: 'PUT',
            json: true,
            headers: {
                'content-type': 'application/json',
                'authorization': `Static ${SHIPPING_SERVICE_TOKEN}`
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