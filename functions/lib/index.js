"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const airdrops = require("./airdrops");
exports.airdropsOnCreate = airdrops.airdropsOnCreate;
//# sourceMappingURL=index.js.map