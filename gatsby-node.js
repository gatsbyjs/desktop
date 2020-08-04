exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  const config = getConfig()
  actions.replaceWebpackConfig({
    ...config,
    target: `electron-renderer`,
    resolve: { ...config.resolve, aliasFields: [`module`] },
  })
}
