"use strict";
var wxParser_1 = require("../lib/wxParser.core");
var parser = wxParser_1["default"]();
var root = parser.parseStart(`<div class="{className}">
<p mm-repeat="people" mm-if=":show" data-name="{name}">{:age} {location}</p>
<p>{name} is {position}</p>
<img src='{src}'/>
</div>`,/(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+\})/g);
// console.log(root);
console.log(JSON.stringify(root));