const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),  // 웹의 진입점 설정. 원하는 경로로 변경해야 합니다.
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',  // react-native를 react-native-web으로 대체
    },
    extensions: ['.web.js', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};
