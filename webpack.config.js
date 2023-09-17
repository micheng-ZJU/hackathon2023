const webpack = require("webpack") ; 
const path = require("path") ;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports={
    mode: "development",
    entry:{
        app:[path.resolve(__dirname,"./src/index")],
    },
    output: { path: path.resolve(__dirname, "./dist"),publicPath: '/', clean: true
    },
    resolve:{
        modules: ["node_modules", path.resolve(__dirname,"src")],
        extensions: [".js", ".jsx"],
    },
    module:{
        rules: [
            {   
                test:/\.(js|jsx)$/,
                exclude: [/(node_modules)/],
                loader: require.resolve("babel-loader"),
                options: {
                    cacheDirectory: true,
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader","less-loader"],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                include: /\/src\/img/,
                use:[
                {
                    loader: 'file-loader',
                    options: {
                       name: '[name].[ext]',
                       outputPath: 'images', //输出到输出目录中的 images文件夹
                    },
                },        
            ],
        },
        ],
    },    
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, "./index.html"),
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new CopyWebpackPlugin({
            patterns:[
            { from: 'src/img', to: 'images' }
        ]
}),
],
};