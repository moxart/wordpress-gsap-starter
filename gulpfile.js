'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-dart-sass');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const mode = require('gulp-mode')();
const browserSync = require('browser-sync').create();

const browserSyncConfig = {
    proxy: "http://localhost:8081",
    port: 8081
}

const paths = {
    src: 'assets',
    dist: 'dist'
}

const scssFiles = {
    src: paths.src + '/styles/main.scss',
    dist: paths.dist + '/styles/',
}

const jsFiles = {
    src: paths.src + '/scripts/main.js',
    dist: paths.dist + '/scripts/',
}

const imagesFiles = {
    src: paths.src + '/images/**/*.{png,jpg,jpeg,gif,svg}',
    dist: paths.dist + '/images/',
}

const fontsFiles = {
    src: paths.src + '/fonts/**/*.{svg,eot,ttf,woff,woff2}',
    dist: paths.dist + '/fonts/',
}

const phpFiles = {
    templates: "templates/**/*.php",
    lib: "lib/**/*.php",
    extra: "**/*.php"
}

const styles = () => {
    return src(scssFiles.src)
        .pipe(mode.development(sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename('main.css'))
        .pipe(mode.production(csso()))
        .pipe(mode.development(sourcemaps.write()))
        .pipe(dest(scssFiles.dist))
        .pipe(mode.development(browserSync.stream()));
}

const scripts = () => {
    return src(jsFiles.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(webpack({
            mode: 'development',
            devtool: 'inline-source-map'
        }))
        .pipe(mode.development( sourcemaps.init({ loadMaps: true }) ))
        .pipe(rename('main.js'))
        .pipe(mode.production( terser({ output: { comments: false } }) ))
        .pipe(mode.development( sourcemaps.write() ))
        .pipe(dest(jsFiles.dist))
        .pipe(mode.development( browserSync.stream() ));
}

const images = () => {
    return src(imagesFiles.src)
        .pipe(dest(imagesFiles.dist))
}

const fonts = () => {
    return src(fontsFiles.src)
        .pipe(dest(fontsFiles.dist))
}

const watchForChanges = () => {
    browserSync.init({
        files: [
            phpFiles.templates,
            phpFiles.lib,
            phpFiles.extra
        ],
        proxy: browserSyncConfig.proxy,
        port: browserSyncConfig.port
    })
    watch([phpFiles.templates, phpFiles.extra]).on('change', browserSync.reload)
    watch(paths.src + '/styles/**/*.scss', styles);
    watch(paths.src + '/scripts/**/*.js', scripts);
}

const clean = () => {
    return del(['dist']);
}

exports.default = series(clean, parallel(styles, scripts, images, fonts), watchForChanges);
exports.build = series(clean, parallel(styles, scripts, images, fonts));
