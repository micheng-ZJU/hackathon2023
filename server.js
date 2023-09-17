const express = require("express");
const path = require("path");
const webpack = require("webpack");
const middleware =require("webpack-dev-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

const config = require("./webpack.config.js")
const compiler = webpack(config);

app.use(middleware(compiler));
app.use("*",(req, res, next) => {
    const filename = path.join(compiler.outputPath, "index.html");
    compiler.outputFileSystem.readFile(filename,(err,result) => {
        if(err){
            return next(err);
        }
        res.set("content-type", "text/html");
        res.send(result);
        res.end();
        return res;
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});