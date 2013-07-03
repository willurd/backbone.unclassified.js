var View = Backbone.View.extend({
	el: "#container",
	template: _.template('<div class="label"></div>'),
	ui: {
		label: ".label"
	},

	render: function() {
		this.$el.html(this.template());
		this.refreshUi();
		this.ui.label.text("Works!");
	}
});

var view = new View();
view.render();
