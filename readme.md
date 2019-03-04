Nventory
====
Your serverless inventory that actually works


API
----
__AddItem__
```cs
await Nventory.AddItem("legendary-sword", new {
    Attack = 10,
    Speed = 5
});
```

__Unique item and Consumables__<br>
Since we have generalized the interfaces to fit most of games, there're no __unique items__ in __Nventory__.<br>
Every item has its quantity and can be counted more than 2.<br>
We don't have native support for it, you should implement your own stuffs.<br>
Good news, it's pretty simple.

__Unique equipments__<br>
Think about equipments, they cannot be stacked in most cases even if they have excatly same options.<br>
`GUID` would be the best practice for this case.<br>
Even if you add 2 swords, they never be stacked.
```cs
var key = $"sword.{(new Guid()).ToString()}";

await Nventory.AddItem(key, sword);
```

__Consumables with variants__<br>
In some cases, consumables also have options.<br>
Please see example below:
```json
{
    "grade": "good",
    "heal" : 10
},
{
    "grade": "poor",
    "heal" : 5
}
```
These items can be stacked with same options. <br>
You may carry 2 __good__ bananas, 3 __poor__ bananas and so on.<br>
<br>
In this case, just use `GetHashCode` method.

```cs
var key = $"banana.{banana.GetHashCode()}";

await Nventory.AddItem(key, banana);
```

__UpdateItem__<br>
Creates or Replaces item with given data.<br>
(Always overwrites the item include `quantity`.)

```cs
await Nventory.UpdateItem("banana", banana);
```

__ConsumeItem__

```cs
await Nventory.ConsumeItem("banana", 1);
```

__GetItem__

```cs
await Nventory.GetItem("banana");
```
```cs
await Nventory.GetAllItems();
```


Subscription with Nventory
----
You can implement period-specific items in few lines.

```cs
// Add subscription
await Nventory.AddItem(
    "one-year-premium",
    new {},
    Nventory.OneYear);
```

```cs
// Check premium status
var item = await Nventory.GetItem("one-year-premium");
if (item == null)   
    Console.WriteLine("Your are not a premium member");
else
    Console.WriteLine("Welcome customer!");
```
