import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase);

import * as airdrops from './airdrops';

export const airdropsOnCreate = airdrops.airdropsOnCreate;

