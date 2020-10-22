postcss-george
==============

A plugin for [PostCSS](https://postcss.org/) to allow runtime manipulation of
variables.

This plugin will take CSS variables marked with a comment, and add an
annotation to the resulting CSS file so that the values can be edited at
runtime using the CSS George editor. This is intended as a tool for designers
working with theming systems to experiment with colour palettes at a variable
level, which is often more broad than individual style rules as edited in the
browser developer tools.


Installation
------------

Installation is easy via npm:

```
npm install --save-dev postcss-george
```


Usage
-----

### Marking variables for export

In your .css files, you can add special comments to flag variables to be
exported as runtime-editable CSS variables.  The special comment syntax is the
word `@export` preceeding the variable declaration.

All of the following examples are accepted:

```css
/* @export */ --header-bg: #ffffff;

/* @export */
--navbar-text: #333333;

/*@export*/ --navbar-height: 56px;
```


### Compiling with Exported Variables

Once you've installed the css-george plugin, you need to add the plugin to your
PostCSS configuration and it will generate an output .css file with the
exported variables defined as CSS variables.

Example `postcss.config.js`:

```javascript
module.exports = {
    plugins: [
        require('postcss-george')
    ]
}
```


Contributing
------------

Contributions of bug reports, feature requests, and pull requests are greatly
appreciated!

Please note that this project is released with a [Contributor Code of
Conduct](https://github.com/css-george/postcss-george/blob/main/CODE_OF_CONDUCT.md).
By participating in this project you agree to abide by its terms.


Licence
-------

Copyright © 2020 Darryl Pogue  
Licensed under the MIT Licence.
