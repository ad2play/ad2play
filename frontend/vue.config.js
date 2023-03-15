module.exports = {
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'development') {
            config.devtool = 'eval-source-map'
        } else {
            config.devtool = 'none'
        }
    }
};