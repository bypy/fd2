var gulp = require("gulp"),
	browserSync = require("browser-sync").create();

var source = "44 TENNIS DOM/";

gulp.task("html", function() {
	browserSync.reload();
});

gulp.task("js", function() {
	browserSync.reload();
});

gulp.task("css", function() {
	browserSync.reload();
});

gulp.task("watch", function() {
	gulp.watch(source + "*.js", ["js"]);
	gulp.watch(source + "*.html", ["html"]);
	gulp.watch(source + "*.css", ["css"]);
});

// Static server
gulp.task("browser-sync", function() {
	browserSync.init({
		server: {
			baseDir: source
		},
		notify: true
	});
});

gulp.task("default", ["browser-sync","watch"]);

