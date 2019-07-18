var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var minify = require("gulp-csso");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var	uglify = require("gulp-uglify-es").default;
var	concat = require("gulp-concat");
var imagemin = require("gulp-imagemin");
var imgCompress  = require("imagemin-jpeg-recompress");
var sprite = require("gulp-svg-sprite");
var cheerio = require("gulp-cheerio");

function serve (done) {
	browserSync.init({
		server: {
			baseDir: "./build"
		}
	});
	gulp.watch("sass/**/*", styles);
	gulp.watch(["libs/**/*.js", "js/common.js"], scripts).on("change", browserSync.reload);
	gulp.watch("*.html", html).on("change", browserSync.reload);
	done();
}

function styles (done) {
	gulp.src("sass/style.sass")
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer({
      overrideBrowserslist: ["last 2 versions"],
      cascade: false
    }))
		.pipe(gulp.dest("build/css"))
		.pipe(minify())
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest("build/css"))
		.pipe(browserSync.stream());
		done();
}

function scripts (done) {
	gulp.src([
		"libs/jquery/jquery.min.js",
		"libs/jQuery.mmenu/dist/mmenu.js",
		"libs/OwlCarousel2-2.3.4/dist/owl.carousel.min.js",
		"libs/equalHeights/equalheights.js",
		"libs/fotorama/fotorama.js",
		"libs/selectize/js/standalone/selectize.min.js",
		"libs/wow/wow.min.js",
		"js/common.js" // Всегда в конце
		])
	.pipe(concat("scripts.min.js"))
	.pipe(uglify({
		toplevel: true
	}))
	.pipe(gulp.dest("js"))
	.pipe(gulp.dest("build/js"));
	done();
}

function html (done) {
  gulp.src("*.html")
		.pipe(gulp.dest("build"));
	done();
}

function copy (done) {
  gulp.src([
    	"fonts/**",
			"img/**"
  ],	{ base: "."})
	.pipe(gulp.dest("build"))
	gulp.src([
		"libs/normalize/normalize.css"
	])
	.pipe(gulp.dest("build/css"));
	done();
}

function imgOptimize (done) {
  gulp.src('non_optimized_images/**/*')
  .pipe(imagemin([
    imgCompress({
      loops: 4,
      min: 70,
      max: 80,
      quality: 'high'
    }),
    imagemin.gifsicle(),
    imagemin.optipng(),
    imagemin.svgo()
  ]))
	.pipe(gulp.dest('img'));
	done();
}

function svgsprite (done) {
	gulp.src('img/sprite/*.svg')
		.pipe(cheerio({ // удалить все атрибуты fill, style and stroke в фигурах
			run: function($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
				done();
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(sprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'  //sprite file name (https://habr.com/ru/sandbox/125438/)
				}
			},
		}))
		.pipe(gulp.dest('img'));
	done();
}

gulp.task('optimize', imgOptimize); // Оптимизация графики
gulp.task('sprite', svgsprite); // Объединение иконочных спрайтов в один svg-файл
gulp.task('copy', copy); // Копирование в папку build папок fonts, img и html-файлы
gulp.task('default', gulp.series(html, scripts, styles, serve)); // Запуск сборки
