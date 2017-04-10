var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var reload = browserSync.reload;

// 静态服务器 + 监听 scss/html文件
gulp.task('serve', ['sass'], function () {

  browserSync.init({
    server: './'
  });

  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('*.html').on('change', reload);
});

// scss编译后的css将注入到浏览器里实现更新
gulp.task('sass', function () {
  return gulp.src('./scss/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('default', ['serve']);