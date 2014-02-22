'use strict';

/* ------------------------------------------------------------- *\
 * Generates the Home of Markus Mårtensson, using handlebars
 * templating for the pages, browerify for the javascript and
 * sass for the css. Minifaction of all file types, excluding
 * only the fonts. Livereload support (needs browser extension).
\* ------------------------------------------------------------- */

var gulp = require('gulp');  

var fs = require('fs')
var frontMatter = require('gulp-front-matter');
var consolidate = require("gulp-consolidate");
var header = require('gulp-header');
var footer = require('gulp-footer');

var browserify = require('gulp-browserify');  
var concat = require('gulp-concat');  
var sass = require('gulp-sass')

var imagemin = require('gulp-imagemin');
var svgmin = require('gulp-svgmin');

var changed = require('gulp-changed');
var rename = require('gulp-rename');

var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');

var refresh = require('gulp-livereload');  
var lr = require('tiny-lr');  
var server = lr();

gulp.task('modernizr', function() {  
    gulp.src('app/components/modernizr/modernizr.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(refresh(server))
})

gulp.task('scripts', [ 'modernizr' ], function() {  
    gulp.src(['app/scripts/*.js'])
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(refresh(server))
})

gulp.task('styles', function() {  
    gulp.src('app/styles/*.scss')
        .pipe(sass())
	.pipe(minifyCss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(refresh(server))
})

gulp.task('bitmaps', function() {
    gulp.src('app/images/**/*.{png,jpg}')
        .pipe(changed('dist/images'))
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist/images'))
        .pipe(refresh(server))
});

gulp.task('vectors', function() {
    gulp.src('app/images/**/*.svg')
        .pipe(changed('dist/images'))
        .pipe(svgmin())
        .pipe(gulp.dest('dist/images'))
        .pipe(refresh(server))
});

gulp.task('images', [ 'bitmaps', 'vectors' ]);

gulp.task('fonts', function() {
    gulp.src('app/components/font-awesome/font/*.{otf,eot,svg,ttf,woff}')
        .pipe(changed('dist/font'))
        .pipe(gulp.dest('dist/font'))
        .pipe(refresh(server))
});

gulp.task('pages', function() {
    gulp.src('app/*.hbs')
        .pipe(frontMatter({
             property: 'data',
             remove: true
        }))
        .pipe(header(fs.readFileSync('app/partials/header.hbs', 'utf8')))
        .pipe(footer(fs.readFileSync('app/partials/footer.hbs', 'utf8')))
        .pipe(consolidate('handlebars', function (file) {
            var options = {
                layout: '/layouts/default.hbs',
                partials: {
                    back: 'partials/back',
                    skill: 'partials/skill',
                },
                helpers: {
                    eachProperty: function(context, options) {
                        var ret = "";
                        for(var prop in context)
                        {
                            ret = ret + options.fn({property:prop,value:context[prop]});
                        }
                        return ret;
                    }
                }
            };
            for (var key in file.data) {
                options[key] = file.data[key];
            }
            return options;
        }, { useContents : true }))
        .pipe(minifyHtml())
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('dist'))
        .pipe(refresh(server))
});

gulp.task('lr-server', function() {  
    server.listen(35729, function(err) {
        if (err) return console.log(err);
    });
})

gulp.task('default', [ 'lr-server', 'scripts', 'styles', 'images', 'fonts', 'pages' ], function() { 
    gulp.watch('app/scripts/*.js', ['scripts']);
    gulp.watch('app/styles/*.scss', ['styles']);
    gulp.watch('app/images/**', ['images']);
    gulp.watch('app/**/*.hbs', ['pages']);
})
