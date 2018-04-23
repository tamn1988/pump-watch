module.exports = {
    plugins: [
        require('precss'),
        require('autoprefixer'),
        require('postcss-simple-vars'),
        require('postcss-nested'),
        require('postcss-import'),
        require('postcss-hexrgba')
    ]
}