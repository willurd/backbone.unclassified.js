// This is the code that makes the `ui` attribute work. It patches
// a few Backbone View functions so it can perform pattern matching
// for events and grab your ui elements when the main element is changed.

(function() {
	if (typeof Backbone === "undefined") {
		return console.error("backbone.unclassified must be included after backbone");
	}

	/**
	 * A value no one else can use. Used to check whether we're dealing with
	 * values that belong to Backbone Unclassified.
	 */
	var internal = {};

	/**
	 * Allows you to wrap or replace ("monkey-patch") methods on existing objects.
	 */
	function patch(obj, fn, creator) {
		obj[fn] = creator(obj[fn]) || obj[fn];
	}

	/**
	 * Iterates over `obj` and returns a new object with whatever you put in
	 * it. You can either return values from `fn`, in which case the new object
	 * will have the same keys, or you can use the third argument to `fn`, `map`
	 * (which is the return object), and put your new values in whatever keys
	 * you want.
	 */
	function mapObject(obj, fn, context) {
		var map = {};

		for (var key in obj) {
			var value = fn.call(context || this, key, obj[key], map);
			if (typeof value !== "undefined") map[key] = value;
		}

		return map;
	}

	/**
	 * Performs the query on the given selector. Adds a utility function for
	 * refreshing the query in place.
	 */
	function get(el, spec) {
		var result = el.find(spec);

		result.refresh = function() {
			this.splice(0, this.length);
			this.push.apply(this, el.find(spec));
			return this;
		};

		result.refresh.unclassified = internal;

		return result;
	}

	/**
	 * Converts a hierarchical collection of name -> selector into a collection
	 * of name -> element.
	 */
	function processUiSpec(el, map, spec, path) {
		if (!spec) return undefined;
		if (typeof spec === "string") return get(el, map[path] = spec);

		return mapObject(spec, function(key, value) {
			var dotpath = path ? (path + "." + key) : key;
			return processUiSpec(el, map, spec[key], dotpath);
		});
	}

	/**
	 * Wraps `Backbone.View.prototype.setElement` to convert your ui spec into
	 * a collection of named elements.
	 */
	patch(Backbone.View.prototype, "setElement", function(old) {
		return function() {
			var ret = old.apply(this, arguments);
			this._uiSelectorMap = {};
			this.ui = processUiSpec(this.$el, this._uiSelectorMap, this.constructor.prototype.ui);
			return ret;
		};
	});

	/**
	 * Wraps `Backbone.View.prototype.delegateEvents` to allow you to use your
	 * ui names in place of selectors in `events` objects.
	 */
	patch(Backbone.View.prototype, "delegateEvents", function(old) {
		var delegateEventSplitter = /^(\S+)\s*(.*)$/;

		return function(events) {
			if (!(events || (events = _.result(this, 'events')))) return this;

			return old.call(this, mapObject(events, function(key, method, map) {
				var match = key.match(delegateEventSplitter);
				var eventName = match[1];
				var selector = match[2];
				var newSelector = (selector ? (" " + (this._uiSelectorMap[selector] || selector)) : "");

				map[eventName + newSelector] = method;
			}, this));
		};
	});

	/**
	 * Refreshes the given UI hierarchy in one go. If no argument is given, `this.ui`
	 * is used, which will refresh all child elements in the view.
	 */
	Backbone.View.prototype.refreshUi = function(ui) {
		ui = ui || this.ui;

		for (var key in ui) {
			if (ui.hasOwnProperty(key)) {
				var value = ui[key];

				if (typeof value.refresh === "function" && value.refresh.unclassified === internal) {
					value.refresh();
				} else {
					this.refreshUi(value);
				}
			}
		}
	};
}());
