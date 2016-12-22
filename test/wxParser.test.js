"use strict";
var wxParser_1 = require("../lib/wxParser.core");
var parser = wxParser_1["default"]();
var root = parser.parseStart("<div class=\"zm-item-rich-text expandable js-collapse-body\" data-resourceid=\"4902196\" data-action=\"/answer/content\" data-author-name=\"\u533F\u540D\u7528\u6237\" data-entry-url=\"/question/31757358/answer/136085208\">\n<img src='{name}'/>\n</div>");
console.log(root);