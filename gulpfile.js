var gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    rm = require('gulp-rimraf');

gulp.task('clean', function() {
  return gulp.src('dist/*').pipe(rm());
});

gulp.task('devServer', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('combineTemplates', function() {
  gulp.src('js/**/*.html')
    .pipe(concat('allTemplates.html'))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('combineScripts', function() {
  gulp.src('js/**/*.js')
    .pipe(concat('allScripts.js'))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('buildIndex', function() {
  gulp.src(['partials/top.html', 'dist/allTemplates.html', 'partials/tail.html'])
    .pipe(concat('index.html'))
    .pipe(gulp.dest('./'))
});

gulp.task('default', ['clean', 'devServer', 'combineTemplates', 'combineScripts', 'buildIndex'], function() {
  gulp.watch(['js/**/*.js', 'js/**/*.html', 'css/**/*.css'], ['clean', 'combineScripts', 'combineTemplates', 'buildIndex'], function(files) {
    livereload.changed(files)
  });
});