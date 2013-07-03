var View = Backbone.View.extend({
	el: "#container",
	template: _.template('<div class="label"></div>'),
	ui: {
		label: ".label"
	},

	render: function() {
		this.$el[0].innerHTML = this.template();
		this.refreshUi();
		this.ui.label[0].innerText = "Works!";
	}
});

var view = new View();
view.render();
