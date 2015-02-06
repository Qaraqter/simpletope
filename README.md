# simpletope 0.2.1
> No more scripting required to integrate isotope into your website! This plugin uses HTML5 attributes rather then JS codes. It also supports hashes so you can directly link to a filter.

## Bower
Install with Bower: ``bower install simpletope``

## Documentation
[See here for more info](https://github.com/Qaraqter/simpletope/blob/master/DOCUMENTATION.md)

## Examples
There are 3 examples found in [examples/single](https://github.com/Qaraqter/simpletope/tree/master/examples/single), [examples/multiple](https://github.com/Qaraqter/simpletope/tree/master/examples/multiple) and [examples/hash](https://github.com/Qaraqter/simpletope/tree/master/examples/hash).

# Using this repo
## NodeJS

### NPM
If you haven't used [npm](https://www.npmjs.com/) before, be sure to check out the [Getting Started](https://docs.npmjs.com/getting-started/what-is-npm) guide, as it explains how to [install npm](https://docs.npmjs.com/getting-started/installing-node). Once you're familiar with that process, install the required plugins with this command in the root of your project:

```shell
npm install
```

### Bower
After installing the required NodeJS modules we also need to download dependecies from bower.
```shell
bower install
```

### Building
To build the source files into `simpletope.js`, `simpletope.min.js`  and `simpletope.dev.js`, simple run:
```shell
npm run build
```

To watch the source files for new changes and to automatically build `simpletope.dev.js`:
```shell
npm run watch
```

Other commands:
```shell
npm run build-min
```
```shell
npm run build-dev
```
```shell
npm run build-main
```

## SourceMap
`Simpletop.dev.js` contains a sourcemap and is - beside the sourcemap - identical to `simpletope.js`
