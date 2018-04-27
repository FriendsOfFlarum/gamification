var gulp = require('flarum-gulp');

gulp({
    modules: {
        'reflar/gamification': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});