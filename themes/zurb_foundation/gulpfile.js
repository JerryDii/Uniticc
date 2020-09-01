var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var gutil = require('gulp-util');

var sassPaths = [
  'node_modules/foundation-sites/scss',
  'node_modules/motion-ui/src'
];

gulp.task('sass', function() {
  return gulp.src('scss/zurb_foundation.scss')
    .pipe($.sass({
      includePaths: sassPaths
    })
    .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('copy', function() {
  gulp.src('node_modules/foundation-sites/dist/css/*.css')
    .pipe($.copy('css', {prefix: 4}));
  gulp.src('node_modules/foundation-sites/dist/js/*.js')
    .pipe($.copy('js', {prefix: 4}));
  gulp.src('node_modules/motion-ui/dist/*.css')
    .pipe($.copy('css', {prefix: 3}));
  gulp.src('node_modules/motion-ui/dist/*.js')
    .pipe($.copy('js', {prefix: 3}));
  var activity = "Stylesheets and scripts from /node_modules/foundation-sites/dist and";
  activity += " node_modules/motion-ui/dist copied to /css and /js.";
  gutil.log(activity);
});

gulp.task('default', ['sass', 'copy'], function() {
  gutil.log('watching for .scss file changes in /scss.');
  gulp.watch(['scss/**/*.scss'], ['sass']);
});
