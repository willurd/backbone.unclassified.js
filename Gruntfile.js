var fs = require("fs");
var matchdep = require("matchdep");
var parse = require("uglify-js").parse;

module.exports = function(grunt) {
	var main = "backbone.unclassified.js";
	var ast = parse(fs.readFileSync(main).toString());
	var banner = "/*" + ast.start.comments_before[0].value + "*/\n";

	grunt.config.init({
		pkg: grunt.file.readJSON("package.json"),

		app: {
			js: {
				main: "<%= pkg.main %>",
				gruntfile: "Gruntfile.js",
				examples: "examples/!(coffeescript)/**/example.js",
				minified: "<%= pkg.name %>.min.js",
				all: [
					"<%= app.js.main %>",
					"<%= app.js.gruntfile %>",
					"<%= app.js.examples %>"
				]
			},
			banner: banner
		},

		jshint: {
			files: "<%= app.js.all %>"
		},

		uglify: {
			options: {
				banner: "<%= app.banner %>"
			},
			main: {
				files: {
					"<%= app.js.minified %>": "<%= app.js.main %>"
				}
			}
		},

		watch: {
			files: "<%= app.js.all %>",
			tasks: ["lint", "min"]
		}
	});

	// Load the tasks.
	matchdep.filterDev("grunt-*").map(grunt.loadNpmTasks);

	// Aliases
	grunt.registerTask("lint", "jshint");
	grunt.registerTask("min", "uglify");

	// Default
	grunt.registerTask("default", "watch");
};
