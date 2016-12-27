"use strict";
var wxParser_tool_1 = require("./wxParser.tool");
var wxParser_type_1 = require("./wxParser.type");
function isText(obj) {
    return obj.type == wxParser_type_1.TEXTNODE;
}
var WxDomParser = (function () {
    function WxDomParser() {
        this.nodeRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{\w+\})/g;
        this.attrRegex = /[\w\-]+=['"][\s\S]*?['"]/g;
    }
    WxDomParser.prototype.parseStart = function (htmlStr) {
        var matchResult = this.findAllNodes(htmlStr);
        return this.makeWxTree(matchResult);
    };
    WxDomParser.prototype.findAllNodes = function (htmlStr) {
        var result;
        var allMatches = [], nextIndex = 0;
        while (result = this.nodeRegex.exec(htmlStr)) {
            var match = result[0], startTag = result[1], startTagName = result[2], attr = result[3], endSelf = result[4], endTagName = result[5], exp = result[6];
            var index = result.index, length_1 = match.length;
            if (index > nextIndex) {
                allMatches.push({
                    type: wxParser_type_1.TEXTNODE,
                    value: htmlStr.slice(nextIndex, index)
                });
            }
            if (exp) {
                allMatches.push({
                    type: wxParser_type_1.TEXTNODE,
                    value: exp
                });
            }
            nextIndex = index + length_1;
            var type = void 0;
            if (startTagName) {
                type = wxParser_type_1.NODESTART;
            }
            else if (endTagName) {
                type = wxParser_type_1.NODEEND;
            }
            else {
                type = wxParser_type_1.NODECLOSESELF;
            }
            allMatches.push({
                type: type, match: match, attr: attr, startTag: startTag, startTagName: startTagName, endSelf: endSelf, endTagName: endTagName, index: index, length: length_1
            });
        }
        return allMatches;
    };
    WxDomParser.prototype.makeWxTree = function (results) {
        var openTreeList = [{ nodeName: 'ROOT', attr: [], children: [] }];
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var node = results_1[_i];
            this.make(node, openTreeList);
        }
        return openTreeList[0];
    };
    WxDomParser.prototype.make = function (result, openTreeList) {
        var tree = openTreeList[openTreeList.length - 1];
        if (isText(result)) {
            if (wxParser_tool_1.removeAllSpace(result.value).length !== 0) {
                tree.children.push({ nodeName: wxParser_type_1.TEXTNODE, attr: [], children: [result.value] });
            }
        }
        else {
            if (result.endTagName) {
                openTreeList.pop();
            }
            else {
                var nodeName = result.startTagName;
                if (result.endSelf) {
                    tree.children.push({ nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] });
                }
                else if (nodeName) {
                    var newOpenTree = { nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] };
                    tree.children.push(newOpenTree);
                    openTreeList.push(newOpenTree);
                }
            }
        }
    };
    WxDomParser.prototype.getAttributes = function (attr) {
        var slimAttr = wxParser_tool_1.removeMultiSpace(wxParser_tool_1.removeEqualSpace(attr));
        var attrArray = [];
        var attrExpression;
        while (attrExpression = this.attrRegex.exec(attr)) {
            var p = attrExpression[0].split('=');
            attrArray.push({
                name: p[0],
                value: p[1].replace(/["']/g, '')
            });
        }
        return attrArray;
    };
    return WxDomParser;
}());
var wxDomParserFactory = (function () {
    var wxDomParser;
    return function () {
        return wxDomParser || (wxDomParser = new WxDomParser());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = wxDomParserFactory;
