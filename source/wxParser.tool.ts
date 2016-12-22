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
 * 移除多余的空格
 * 
 * @param {string} str
 * @returns {string}
 */
export function removeMultiSpace(str:string):string{
    return str.replace(/\s{2,}/g," ")
}