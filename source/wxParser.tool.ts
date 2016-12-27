/**
 * 去除等号两侧的空格
 * 
 * @param {string} str
 * @returns {string}
 */
export function removeEqualSpace(str:string):string{
    return str.replace(/\s*\=\s*/g,'=')
}

/**
 * 修正长度大于2的空格，修正为1
 * 
 * @param {string} str
 * @returns {string}
 */
export function removeMultiSpace(str:string):string{
    return str.replace(/\s{2,}/g," ")
}

/**
 * 移除所有的空格
 * 
 * @export
 * @param {string} str
 * @returns {string}
 */
export function removeAllSpace(str:string):string{
    return str.replace(/\s*/g,'')
}