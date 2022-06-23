const { ModuleFederationPlugin } = require("webpack").container;
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");

module.exports = {
    mode: 'development',
    entry: "./src/compEntry",
    output: {
        filename: 'script/index.js',
        // libraryTarget: 'umd',
        // umdNamedDefine: true,
        // chunkFilename: "chunk.[chunkhash].[name].js"

        library: {
            name: 'fullElecLoginFeComponent',
            type: 'window',
            export: 'default',
        }
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["@xforce/babel-preset-xforce"],
                },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "mainApp",
            remotes: {
                remoteApp: "remoteApp@http://localhost:8080/remoteEntry.js",
            },
            shared: { react: { singleton: true }, "react-dom": { singleton: true } },
        }),
        new ExternalTemplateRemotesPlugin(),
    ],
};

