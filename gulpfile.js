var gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    rm = require('gulp-rimraf');

gulp.task('clean', function() {
  return gulp.src('frontend/dist/*').pipe(rm());
});

gulp.task('devServer', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('combineTemplates', function() {
  gulp.src('frontend/js/**/*.html')
    .pipe(concat('allTemplates.html'))
    .pipe(gulp.dest('./frontend/dist/'))
});

gulp.task('combineScripts', function() {
  gulp.src('frontend/js/**/*.js')
    .pipe(concat('allScripts.js'))
    .pipe(gulp.dest('./frontend/dist/'))
});

gulp.task('buildIndex', function() {
  gulp.src(['frontend/partials/top.html', 'frontend/dist/allTemplates.html', 'frontend/partials/tail.html'])
    .pipe(concat('frontend/index.html'))
    .pipe(gulp.dest('./'))
});

gulp.task('default', ['clean', 'devServer', 'combineTemplates', 'combineScripts', 'buildIndex'], function() {
  gulp.watch(['frontend/js/**/*.js', 'frontend/js/**/*.html', 'frontend/css/**/*.css'], ['clean', 'combineScripts', 'combineTemplates', 'buildIndex'], function(files) {
    livereload.changed(files)
  });
});