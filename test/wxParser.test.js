"use strict";
var wxParser_1 = require("../lib/wxParser.core");
var parser = wxParser_1["default"]();
var root = parser.parseStart("<div>{who}{do}</div>");
// console.log(root);
console.log(JSON.stringify(root));