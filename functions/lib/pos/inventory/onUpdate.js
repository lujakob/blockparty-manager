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
const INVENTORY_SERVICE_URL = functions.config().sty_inventory.url;
const INVENTORY_SERVICE_TOKEN = functions.config().sty_inventory.token;
exports.posInventoryOnUpdate = functions.firestore
    .document('/users-pos-data/{vendorId}/products/{productId}/variants/{variantId}')
    .onUpdate((event) => __awaiter(this, void 0, void 0, function* () {
    const newData = event.data.data();
    const vendorId = Number(event.params.vendorId);
    const variantId = Number(event.params.variantId);
    const productId = Number(event.params.productId);
    const previousData = event.data.previous.data();
    // no quantity, no stock set for this variant yet
    if (!newData.quantity) {
        return 0;
    }
    // first quantity change -> save quantity entry
    if (!previousData.quantity) {
        // quantity is set as hashmap (key => vendorLocationId, value => quantity)
        for (const vendorLocationId in newData.quantity) {
            const updateData = {
                'variantId': variantId,
                'productId': productId,
                'vendorId': vendorId,
                'vendorLocationId': Number(vendorLocationId),
                'qtyPresent': Number(newData.quantity[vendorLocationId]),
                'qtyAccessible': 0
            };
            yield saveQuantity(updateData);
        }
    }
    else {
        for (const vendorLocationId in newData.quantity) {
            // only update target vendorLocation quantity
            if (!previousData.quantity[vendorLocationId]
                || previousData.quantity[vendorLocationId] !== newData.quantity[vendorLocationId]) {
                yield updateQuantity(variantId, vendorId, Number(vendorLocationId), Number(newData.quantity[vendorLocationId]));
            }
        }
    }
    return 0;
}));
/**
 * save stock
 * @param data
 * @returns {Promise<void>}
 */
function saveQuantity(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const resChangeState = yield request({
            uri: `${INVENTORY_SERVICE_URL}/stocks`,
            method: 'POST',
            json: true,
            headers: {
                'content-type': 'application/json',
                'authorization': `Static ${INVENTORY_SERVICE_TOKEN}`
            },
            body: data,
            resolveWithFullResponse: true
        });
        if (resChangeState.statusCode >= 400) {
            throw new Error(`Update quantity HTTP Error: ${resChangeState.statusCode}.`);
        }
    });
}
;
/**
 * update stock
 */
function updateQuantity(variantId, vendorId, vendorLocationId, qtyPresent) {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = `${INVENTORY_SERVICE_URL}/stocks/variants/${variantId}/vendors/${vendorId}/locations/${vendorLocationId}`;
        const resChangeState = yield request({
            uri,
            method: 'PATCH',
            json: true,
            headers: {
                'content-type': 'application/json',
            },
            body: { qtyPresent },
            resolveWithFullResponse: true
        });
        if (resChangeState.statusCode >= 400) {
            throw new Error(`Update quantity HTTP Error: ${resChangeState.statusCode}.`);
        }
    });
}
;
//# sourceMappingURL=onUpdate.js.map