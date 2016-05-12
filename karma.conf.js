require('./test/gen')
module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    files: [
      'test/test-*',
      { pattern: 'test/fixtures/**', included: false }
    ],
    preprocessors: {
      '**/test-*.js': ['webpack', 'sourcemap']
    },
    webpack: {
      watch: true,
      devtool: 'inline-source-map'
    },
    webpackServer: {
      quiet: true,
      noInfo: true
    },
    browsers: ['Chrome']
  })
}
