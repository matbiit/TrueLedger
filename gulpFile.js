var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');

// Sass Input and Output locations
var input = 'sass/**/*.scss';
var output = 'public/assets/css';

// Sass Options to log errors to console
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function () {
  return gulp
    // Find all `.scss` files from the `stylesheets/` folder
    .src(input)
    // Run Sass on those files, with options to log errors to console
    .pipe(sass(sassOptions).on('error', sass.logError))
    // Write the resulting CSS in the output folder
    .pipe(gulp.dest(output));
});

// GULP INJECTOR
var publicSrc = [
        					'./public/**/*.js'
        				];

gulp.task('inject', function () {
	var target = gulp.src('./public/index.html');

	var sources = gulp.src(publicSrc, {read: false});

	return target.pipe(inject(sources, { ignorePath: 'public/', addRootSlash: false }))
		.pipe(gulp.dest('./public'));
});

gulp.task('watchSass', function() {
  return gulp
    .watch(input, ['sass'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('watchInject', function() {
  return gulp
    .watch(publicSrc, ['inject'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['sass', 'inject', 'watchSass', 'watchInject']);
