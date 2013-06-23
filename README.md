# Backbone Unclassified

Declarative child elements for Backbone Views.

## Why?

Backbone doesn't come with a way of managing a View's child elements. If you want to use all of Backbone's great features, like its event declaration syntax, you either have to write selectors multiple times or save the selectors elsewhere for later use. Or your can forgo using Backbone's niceties altogether and do everything the hard way (manually). But where's the fun in that?

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
    over: function () { ... },
    out: function () { ... },
});
```

Refer to `example/example.js` for a complete working example.

## License

MIT licensed. See `LICENSE.txt` for the full text.
