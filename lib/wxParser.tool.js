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
