const { DllPlugin } = require('webpack');
const { resolve } = require('path');

module.exports = {
    mode: 'development',
    entry: {
        react: ['react','react-dom']
    },
    output: {
        filename: '_dll_[name].js',
        path: resolve(__dirname,'dist'),
        library: '_dll_[name]'
        // libraryTarget: 'var'  common.js this var
    },
    plugins: [
        new DllPlugin({
            name: '_dll_name',
            path: resolve(__dirname,'dist','manifest.json')
        })
    ]
}