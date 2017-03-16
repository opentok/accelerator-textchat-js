var gulp = require('gulp');
var concat = require('gulp-concat');
var importCss = require('gulp-import-css');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var merge = require('merge-stream');


gulp.task('js', function () {
  var npm = gulp.src('src/opentok-text-chat.js')
  .pipe(gulp.dest('dist'));

  var min = gulp.src('dist/opentok-text-chat.js')
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest('dist'));

  return merge(npm, min);
});


gulp.task('css', function () {
  return gulp.src('css/theme.css')
    .pipe(importCss())
    .pipe(gulp.dest('dist'));
});

gulp.task('zip', function () {
  return gulp.src(
    [
      'dist/theme.css',
      'dist/opentok-text-chat.js'
    ])
  .pipe(zip('opentok-js-text-chat-acc-pack-1.0.0.zip'))
  .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['js', 'css', 'zip']);
