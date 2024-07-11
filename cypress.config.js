const { defineConfig } = require('cypress')
const fs = require('fs')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    supportFile: 'cypress/support/e2e.js',
    videosFolder: 'cypress/videos',
  },
  e2e: {
    setupNodeEvents(on) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            fs.unlinkSync(results.video)
          }
        }
      })
      on('after:run', (results) => {
        if (results) {
          console.log(
            `'${results.config.env.host}' cypress run done on '${results.config.projectId}'`
          )
        }
      })
    },
    baseUrl: 'http://localhost:3333',
    fixturesFolder: 'cypress/fixtures',
    projectId: 'keebord',
    screenshotsFolder: 'cypress/screenshots',
    specPattern: ['cypress/integration/**/*.cy.js'],
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1200,
    viewportHeight: 1000,
  },
  env: {
    CUSTOM_SCRIPTS_ROOT: 'scripts',
  },
  video: true,
})
