// Here's an example of Backbone Unclassified in action. Most of
// this is just normal Backbone code.

var FormView = Backbone.View.extend({
	el: "#login-form",

	// This is where you specify UI elements, relative to the main view
	// element. Once the view element has been set, the string selectors
	// will be replaced with jQuery instances (or Zepto, or whatever else
	// you're using).
	ui: {
		items: ".form-item",
		labels: "label",
		inputs: "input",
		username: "input[name=username]",
		password: "input[type=password]",
		remember: "[data-bind=remember]",
		submit: "button[type=submit]",
		button: {
			forgot: {
				username: "[data-action=forgot-username]",
				password: "[data-action=forgot-password]"
			}
		}
	},

	// Now that you've specified child elements in the `ui` object, you
	// can reference them by name in place of selectors in the events
	// object. You can still use selectors here if you really want to (as
	// long as that selector doesn't match one of your child element's
	// names), but that would just be weird...
	events: {
		"submit": "submit",
		"click button.forgot.username": "forgotUsername",
		"click button.forgot.password": "forgotPassword",
		"click labels": "labelClick",
		"change remember": "rememberChange"
	},

	initialize: function() {
		// You can even use your child elements using plain old JavaScript,
		// as early as in your `initialize` function.
		this.ui.username.val("user");
		this.ui.password.val("secret!");
		this.ui.remember.attr("checked", true);
	},

	submit: function(e) {
		e.preventDefault();
	},

	forgotUsername: function() {
		alert("An email with your username has been sent.");
		return false;
	},

	forgotPassword: function() {
		alert("An email with your password in plain text has been sent. Trust us, we're professionals.");
		return false;
	},

	labelClick: function(e) {
		var label = $(e.target);
		var el = this.ui[label.attr("for")];
		el.focus();
	},

	rememberChange: function(e) {
		console.log("remember field changed");
	}
});

var view = new FormView();
