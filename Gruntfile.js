module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            build: {
                src: ['reference.ts', '**/src/main/ts/**/*.ts', '**/lib/**/*.d.ts'],
                out: 'build/<%= pkg.name %>.js',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    sourceMap: true,
                    declaration: true
                }
            }
        },
        run_grunt: {
            clean: {
                options: {
                    task: 'clean'
                },
                src: ['mvp.ts/Gruntfile.js', 'mvp-jquery.ts/Gruntfile.js', 'mvp-jquery-handlebars.ts/Gruntfile.js', 'mvp-jquery-xslt.ts/Gruntfile.js', 'mvp-jquery-handlebars-example.ts/Gruntfile.js']
            }
        },
        clean: {
            all: ["build", "dist", "<%= pkg.name %>-<%= pkg.version %>.zip"]
        },
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': ['build/<%= pkg.name %>.js']
                }
            }
        },
        copy: {
            dist: {
                files: [
                    { expand: true, flatten: true, src: ['build/<%= pkg.name %>.js'], dest: 'dist/', rename: function (dest, src) { return dest + '<%= pkg.name %>-<%= pkg.version %>.js'; } },
                    { expand: true, flatten: true, src: ['build/<%= pkg.name %>.js.map'], dest: 'dist/', rename: function (dest, src) { return dest + '<%= pkg.name %>-<%= pkg.version %>.js.map'; } },
                    { expand: true, flatten: true, src: ['build/<%= pkg.name %>.d.ts'], dest: 'dist/', rename: function (dest, src) { return dest + '<%= pkg.name %>-<%= pkg.version %>.d.ts'; } },
                    { expand: true, src: ['lib/*.min.js'], dest: 'dist/' },
                    { expand: true, src: ['res/**/*'], dest: 'dist/' },
                    { expand: true, src: ['*.css'], dest: 'dist/' },
                    { expand: true, src: ['*.html'], dest: 'dist/' }
                ]
            }
        },
        zip: {
            dist: {
                router: function (filepath) {
                    // Route each file to all/{{filename}}
                    var s = 'dist/';
                    var index = filepath.indexOf(s);
                    var result;
                    if (index == 0) {
                        result = filepath.substring(s.length + index);
                    } else {
                        result = filepath;
                    }
                    return result;
                },
                src: ['dist/**'],
                dest: '<%= pkg.name %>-<%= pkg.version %>.zip'
            }
        },
        replace: {
            dist: {
                src: ['build/*.d.ts'],
                overwrite: true,
                replacements: [{
                    from: /\/\/\/ \<reference path=.*/g,
                    to: ""
                }]
            }
        }
    });

    // clean
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Load the plugin that provides the "TS" task.
    grunt.loadNpmTasks('grunt-ts');
    // zip
    grunt.loadNpmTasks('grunt-zip');
    // copy
    grunt.loadNpmTasks('grunt-contrib-copy');
    // replace text in file
    grunt.loadNpmTasks('grunt-text-replace');
    // replace text in file
    grunt.loadNpmTasks('grunt-run-grunt');
    // install all the bullshit
    grunt.loadNpmTasks('grunt-auto-install');

    // Default task(s).
    grunt.registerTask('reset', ['clean']);
    grunt.registerTask('init', ['auto_install']);
    grunt.registerTask('dist', ['init', 'ts', 'replace', 'uglify', 'copy:dist', 'zip']);
    grunt.registerTask('default', ['init', 'ts']);

};