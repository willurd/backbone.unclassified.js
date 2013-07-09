/**
 * backbone.unclassified.js v0.1.3 - Declarative child elements for Backbone Views
 * https://github.com/willurd/backbone.unclassified.js
 *
 * Copyright (c) 2013 William Bowers <william.bowers@gmail.com>
 * Released under the MIT license
 * https://github.com/willurd/backbone.unclassified.js/blob/master/LICENSE.txt
 */

(function() {
	if (typeof Backbone === "undefined") {
		return console.error("backbone.unclassified must be included after backbone");
	}

	// We'll need this later.
	var toString = Object.prototype.toString;
	var slice = Array.prototype.slice;
	var isArray = Array.isArray || function(obj) {
		return toString.call(obj) === "[object Array]";
	};

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
	 * Calls `obj[prop]` or returns it, depending on whether it's a function.
	 */
	function result(obj, prop) {
		if (typeof obj[prop] === "function") {
			return obj[prop]();
		} else {
			return obj[prop];
		}
	}

	/**
	 * This beast of a function is responsible for encapsulating the different
	 * ways selector engines perform child selections.
	 */
	function findChildren(context, selector) {
		if (typeof context.find === "function") {
			// jQuery, Zepto.
			return context.find(selector);
		} else if (typeof context.down === "function") {
			// Traversty.
			return context.down(selector);
		} else if (typeof context.query === "function") {
			// Dojo.
			return context.query(selector);
		} else if (Backbone.$.length >= 2) {
			// This selector library takes at least two arguments, maybe they
			// are a selector and context.
			try {
				var result = Backbone.$(selector, context);

				if (result.length > 0) {
					// Qwery.
					return result;
				}
			} catch (e) {
				// Nope.
			}

			// Maybe it takes an html element instead.
			try {
				var children = [];

				for (var i = 0, len = context.length; i < len; i++) {
					children.push.apply(children, Backbone.$(selector, context[i]));
				}

				var result = Backbone.$(children);

				if (isArray(result) && result.length === 0) {
					// Sizzle.
					return children;
				} else {
					// Ender.
					return result;
				}
			} catch (e) {
				// I guess not.
			}
		}

		console.error("Unable to make a child selection with the installed selector engine");
		return [];
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
	function get(el, selector) {
		var result = findChildren(el, selector);

		result.refresh = function() {
			var i;

			// Clearing the current elements in the most cross-library way I can think of.
			for (i = 0, len = this.length; i < len; i++) {
				delete this[i];
			}
			this.length = 0;

			// Add the new elements.
			var children = slice.call(findChildren(el, selector));
			if (typeof this.push === "function") {
				this.push.apply(this, children);
			} else {
				for (i = 0, len = children.length; i < len; i++) {
					this[i] = children[i];
				}
				this.length = children.length;
			}

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
			if (!(events || (events = result(this, 'events')))) return this;

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
