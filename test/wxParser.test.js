"use strict";
var parser = require("../wx.parser.js").wxParser;
var root = parser.parseStart(`<!--这是一段注释。注释不会在浏览器中显示。-->
<p>这是一段普通的段落。</p>`);
// console.log(root);
console.log(JSON.stringify(root));