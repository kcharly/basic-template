//////////////////////////////////////////////////////// Configuration variables

var config = {
    buildFilesFoldersRemove: [
        'build/assets/bower_components',
        'build/assets/design',
        'build/assets/templates',
        'build/assets/css/1-tools',
        'build/assets/css/2-base',
        'build/assets/css/3-modules',
        'build/assets/css/4-layouts',
        'build/assets/css/!(*.css)',
        'build/assets/js/!(*.min.js)'
    ],
    jsFiles: [
        'app/assets/bower_components/jquery/dist/jquery.js',
        'app/assets/js/**/*.js',
        '!app/assets/js/**/main.+(js|min.js)'
    ]
};

/////////////////////////////////////////////////////////////// Required Modules

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jade = require('gulp-jade');

/////////////// Log Errors - simple function to remplace the use of gulp-plumber

function errorLog(err) {
    console.log(err.message);
    this.emit('end');
}

////////////////////////////////////////////////////////////////// General Tasks

// Concat and Compress Javascript files
gulp.task('scripts', function() {
    return gulp.src(config.jsFiles)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .on('error', errorLog)
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(reload({stream:true}));
});

// Compile Sass into Css
gulp.task('sass', function() {
    return gulp.src('app/assets/css/main.sass')
    .pipe(sass({outputStyle: 'compressed'}))
    .on('error', errorLog)
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(reload({stream:true}));
});

// Jade task
gulp.task('jade', function() {
    return gulp.src('app/assets/templates/*.jade')
    .pipe(jade())
    .on('error', errorLog)
    .pipe(gulp.dest('app'));
});

// Html task
gulp.task('html', function() {
    return gulp.src('app/*.html')
    .pipe(reload({stream:true}));
});

////////////////////////////////////////////////////////// Syncronisations Tasks

//Sync the browser during development
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});

///////////////////////////////////////////////////////////////////// Build task

// Clean Build directory if it exists
gulp.task('build:clean', function() {
    del([
        'build/**'
    ]);
});

// Create Build directory
gulp.task('build:copy', function() {
    return gulp.src('app/**/*')
    .pipe(gulp.dest('build/'));
});

// Remove unwanted build files
gulp.task('build:remove', ['build:copy'], function(cb) {
    del(config.buildFilesFoldersRemove, cb);
});

// Build
gulp.task('build', ['build:copy', 'build:remove']);

// Show Build Version in browser
gulp.task('build:serve', function() {
    browserSync({
        server: {
            baseDir: 'build'
        }
    });
});

///////////////////////////////////////////////////////////////////// Watch task

gulp.task('watch', function() {
    gulp.watch('app/assets/js/function.js', ['scripts']);
    gulp.watch('app/assets/css/**/*.+(sass|scss)', ['sass']);
    gulp.watch('app/assets/templates/**/*.jade', ['jade']);
    gulp.watch('app/*.html', ['html']);
});

/////////////////////////////////////////////////////////////////// Default task

gulp.task('default', ['scripts', 'sass', 'jade', 'html', 'browserSync', 'watch']);
