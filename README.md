# Backbone Unclassified

Declarative child elements for Backbone Views.

## Why?

Backbone doesn't come with a way of managing a View's child elements. If you want to use all of Backbone's great features, like its event declaration syntax, you either have to write selectors multiple times or save the selectors elsewhere for later use. Or you can forgo using Backbone's niceties altogether and do everything the hard way (manually). But where's the fun in that?

## Selector engines

Backbone Unclassified supports:

* [jQuery](http://jquery.com/)
* [Zepto](http://zeptojs.com/)
* [Sizzle](http://sizzlejs.com/)
* [Dojo](http://dojotoolkit.org/)
* [Qwery](https://github.com/ded/qwery)
* [Ender](http://ender.jit.su/)
* [Bonzo](https://github.com/ded/bonzo)
* [Traversty](https://github.com/rvagg/traversty)
* [Zest](https://github.com/chjj/zest)
* [Sel](https://github.com/amccollum/sel)

## Installation

All you need for Backbone Unclassified is `backbone.unclassified.js`. You can install it manually or use one of the following package managers.

**Bower**

```shell
$ bower install backbone.unclassified
```

**JamJS**

```shell
$ jam install backbone.unclassified
```

## Include

Backbone Unclassified depends on Backbone and whatever selector library you're using for it, which you'll already have installed.

```html
<!-- Backbone stuff -->
<script src="/path/to/your-favorite-selector-library.js"></script>
<script src="/path/to/backbone.js"></script>

<!-- Backbone Unclassified -->
<script src="/path/to/backbone.unclassified.js"></script>
```

## How do I use it?

Once you've included `backbone.unclassified.js` on your page, you can use Backbone Unclassified by specifying a collection of child elements inside a view:

```javascript
var YourView = Backbone.View.extend({
    el: "#your-element-id",

    // The selectors here will be used to create references to your child
    // elements when your view is instantiated and when your view's main
    // element changes. Notice, also, that this set of child elements can
    // be hierarchical. You can access this.ui.button.add in code, and
    // button.add in your `events` specification.
    ui: {
        title: "header > h2",
        list: "ul, ol",
        people: "li.person",
        odd: "li:nth-child(odd)",
        even: "li:nth-child(even)",
        admins: "li.person[data-role=admin]",
        button: {
            add: ".btn.add",
            remove: ".btn.delete",
            secret: "button[data-contains-secrets]"
        }
    },

    // You can use your child element names in place of selectors here.
    events: {
        "click button.add": "add",
        "click button.remove": "remove",
        "click button.secret": "abort",
        "click people": "select",
        "mouseenter list": "over",
        "mouseleave list": "out"
    },

    initialize: function() {
        // You can use your child elements programmatically as early as in
        // your initialize method.
        this.ui.title.text("People (" + this.ui.people.length + ")");
        this.ui.button.secret.hide();
    },

    add: function () { ... },
    remove: function () { ... },
    select: function () { ... },
    abort: function() { ... },
    over: function () { ... },
    out: function () { ... }
});
```

Refer to `example/example.js` for a complete working example.

## Caveats

**Dynamically created elements**

Elements that are created after your view is initialzed won't be included in the query results (your `this.ui.whatever` objects), because jQuery objects don't update automatically. Because of this, Backbone Unclassified provides a simple way of refreshing queries.

To refresh all queries (usually at the end of your `render` method):

```javascript
var YourView = Backbone.View.extend({
    // ...

    render: function() {
        // ...
        this.refreshUi();
    }

    // ...
});
```

To refresh a sub-object of queries:

```javascript
this.refreshUi(this.ui.button); // An object containing multiple queries.
```

To refresh a single query:

```javascript
this.ui.admins.refresh();
```

Refreshes happen in-place, meaning they modify the query object itself (as opposed to returning a new object). `refresh()` also returns the object, so you can chain methods as normal:

```javascript
this.ui.title.refresh().text("Hello, Backbone Unclassified");
```

Refer to `ListView.render` in `examples/collection/example.js` for an example of how this is used in practice.

## License

MIT licensed. See `LICENSE.txt` for the full details.
