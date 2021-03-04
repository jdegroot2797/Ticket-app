// fix to ensure hot reload feature of next polls for
// file changes frequently due to iffy default reload
// behaviour when ran in a k8s pod.
module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
