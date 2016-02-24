module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                options:{
                    style:'compressed'
                },
                files: {
                    'src/css/main.css' : 'src/sass/main.scss'
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
            //scripts: {
            //    src: ['src/js/vendor/modernizr-2.6.2.min.js', 'src/js/plugins.js', 'src/js/isotope-settings.js', 'src/js/fixed-sidebar.js', 'src/js/vendor/picturefill.min.js', 'src/js/vendor/lightbox.js'],
            //    dest: 'src/js/scripts.js',
            //},
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
                          // CSS
                          '!**/styles.css',
                          '!**/main.css',
                          '!**/main.css.map',
                          '!**/main.min.css',
                          '!**/normalize.css',
                          '!**/normalize.min.css',
                          '!**/sass/**'],
                    dest: 'dist/'
                }]
            },
        },

        'string-replace': {
            dist: {
                files: {
                    'dist/timeline.html': 'dist/timeline.html'
                },
                options: {
                    replacements: [
                        {
                            pattern: 'normalize.css',
                            replacement: 'styles.min.css'
                        },
                        // Get rid of un-concatenated files
                        {
                            pattern: '<link rel="stylesheet" href="/css/main.css">',
                            replacement: ''
                        }
                    ]
                }
            }
        },

        watch: {
            css: {
                files: 'src/sass/main.scss',
                tasks: ['sass', 'autoprefixer']
            }
        }
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

    /* Default Task: Builds to `dist` */
    grunt.registerTask('default', ['clean', 'copy', 'sass', 'autoprefixer', 'concat', 'cssmin', 'uglify', 'string-replace']);
    /* Bundled Tasks */
    grunt.registerTask('css', ['sass', 'autoprefixer']);
}