/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var wxParser_tool_1 = __webpack_require__(1);
	var wxParser_type_1 = __webpack_require__(2);
	function isText(obj) {
	    return obj.type == wxParser_type_1.TEXTNODE;
	}
	var WxDomParser = function () {
	    function WxDomParser() {
	        this.nodeRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>/g;
	        this.attrRegex = /[\w\-]+=['"][\s\S]*?['"]/g;
	    }
	    WxDomParser.prototype.parseStart = function (htmlStr) {
	        var matchResult = this.findAllNodes(htmlStr);
	        return this.makeWxTree(matchResult);
	    };
	    WxDomParser.prototype.findAllNodes = function (htmlStr) {
	        var result;
	        var allMatches = [],
	            nextIndex = 0;
	        while (result = this.nodeRegex.exec(htmlStr)) {
	            var match = result[0],
	                startTag = result[1],
	                startTagName = result[2],
	                attr = result[3],
	                endSelf = result[4],
	                endTagName = result[5];
	            var index = result.index,
	                length_1 = match.length;
	            if (index > nextIndex) {
	                allMatches.push({
	                    type: wxParser_type_1.TEXTNODE,
	                    value: htmlStr.slice(nextIndex, index)
	                });
	            }
	            nextIndex = index + length_1;
	            var type = void 0;
	            if (startTagName) {
	                type = wxParser_type_1.NODESTART;
	            } else if (endTagName) {
	                type = wxParser_type_1.NODEEND;
	            } else {
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
	            tree.children.push({ nodeName: wxParser_type_1.TEXTNODE, attr: [], children: [result.value] });
	        } else {
	            if (result.endTagName) {
	                openTreeList.pop();
	            } else {
	                var nodeName = result.startTagName;
	                if (result.endSelf) {
	                    tree.children.push({ nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] });
	                } else if (nodeName) {
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
	}();
	var wxDomParserFactory = function () {
	    var wxDomParser;
	    return function () {
	        return wxDomParser || (wxDomParser = new WxDomParser());
	    };
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = wxDomParserFactory;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * 去除等号两侧的空格
	 *
	 * @param {string} str
	 * @returns {string}
	 */

	function removeEqualSpace(str) {
	  return str.replace(/\s*\=\s*/g, '=');
	}
	exports.removeEqualSpace = removeEqualSpace;
	/**
	 * 移除多余的空格
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeMultiSpace(str) {
	  return str.replace(/\s{2,}/g, " ");
	}
	exports.removeMultiSpace = removeMultiSpace;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	exports.TEXTNODE = 'TEXTNODE';
	exports.NODESTART = 'NODESTART';
	exports.NODEEND = 'NODEEND';
	exports.NODECLOSESELF = 'NODECLOSESELF';

/***/ }
/******/ ]);