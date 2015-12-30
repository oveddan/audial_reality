![TravisCI build status](https://travis-ci.org/stride-nyc/web-boilerplate-2016.svg)

A web boilerplate setup including the following technologies:

- [Webpack](https://webpack.github.io)
- [JSCS](http://jscs.info)
- [ESLint](http://eslint.org)
- [Karma](http://karma-runner.github.io/0.13/index.html)
- [Mocha, Chai, Sinon](http://chaijs.com/plugins/sinon-chai)
- [PhantomJS 2](http://phantomjs.org)
- [React](http://facebook.github.io/react/)
- [PostCSS](https://github.com/postcss/postcss)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [ES2015+ via Babel](https://babeljs.io)
- [Hot module reloading](https://github.com/gaearon/react-transform-hmr)

## Setup

- Requires [node.js](nodejs.org) to be installed
- `npm install` - Installs all dependencies
- `rm .travis.yml` - Removes Stride's build configuration

## Development

- `npm start` - Start the local development server

## Testing

- `npm test` - Run tests for a single run (headless)

#### Test watching

- `npm run watch` - Run the tests continuously

## Linting

- `npm run lint` - Run linting with JSCS and ESLint

