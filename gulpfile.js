var gulp = require('gulp'),
	gutil = require('gulp-util'),
	compass = require('gulp-compass'),
	minifyCSS = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	connect = require('gulp-connect'),
	imagemin = require('gulp-imagemin'),
	pngcrush = require('imagemin-pngcrush'),
	gulpif = require('gulp-if'),
	//isotope = require('isotope-layout'),
	//masonry = require('masonry-layout'),
	minifyHTML = require('gulp-minify-html'),
	browserify = require('gulp-browserify'),
	del = require('del');

var env,
	htmlSources,
	jsSources,
	sassSources,
	cssSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
	outputDir = 'builds/development/';
} else {
	outputDir = 'builds/production/';
}

htmlSources = ['sources/html/*.html'];
cssSources = ['sources/css/*.css'];
imageSources = ['sources/images/**/*.*'];
jsSources = ['sources/js/jquery-1.9.1.js',
			 'sources/js/jquery-migrate-1.2.1.js',
			 // 'sources/js/jquery-migrate-1.4.1.min.js',
			 'sources/js/html5shiv.js',
			 'sources/js/jquery.equalheights.js',
			 'sources/js/camera.js',
			 //'sources/js/isotope-docs.min.js',
			 //'sources/js/isotope.pkgd.min.js',
			 //'sources/js/masonry.pkgd.js',
			 'sources/js/jquery.tabs.js',
			 'sources/js/touchTouch.jquery.js',
			 'sources/js/greensock/TweenMax.min.js',
			 'sources/js/jquery.cookie.js',
			 'sources/js/device.min.js',
			 'sources/js/tmstickup.js',
			 'sources/js/jquery.easing.1.3.js',
			 'sources/js/jquery.ui.totop.js',
			 'sources/js/jquery.mousewheel.min.js',
			 'sources/js/jquery.simplr.smoothscroll.min.js',
			 'sources/js/jquery.superscrollorama.js',
			 'sources/js/superfish.js',
			 'sources/js/jquery.mobilemenu.js',
			 'sources/js/TMForm.js',
			 'sources/js/modal.js',
			 'sources/js/script.js'
			 
			];
tempJsDir = 'sources/js/temp';		
jsSources2 = ['sources/js/isotope.pkgd.min.js'];


gulp.task('clean', function(){
	del([outputDir + '*']);
});

gulp.task('html', function(){
	gulp.src(htmlSources)
	.pipe(gulpif(env==='production', minifyHTML({
		conditionals: true,
		spare: true
	})))
	.pipe(gulp.dest(outputDir))
	.pipe(connect.reload())
});

gulp.task('css', function(){
	gulp.src(cssSources)
	.pipe(concat('style.css'))
	.pipe(gulpif(env==='production', minifyCSS()))
	.pipe(gulp.dest(outputDir + 'css'))
	.pipe(connect.reload())
});

gulp.task('images', function(){
	gulp.src(imageSources)
	.pipe(gulpif(env==='production', imagemin({
		progressive: true,
		svgoPlugins: [{ removeViewBox: false }],
		use: [pngcrush()]
	})))
	.pipe(gulp.dest(outputDir + 'images'))
	.pipe(connect.reload())
});

gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	//.pipe(gulp.src(['sources/js/scripts.js', 'sources/js/isotope.pkgd.min.js']))
	//.pipe(concat('final.js'))
	.pipe(gulpif(env==='production', uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
	.pipe(connect.reload())
});
gulp.task('js2', function(){
	gulp.src(jsSources2)
	.pipe(concat('filtering.js'))
	// .pipe(browserify({
 //            ignore: ['isotope.pkgd.min']
 //        }))
	.pipe(gulpif(env==='production', uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
	.pipe(connect.reload())
});

gulp.task('connect', function(){
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('watch', function(){
	gulp.watch(htmlSources, ['html']);
	gulp.watch(cssSources, ['css']);
	gulp.watch(jsSources, ['js']);
	gulp.watch(jsSources2, ['js2']);
	gulp.watch(imageSources, ['images']);
});

gulp.task('default', ['html', 'images', 'js', 'js2', 'connect', 'watch', 'css']);