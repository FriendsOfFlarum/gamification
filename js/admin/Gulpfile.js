var gulp = require('flarum-gulp');

gulp({
    modules: {
        'Reflar/Gamification': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});