function tmpl(id) {
	return _.template($("#" + id).html());
}

var Item = Backbone.Model.extend({
	defaults: {
		quantity: 0
	},

	subtract: function() {
		var quantity = this.get("quantity");

		if (quantity > 0) {
			this.set("quantity", quantity - 1);
		}
	},

	add: function() {
		this.set("quantity", this.get("quantity") + 1);
	}
});

var Items = Backbone.Collection.extend({
	model: Item,

	initialize: function(items, options) {
		this.name = options.name;
	}
});

var ItemView = Backbone.View.extend({
	tagName: "li",
	template: tmpl("item-template"),

	ui: {
		less: ".control.less",
		more: ".control.more"
	},

	events: {
		"click less": "less",
		"click more": "more"
	},

	initialize: function() {
		this.$el.addClass("item");
		this.model.on("change", this.render, this);
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	less: function() {
		this.model.subtract();
		return false;
	},

	more: function() {
		this.model.add();
		return false;
	}
});

var ListView = Backbone.View.extend({
	template: tmpl("list-template"),

	ui: {
		list: "ul",
		items: "ul li.item"
	},

	events: {
		"click items": "select"
	},

	initialize: function(options) {
		this.$el.addClass("list");
	},

	render: function() {
		this.$el.html(this.template({
			name: this.collection.name
		}));

		this.ui.list.refresh();

		_.each(this.collection.models, function(item) {
			var item = new ItemView({
				model: item
			});
			this.ui.list.append(item.render().el);
		}, this);

		// Because the .item elements didn't exist when the list was initialized,
		// the collection needs to be refreshed. `this.ui.yourItem.refresh()` is
		// a simple operation that simply performs the dom query again.
		this.refreshUi();

		return this;
	},

	select: function(e) {
		var item = $(e.currentTarget);

		this.ui.items.removeClass("selected");
		item.addClass("selected");
	}
});

var MainView = Backbone.View.extend({
	el: "#main",

	render: function() {
		for (var i = 0; i < 3; i++) {
			var list = new ListView({
				collection: new Items(_.map([1, 2, 3], function(value) {
					return {
						name: "item " + value,
						quantity: Math.round(Math.random() * 5)
					};
				}), {
					name: "list " + (i + 1)
				})
			});
			this.$el.append(list.render().el);
		}
		return this;
	}
});

var main = new MainView();
main.render();
