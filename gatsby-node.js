const path = require(`path`)

exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  const config = getConfig()
  actions.replaceWebpackConfig({
    ...config,
    target: `electron-renderer`,
    resolve: { ...config.resolve, aliasFields: [`module`] },
  })
}

exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  const onboardingSteps = [`intro`, `editor`, `sites`]

  onboardingSteps.forEach((step) => {
    createPage({
      path: `onboarding/${step}`,
      component: path.resolve(`./src/templates/onboarding-step.tsx`),
      context: {
        step,
      },
    })
  })
}
