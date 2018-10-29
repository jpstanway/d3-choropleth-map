const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');

gulp.task('sass', function() {
    return gulp.src('app/stylesheets/**/*.scss')
                .pipe(sass())
                .pipe(gulp.dest('app/stylesheets'))
                .pipe(browserSync.reload({
                    stream: true
                }));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('watch', ['sass', 'browserSync'], function() {
    gulp.watch('app/stylesheets/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/scripts/**/*.js', browserSync.reload);
});