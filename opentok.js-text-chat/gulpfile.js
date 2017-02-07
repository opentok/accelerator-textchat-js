var gulp = require('gulp');
var concat = require('gulp-concat');
var importCss = require('gulp-import-css');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var merge = require('merge-stream');


gulp.task('js', function () {
  var accPack = gulp.src([
    'src/opentok-solutions-logging.js',
    'src/opentok-one-to-one-communication.js',
    'src/opentok-text-chat.js'
  ])
  .pipe(concat('text-chat-acc-pack.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist'));

  var npm = gulp.src('src/opentok-text-chat.js')
  .pipe(gulp.dest('dist'));

  var min = gulp.src('dist/opentok-text-chat.js')
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest('dist'));

  return merge(accPack, npm, min);
});

gulp.task('js-dev', function () {
  return gulp.src([
    'src/opentok-solutions-logging.js',
    'src/opentok-one-to-one-communication.js',
    'src/opentok-text-chat.js'
  ])
  .pipe(concat('text-chat-acc-pack.js'))
  .pipe(gulp.dest('dist'));
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
      'dist/text-chat-acc-pack.js'
    ])
  .pipe(zip('opentok-js-text-chat-acc-pack-1.0.0.zip'))
  .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['js', 'css', 'zip']);
