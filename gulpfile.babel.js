/* Tasks:
     `gulp`
     `gulp build`
     `gulp serve`
     `gulp deploy:html`
     `gulp process:img`
     `gulp process:scss`
     `gulp process:js`
     `gulp format:js`
     `gulp minify:css`

   -------------------------------------
  
   Plugins:
     gulp              
     gulp-autoprefixer   : CSS vendor prefixes
     gulp-babel          : JavaScript transpiler
     gulp-cssmin         : Minify CSS
     gulp-environments   : Separate environments to run tasks in
     gulp-imagemin							: Minify images
     gulp-prettier       : JavaScript formatter
     gulp-plumber        : Prevents pipe breaking caused by errors from gulp plugins
     gulp-sass           : Compile Scss
     gulp-sourcemaps     : Sourcemaps to help development
     gulp-uglify         : Minify JavaScript
     browser-sync        : Live reloading

*/

'use strict';

// -------------------------------------
//   Plugins
// -------------------------------------

import gulp from 'gulp';

// ***** General plugnis ***** //

import environments from 'gulp-environments';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import {create as bscreate} from 'browser-sync';

const browsersync = bscreate();

// ***** CSS plugnis ***** //

import autoprefixer from 'gulp-autoprefixer';
import cssmin from 'gulp-cssmin';
import sass from 'gulp-sass';

// ***** JS plugnis ***** //

import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import prettier from 'gulp-prettier';

// ***** IMG plugins ***** //
import imagemin from 'gulp-imagemin';

// -------------------------------------
//   Configuration
// -------------------------------------

// ***** Browsersync ***** //

const server = {
  
  host: process.env.IP,
  port: process.env.PORT

};

// ***** Tasks ***** //

const tasks = {
  
  build: ['deploy:html','process:img', 'process:css', 'process:js']
  
};

// ***** Paths ***** //

const paths = {
  
  html: {
    src: 'src/*.html',
    dest: 'dest'
  },

  css: {
    src: 'src/assets/_scss/*.scss',
    dest: 'dest/assets/css'
  },
  
  js: {
    main: 'src/assets/js/main.js',
    dest: 'dest/assets/js'
  },
  
  img: {
    src: 'src/assets/images/**.*',
    dest: 'dest/assets/images'
  }
  
};

// -------------------------------------
//  Task: Default
// -------------------------------------

gulp.task('default', tasks.default);


// -------------------------------------
//  Task: Build
// -------------------------------------

gulp.task('build', () => {
  tasks.build.forEach((task) => {
    gulp.start(task);
  });
});

// -------------------------------------
//  Task: Deploy:HTML
// -------------------------------------

gulp.task('deploy:html', () => {
  gulp.src(paths.html.src)
  	  .pipe(plumber())
  	  .pipe(gulp.dest(paths.html.dest));
});

// -------------------------------------
//  Task: Process:IMG
// -------------------------------------

gulp.task('process:img', () => {
  gulp.src(paths.img.src)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(paths.img.dest));
});

// -------------------------------------
//  Task: Process:SCSS
// -------------------------------------

gulp.task('process:css', () => {
  gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(environments.development(sourcemaps.init()))
    .pipe(sass({
            outputStyle: 'expanded'
          }))
    .pipe(autoprefixer({
            browsers: ['last 2 versions']
          }))
    .pipe(environments.development(sourcemaps.write('.')))
    .pipe(environments.production(cssmin()))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(environments.development(browsersync.stream()));
});

// -------------------------------------
//  Task: Process:JS
// -------------------------------------

gulp.task('process:js', () => {
  gulp.src(paths.js.main)
    .pipe(plumber())
    .pipe(babel())
    .pipe(environments.production(uglify()))
    .pipe(gulp.dest(paths.js.dest));
});

// -------------------------------------
//  Task: Format:JS
// -------------------------------------

gulp.task('format:js', () => {
  gulp.src(paths.js.main)
    .pipe(plumber())
    .pipe(prettier())
    .pipe(gulp.dest('.'));
});

// -------------------------------------
//  Task: Serve
// -------------------------------------

gulp.task('serve', () => {
  browsersync.init({
		host: server.host,
		port: server.port,
		server: {
		  baseDir: './dest'
		},
		files: [
      './src/*'
      ]
  });
  
  gulp.watch('./src/**/*', [ 'build' ]);
});