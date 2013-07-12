'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('assemble');

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            compass: {
                files: ['<%= yeoman.app %>/styles/*.{scss,sass}'],
                tasks: ['compass']
            },
            assemble: {
                files: ['<%= yeoman.app %>/*.hbs'],
                tasks: ['assemble', 'livereload']
            },
            livereload: {
                files: [
                    '{.tmp,<%= yeoman.app %>}/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/*.js',
                    '<%= yeoman.app %>/images/*.{png,jpg,jpeg}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'dist')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                /* '<%= yeoman.app %>/scripts/*.js', */
                'test/spec/*.js'
            ]
        },
        assemble: {
            options: {
                /* Renamed partials to partialsWorkaround in node_modules/assemble/tasks/assemble.js
                 * since "partials" became cleared for some unknown reason.
                 */
                partialsWorkaround: '<%= yeoman.app %>/partials/*.hbs',
                layout: '<%= yeoman.app %>/layouts/default.hbs',
                flatten: true
            },
            pages: {
                files: {
                    '.tmp/': ['<%= yeoman.app %>/*.hbs']
                }
            }
		},
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                importPath: 'app/components',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/

        uglify: {
            /*
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/main.js': [
                        '.tmp/scripts/*.js',
                        '<%= yeoman.app %>/scripts/*.js'
                    ],
                }
            }
            */
        },
        useminPrepare: {
            html: '.tmp/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['.tmp/*.html'],
            css: ['<%= yeoman.dist %>/styles/*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/images/geekdom',
                    src: '*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images/geekdom'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/*.css',
                        '<%= yeoman.app %>/styles/*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    // removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess'
                    ]
                },
                {
                    expand: true,
                    cwd: '<%= yeoman.app %>/components/font-awesome/font/',
                    dest: '<%= yeoman.dist %>/font',
                    src: [
                        '*.{otf,eot,svg,ttf,woff}',
                    ]
                }]
            }

        },
        bower: {
            rjsConfig: 'app/scripts/main.js',
            indent: '    '
        },
        svgmin: {
            options: {
                plugins: [{
                    removeUnknownsAndDefaults: false
                }]
            },
            dist: {
                files: {
                    'dist/images/geekdom/acc.svg': 'app/images/geekdom/acc.svg',
                    'dist/images/geekdom/borland.svg': 'app/images/geekdom/borland.svg'
                }
            }
        }
    });

    grunt.renameTask('regarde', 'watch');
    // remove when mincss task is renamed
    grunt.renameTask('mincss', 'cssmin');

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'compass:server',
            'livereload-start',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

	// skipping tests for now
    grunt.registerTask('test', [ ]);

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'test',
        'compass:dist',
        'assemble',
        'useminPrepare',
        'imagemin',
        'cssmin',
        'concat',
        'uglify',
        'copy',
        'svgmin',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', ['build']);
};
