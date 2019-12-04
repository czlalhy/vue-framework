var gulp = require('gulp'),
    concat = require('gulp-concat'),
    path = require('path'),
    resolve = path.resolve,
    strs = ['./static/libs/sea/dist/sea.js', './static/libs/sea/dist/seajs-text.js', './static/libs/vue/vue2.6.10.js', './static/libs/vue/vue-router.min.js',
        './static/libs/element2.12.0/js/index.js',
        './static/libs/axios.0.18.min.js', './static/libs/axios-mock-adapter.min.js', './static/libs/vue/vuex.min.js',
        './static/libs/vue/vuex-i18n.min.js', './static/libs/md5.min.js', './static/libs/jquery-3.2.1.min.js','./static/libs/xlsx.full.min.js', './static/libs/quill.min.js'];
    // strs = ['./static/libs/sea/dist/sea.js', './static/libs/sea/dist/seajs-text.js', './static/libs/vue/vue.min.js', './static/libs/vue/vue-router.min.js',
    //     './static/libs/element2.12.0/js/index.js'],
    // strs1 = ['./static/libs/axios.0.18.min.js', './static/libs/axios-mock-adapter.min.js', './static/libs/vue/vuex.min.js',
    //     './static/libs/vue/vuex-i18n.min.js', './static/libs/md5.min.js', './static/libs/jquery-3.2.1.min.js'],
    // strs2 = ['./static/libs/xlsx.full.min.js', './static/libs/quill.min.js'];



gulp.task('build-test', function() {
    return gulp.src(strs, {allowEmpty: true})
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/js/'));
});
// gulp.task('concat1', function() {
//     return gulp.src(strs1)
//         .pipe(concat('vendor_e.js'))
//         .pipe(gulp.dest('./dist/js/'));
// })
// gulp.task('concat2', function() {
//     return gulp.src(strs2)
//         .pipe(concat('vendor_ex.js'))
//         .pipe(gulp.dest('./dist/js/'));
// })

//gulp.task('build-test', gulp.parallel('concat', 'concat1', 'concat2', (done) => done()));
// gulp.task('build-test', ['concat', 'concat1', 'concat2']);

