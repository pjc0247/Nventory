import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
let db = admin.database();
let store = admin.firestore();

export function fdb() {
    return db;
}
export function fstore() {
    return store;
}