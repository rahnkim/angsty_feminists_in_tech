module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                options:{
                    style:'compressed'
                },
                files: {
                    'src/css/main.css' : 'src/sass/main.scss',
                    'src/css/normalize.css' : 'src/sass/normalize.scss'   
                }
            }
        },

        autoprefixer:{
            dist:{
                files:{
                    'src/css/main.css':'src/css/main.css'
                }
            }
        },

        concat: {
            scripts: {
                src: ['src/js/vendor/modernizr-2.6.2.min.js', 'src/js/main.js'],
                dest: 'src/js/scripts.js',
            },
            css: {
                src: ['src/css/normalize.css', 'src/css/main.css'],
                dest: 'src/css/styles.css'
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            production: {
                files: [
                    {
                        'dist/js/scripts.min.js': 'src/js/scripts.js'
                    }
                ]
            }
        },

        cssmin: {
            options: {
                processImport: false
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: 'styles.css',
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            }
        },

        clean: ['dist/'],

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*',
                          // JavaScript
                          '!**/main.js',
                          '!**/modernizr-2.6.2.min.js',
                          '!**/scripts.js',
                          // CSS
                          '!**/styles.css',
                          '!**/main.css',
                          '!**/main.css.map',
                          '!**/main.min.css',
                          '!**/normalize.css',
                          '!**/normalize.min.css',
                          '!**/sass/**',
                          '!**/partials/**',
                          // Other
                          '!**/bower_components/**'],
                    dest: 'dist/'
                }]
            },
        },

        'string-replace': {
            dist: {
                files: {
                    'dist/index.html': 'dist/index.html'
                },
                options: {
                    replacements: [
                        {
                            pattern: 'normalize.css',
                            replacement: 'styles.min.css'
                        },
                        {
                            pattern: 'main.js',
                            replacement: 'scripts.min.js'
                        },
                        // Get rid of un-concatenated files
                        {
                            pattern: '<link rel="stylesheet" href="css/main.css">',
                            replacement: ''
                        },
                        {
                            pattern: '<script src="js/vendor/modernizr-2.6.2.min.js"></script>',
                            replacement: ''
                        }
                    ]
                }
            }
        },

        watch: {
            css: {
                files: ['src/sass/main.scss', 'src/partials/_layout.scss', 'src/partials/_mixins.scss', 'src/partials/_variables.scss'],
                tasks: ['sass', 'autoprefixer']
            }
        },

        // responsive_images: {
        //     dev: {
        //         options: {
        //             engine: 'im',
        //             sizes: [{
        //                 name: "small",
        //                 width: 320, //mobile
        //                 quality: 80
        //             },{
        //                 name: "small-2x",
        //                 width: 640, //mobile 2x
        //                 quality: 80
        //             },{
        //                 name: "medium",
        //                 width: 700, //tablet
        //                 quality: 80
        //             },{
        //                 name: "medium-2x",
        //                 width: 1400, //tablet 2x
        //                 quality: 80
        //             },{
        //                 name: "large",
        //                 width: 1170, //desktop
        //                 quality: 80
        //             },{
        //                 name: "large-2x",
        //                 width: 2340, //desktop 2x
        //                 quality: 80
        //             }]
        //         },
        //         /* Where to get and put images */
        //         files: [{
        //             expand: true,
        //             src: ['*.{gif,jpg,png}'],
        //             cwd: 'src/img/originals',
        //             dest: 'src/img'
        //         }]
        //     }
        // }
    });

    /* All Files */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-concat');
    /* CSS Tasks */
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    /* JS Tasks */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    /* Image Tasks */
    grunt.loadNpmTasks('grunt-responsive-images');

    /* Default Task: Builds to `dist` */
    grunt.registerTask('default', ['clean', 'copy', 'sass', 'autoprefixer', 'concat', 'cssmin', 'uglify', 'string-replace']);
    /* Bundled Tasks */
    grunt.registerTask('css', ['sass', 'autoprefixer']);
    // grunt.registerTask('images', ['clean', 'responsive_images']);
}