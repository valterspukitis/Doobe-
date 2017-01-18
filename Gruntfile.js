'use strict'

const fs = require('fs')
const serveStatic = require('serve-static')

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt)
    // require('time-grunt')(grunt)

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            watch: {
                files: {
                    './app.js': ['./js/app.js']
                },
                options: {
                    transform: ['hbsfy', 'babelify']
                }
            },
            dist: {
                files: {
                    './app.js': ['./js/app.js']
                },
                options: {
                    transform: ['hbsfy', 'babelify', 'uglifyify']
                }
            }
        },

        clean: {
            dist: ['./dist']
        },

        connect: {
            server: {
                options: {
                    base: './',
                    hostname: '0.0.0.0',
                    livereload: true,
                    open: true,
                    port: 3000,
                    middleware: (connect, options) => {
                        const middlewares = []

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base]
                        }

                        options.base.forEach(function (base) {
                            middlewares.push(serveStatic(base))
                        })

                        // default: index.html
                        middlewares.push((req, res) => {
                            fs
                                .createReadStream(`${options.base}/index.html`)
                                .pipe(res)
                        })
                        return middlewares
                    }
                }
            }
        },

        copy: {
            dist: {
                expand: true,
                cwd: './',
                src: '*.html',
                dest: './dist/'
            }
        },

        sass: {
            dist: {
                options: {                       // Target options
                    style: 'compressed'
                },
                files: {
                    'css/main.css': 'sass/main.scss'
                }
            }
        },

        watch: {
            html: {
                files: ['./*.html'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['./sass/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true
                }
            },
            scripts: {
                files: ['./js/*.js'],
                tasks: ['browserify:watch'],
                options: {
                    livereload: true
                }
            },
            templates: {
                files: ['./templates/*.hbs'],
                tasks: ['browserify:watch'],
                options: {
                    livereload: true
                }
            }
        }
    })

    grunt.registerTask('default', ['clean', 'browserify:dist'])
    grunt.registerTask('start', ['default', 'connect', 'watch'])

}
