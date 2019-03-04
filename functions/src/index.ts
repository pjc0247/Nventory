import * as functions from 'firebase-functions';
import { fstore } from './shared';
import { resolveTxt } from 'dns';
import { unixtime } from './unixtime';

let fs = fstore();

function getItemsRef(uid) {
    let inventory = fs.collection('inventory')
        .doc(uid);
    let items = inventory
        .collection('items');
    return items;
}
function getItemRef(uid, key) {
    let item = getItemsRef(uid)
        .doc(key);
    return item;
}

function refineInput(data) {
    if (data.quantity == undefined)
        data.quantity = 1;

    if (data.expiry == undefined)
        data.item.expires_at = Number.MAX_SAFE_INTEGER;
    else 
        data.item.expires_at = unixtime() + data.expiry;
}

export const addItem = functions.https.onCall(async (data, ctx) => {
    let item = getItemRef(ctx.auth.uid, data.key);

    refineInput(data);

    await fs.runTransaction(async (tx) => {
        let old = await tx.get(item);
        if (old.exists == false)
            tx.set(item, data.item);
        else if (old.data().expires_at < unixtime())
            tx.set(item, data.item);
        else {
            tx.update(item, {
                expires_at: data.item.expires_at,
                quantity: old.data().quantity + data.quantity
            });
        }
    });

    return {
        item: (await item.get()).data()
    };
});
export const consumeItem = functions.https.onCall(async (data, ctx) => {
    let item = getItemRef(ctx.auth.uid, data.key);
    let error = false;

    await fs.runTransaction(async (tx) => {
        let old = await tx.get(item);
        if (old.exists == false)
            error = true;
        else if (old.data().quantity < data.quantity)
            error = true;
        else if (old.data().expires_at < unixtime())
            error = true;
        else {
            let after = old.data().quantity - data.quantity;

            if (after == 0)
                tx.delete(item);
            else
                tx.update(item, { quantity: after });
        }
    });

    if (error) {
        return {
            success: false,
            message: 'not enough items'
        };
    }
    return {
        item: (await item.get()).data()
    };
});
export const updateItem = functions.https.onCall(async (data, ctx) => {
    let item = getItemRef(ctx.auth.uid, data.key);

    refineInput(data);

    await item.set(data.item);

    return {
        item: data.item
    };
});
export const deleteItem = functions.https.onCall(async (data, ctx) => {
    let item = getItemRef(ctx.auth.uid, data.key);

    await item.delete();

    return {
        item: data.item
    };
});
export const getItem = functions.https.onCall(async (data, ctx) => {
    let item = await getItemRef(ctx.auth.uid, data.key).get();

    if (item.exists == false ||
        item.data().expires_at < unixtime()) {

        return {
            item: null
        };
    }
    return {
        item: item.data()
    }
});
export const getAllItems = functions.https.onCall(async (data, ctx) => {
    let items = await getItemsRef(ctx.auth.uid).get();

    return {
        items: items.docs
            .map((x) => x.data())
            .filter((x) => x.expires_at > unixtime())
    };
});