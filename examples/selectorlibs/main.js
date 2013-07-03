var libs = [
	"ender",
	"jQuery",
	"traversty",
	"Zepto"
];

var $creators = {

};

var Test = Backbone.Model.extend({
	defaults: {
		name: "unknown"
	}
});

var Tests = Backbone.Collection.extend({
	model: Test
});

var TestGrid = Backbone.View.extend({
	el: "#table",
	ui: {
		tbody: "tbody"
	},

	render: function() {
		this.ui.tbody.empty();
		this.collection.models.forEach(function(test) {
			var view;

			try {
				var lib = test.get("name");
				Backbone.$ = (lib in $creators) ? $creators[lib]() : window[lib];
				view = this.createTestView(test);
				Backbone.$ = jQuery;
			} catch (e) {
				Backbone.$ = jQuery;
				test.set("error", "Error: " + e);
				view = this.createTestView(test);
			}

			if (view) {
				this.ui.tbody.append(view.render().el);
			}
		}, this);
		return this;
	},

	createTestView: function(test) {
		var TestRow = Backbone.View.extend({
			el: document.createElement("tr"),
			template: _.template('<td class="name"></td><td class="does-it-work">no :(</td>'),
			ui: {
				name: ".name",
				doesItWork: ".does-it-work"
			},

			render: function() {
				this.el.innerHTML = this.template();
				this.refreshUi();
				this.ui.name[0].innerText = this.model.get("name");
				this.ui.doesItWork[0].innerText = this.model.get("error") || "yes!";
				return this;
			}
		});

		return new TestRow({ model: test });
	}
});

var tests = new Tests(libs.map(function(lib) {
	return {
		name: lib
	};
}));

var grid = new TestGrid({ collection: tests });
grid.render();
