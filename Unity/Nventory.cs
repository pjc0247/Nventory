using System;
using System.Threading.Tasks;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using Firebase.Unity;
using Firebase.Functions;
using Mapster;

public class Nventory
{
    public static uint Hour = 3600;
    public static uint Day = 86400;
    public static uint Week = 604800;
    public static uint Month = 2629743;
    public static uint Year = 31556926;

    private static FirebaseFunctions functions = FirebaseFunctions.DefaultInstance;

    public async static Task AddItem(string key, object item, uint quantity = 1, uint? expiry = null)
    {
        if (string.IsNullOrEmpty(key))
            throw new ArgumentException(nameof(key));

        var data = new Dictionary<string, object>()
        {
            ["key"] = key,
            ["item"] = item,
            ["quantity"] = quantity
        };

        if (expiry.HasValue)
            data.Add("expiry", expiry);

        var resp = await functions
            .GetHttpsCallable("addItem")
            .CallAsync(data);
    }
    public async static Task UpdateItem(string key, object item, uint quantity = 1, uint? expiry = null)
    {
        if (string.IsNullOrEmpty(key))
            throw new ArgumentException(nameof(key));

        var data = new Dictionary<string, object>()
        {
            ["key"] = key,
            ["item"] = item,
            ["quantity"] = quantity
        };

        if (expiry.HasValue)
            data.Add("expiry", expiry);

        var resp = await functions
            .GetHttpsCallable("updateItem")
            .CallAsync(data);
    }
    public async static Task ConsumeItem(string key, uint quantity)
    {
        if (string.IsNullOrEmpty(key))
            throw new ArgumentException(nameof(key));
        if (quantity == 0)
            throw new ArgumentException(nameof(quantity) + ": zero is not allowed");

        var data = new Dictionary<string, object>()
        {
            ["key"] = key,
            ["quantity"] = quantity
        };

        var resp = await functions
            .GetHttpsCallable("consumeItem")
            .CallAsync(data);
    }
    public async static Task<(T item, uint quantity)> GetItem<T>(string key)
    {
        if (string.IsNullOrEmpty(key))
            throw new ArgumentException(nameof(key));

        var data = new Dictionary<string, object>()
        {
            ["key"] = key
        };

        var resp = await functions
            .GetHttpsCallable("getItem")
            .CallAsync(data);

        var _resp = resp.Data.Adapt<NventoryGetItemResponse>();
        var _base = _resp.item.Adapt<NventoryItemBase>();
        return (item: _resp.item.Adapt<T>(), quantity: _base.quantity);
    }
    public async static Task<bool> HasItem(string key)
    {
        if (string.IsNullOrEmpty(key))
            throw new ArgumentException(nameof(key));

        var data = new Dictionary<string, object>()
        {
            ["key"] = key
        };

        var resp = await functions
            .GetHttpsCallable("getItem")
            .CallAsync(data);

        var _resp = resp.Data.Adapt<NventoryGetItemResponse>();
        if (_resp.item == null || _resp.quantity == 0)
            return false;
        return true;
    }
    public async static Task<object[]> GetAllItems(string key)
    {
        if (string.IsNullOrEmpty(key))
            throw new ArgumentException(nameof(key));

        var data = new Dictionary<string, object>()
        {
            ["key"] = key
        };

        var resp = await functions
            .GetHttpsCallable("getAllItems")
            .CallAsync(data);

        return resp.Data.Adapt<object[]>();
    }
}
