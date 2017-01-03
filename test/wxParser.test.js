"use strict";
var parser = require("../wx.parser.js").wxParser;
var root = parser.parseStart(`<div class="{className}">
<p mm-repeat="people" mm-if=":show" data-name="{name}">{:age} {location}</p>
<p>{name} is {position}</p>
<img src='{src}'/>
</div>`, /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+\})/g);
// console.log(root);
console.log(JSON.stringify(root));