#!/usr/bin/env node
'use strict';

module.exports = function (grunt) {
    var pkg = require('./package.json');

    grunt.initConfig({
        meta: {
            src: 'lib/**/*.js',
            test: 'test/**/*.js',
            specs: 'test/spec/*.js',
            tools: 'tools/**/*.js'
        },
        pkg: pkg,
        jshint: {
            // global options
            options: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                nonew: true,
                plusplus: false,
                quotmark: 'single',
                undef: true,
                unused: true,
                strict: true,
                maxparams: 4,
                maxdepth: 4,
                trailing: true,
                maxlen: 120,
                browser: true,
                node: true,
                white: true
            },
            tail_log: {
                expand: true,
                src: ['<%= meta.src %>', '<%= meta.test %>', '<%= meta.tools %>'],
                options: {
                    browser: false
                }
            }
        },
        nodeunit: {
            tail: {
                expand: true,
                src: '<%= meta.specs %>'
            }
        }
    });

    // npm tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    /* DEFAULT */
    grunt.registerTask('default', ['lint', 'test']);

    /* JSHINT */
    grunt.registerTask('lint', 'lint all', 'jshint');

    /* NODEUNIT */
    grunt.registerTask('test', 'test all', 'nodeunit');
};
