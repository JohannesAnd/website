/* eslint-disable no-console*/
const { fork } = require('child_process');
const webpack = require('webpack');

const webpackServerConfig = require('./webpack.server.config.js');

const bundler = webpack(webpackServerConfig());

let child;

bundler.watch({}, (err, status) => {
  if (err) {
    console.error(err);

    return;
  }
  if (child && child.connected) {
    child.on('close', () => {
      console.log('Starting server...');
      child = fork('./service.js');
    });
    console.log('Killing server...');
    child.kill('SIGHUP');
  } else {
    console.log('Starting server...');
    child = fork('./service.js');
  }
});
