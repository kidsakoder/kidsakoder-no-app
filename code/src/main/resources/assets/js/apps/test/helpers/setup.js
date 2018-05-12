require('@babel/register');
require('@babel/polyfill');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

global.document = new JSDOM('<body></body>');
global.window = document.defaultView;
