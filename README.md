# Backbone Unclassified

Declarative child elements for Backbone Views.

## Why?

Backbone doesn't come with a way of managing a View's child elements. If you want to use all of Backbone's great features, like its event declaration syntax, you either have to write selectors multiple times or save the selectors elsewhere for later use. Or your can forgo using Backbone's niceties altogether and do everything the hard way (manually). But where's the fun in that?

## How do I use it?

Once you've included `backbone.unclassified.js` on your page, you can use Backbone Unclassified by specifying a collection of child elements inside a view:

```javascript
var YourView = Backbone.View.extend({
    el: "ui#your-element-id",

    ui: {
        title: "header > h2",
        people: "li.person",
        odd: "li:nth-child(odd)",
        even: "li:nth-child(even)",
        admins: "li.person[data-role=admin]",
        addButton: ".btn.add",
        deleteButton: ".btn.delete"
    },

    // You can use your child element names in place of selectors here.
    events: {
        "click odd": "oddClick",
        "click even": "evenClick"
    },

    initialize: function() {
        // You can use your child elements programmatically as early as in
        // your initialize method.
        this.ui.title.text("People (" + this.ui.people.length + ")");
    }
});
```

Refer to `example/example.js` for a complete working example.

## License

MIT licensed. See `LICENSE.txt` for the full text.
