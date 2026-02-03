const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const del = require('del');
const replace = require('gulp-replace');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const { exec } = require('child_process');

// Пути
const paths = {
  styles: {
    src: 'src/sass/**/*.scss',
    main: 'src/sass/main.scss',
    dest: 'dist/css'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js'
  },
  images: {
    src: 'src/img/**/*.{jpg,jpeg,png,gif,webp}',
    dest: 'dist/img'
  },
  svg: {
    src: 'src/svg/**/*.svg',
    dest: 'dist/img'
  },
  html: {
    src: '*.html',
    dest: 'dist'
  },
  fonts: {
    src: 'src/fonts/**/*.{ttf,woff,woff2,eot,otf}',
    dest: 'dist/fonts'
  }
};

// Очистка dist
function clean() {
  return del(['dist']);
}

// SCSS -> CSS с автопрефиксами и минификацией
function styles() {
  return gulp.src(paths.styles.main)
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: ['src/sass', 'node_modules'],
      silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'if-function']
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(cleanCSS())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// JS - объединение и минификация
function scripts() {
  return gulp.src([
    'src/js/main.js'
  ])
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(terser())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Vendor JS (jQuery, Bootstrap, Owl Carousel и другие библиотеки)
function vendorJs() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/owl.carousel/dist/owl.carousel.min.js'
  ], { encoding: false })
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Vendor CSS (Owl Carousel и другие библиотеки)
function vendorCss() {
  return gulp.src([
    'node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
    'node_modules/owl.carousel/dist/assets/owl.theme.default.min.css'
  ])
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest(paths.styles.dest));
}

// Копирование изображений
function images() {
  return gulp.src(paths.images.src, { encoding: false })
    .pipe(gulp.dest(paths.images.dest));
}

// SVG спрайт
function svg() {
  return gulp.src(paths.svg.src)
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg',
          example: false
        }
      },
      shape: {
        transform: [
          {
            svgo: {
              plugins: [
                { name: 'removeViewBox', active: false },
                { name: 'removeDimensions', active: true }
              ]
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(paths.svg.dest));
}

// Копирование HTML с заменой путей
function html() {
  return gulp.src(paths.html.src)
    .pipe(replace('./src/img/', './img/'))
    .pipe(replace('./src/svg/', './img/'))
    .pipe(replace('./src/fonts/', './fonts/'))
    .pipe(replace('./src/js/', './js/'))
    .pipe(replace('./src/sass/', './css/'))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Копирование шрифтов
function fonts() {
  return gulp.src(paths.fonts.src, { encoding: false })
    .pipe(gulp.dest(paths.fonts.dest));
}

// Тесты JS (Jest)
function testJs(done) {
  exec('npm run test:js', (err, stdout, stderr) => {
    console.log(stdout);
    if (stderr) console.error(stderr);
    done();
  });
}

// Тесты HTML (html-validate)
function testHtml(done) {
  exec('npm run test:html', (err, stdout, stderr) => {
    console.log(stdout);
    if (stderr) console.error(stderr);
    done();
  });
}

// Тесты CSS (stylelint)
function testCss(done) {
  exec('npm run test:css', (err, stdout, stderr) => {
    console.log(stdout);
    if (stderr) console.error(stderr);
    done();
  });
}

// Все тесты
const test = gulp.parallel(testJs, testHtml, testCss);

// Локальный сервер
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    notify: false,
    open: true
  });

  gulp.watch(paths.styles.src, gulp.series(styles, testCss));
  gulp.watch(paths.scripts.src, gulp.series(scripts, testJs));
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.svg.src, svg);
  gulp.watch(paths.html.src, gulp.series(html, testHtml));
  gulp.watch('tests/**/*.test.js', testJs);
}

// Сборка без сервера
const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, vendorJs, vendorCss, images, svg, html, fonts)
);

// Разработка с сервером
const dev = gulp.series(
  clean,
  gulp.parallel(styles, scripts, vendorJs, vendorCss, images, svg, html, fonts),
  serve
);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.vendorJs = vendorJs;
exports.vendorCss = vendorCss;
exports.images = images;
exports.svg = svg;
exports.html = html;
exports.test = test;
exports.testJs = testJs;
exports.testHtml = testHtml;
exports.testCss = testCss;
exports.build = build;
exports.default = dev;
