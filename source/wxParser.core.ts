import { removeEqualSpace, removeMultiSpace, removeAllSpace } from "./wxParser.tool"
import { TEXTNODE, NODESTART, NODEEND, NODECLOSESELF } from "./wxParser.type"

interface NodeResult {
    type: string, match, startTag, attr, startTagName, endSelf, endTagName, index: number, length: number
}
interface TextResult {
    type: string, value: string
}

interface DomDescriptionItf {
    nodeName: string
    attr: { name, value }[]
    children: Array<DomDescriptionItf | string>
}

function isText(obj: NodeResult | TextResult): obj is TextResult {
    return (<TextResult>obj).type == TEXTNODE;
}
class WxDomParser {
    public nodeRegex: RegExp = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>/g
    public attrRegex: RegExp = /[\w\-]+=['"][\s\S]*?['"]/g
    parseStart(htmlStr, optionRegex = this.nodeRegex): DomDescriptionItf {
        let matchResult = this.findAllNodes(htmlStr, optionRegex);
        return this.makeWxTree(matchResult)
    }
    findAllNodes(htmlStr, optionRegex = this.nodeRegex) {
        let result;
        let allMatches: Array<NodeResult | TextResult> = [], nextIndex = 0;
        while (result = optionRegex.exec(htmlStr)) {
            let match = result[0],
                startTag = result[1],
                startTagName = result[2],
                attr = result[3],
                endSelf = result[4],
                endTagName = result[5],
                exp = result[6];
            let index = result.index,
                length = match.length;
            if (index > nextIndex) {
                allMatches.push({
                    type: TEXTNODE,
                    value: htmlStr.slice(nextIndex, index)
                })
            }
            if (exp) {
                allMatches.push({
                    type: TEXTNODE,
                    value: exp
                })
            }
            nextIndex = index + length;
            let type;
            if (startTagName) {
                type = NODESTART;
            } else if (endTagName) {
                type = NODEEND;
            } else {
                type = NODECLOSESELF;
            }
            allMatches.push({
                type, match, attr, startTag, startTagName, endSelf, endTagName, index, length
            })
        }
        return allMatches
    }
    makeWxTree(results: (NodeResult | TextResult)[]) {
        let openTreeList: DomDescriptionItf[] = [{ nodeName: 'ROOT', attr: [], children: [] }];
        for (let i = 0; i < results.length; i++) {
            this.make(results[i], results[i - 1], results[i + 1], openTreeList)
        }
        return openTreeList[0]
    }
    make(result: NodeResult | TextResult, last, next, openTreeList) {
        let tree = openTreeList[openTreeList.length - 1];
        if (isText(result)) {
            if (!isText(last) && !isText(next)) {
                if (removeAllSpace(result.value) !== '') {
                    tree.children.push(
                        { nodeName: TEXTNODE, attr: [], children: [result.value] }
                    );
                }
            } else {
                tree.children.push(
                    { nodeName: TEXTNODE, attr: [], children: [result.value] }
                );
            }
        } else {
            if (result.endTagName) {
                openTreeList.pop()
            } else {
                let nodeName = result.startTagName;
                if (result.endSelf) {
                    tree.children.push(
                        { nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] }
                    )
                } else if (nodeName) {
                    let newOpenTree = { nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] }
                    tree.children.push(newOpenTree);
                    openTreeList.push(newOpenTree)
                }
            }
        }
    }
    getAttributes(attr) {
        let slimAttr = removeMultiSpace(removeEqualSpace(attr));
        let attrArray = [];
        let attrExpression;
        while (attrExpression = this.attrRegex.exec(attr)) {
            let p = attrExpression[0].split('=');
            attrArray.push({
                name: p[0],
                value: p[1].replace(/["']/g, '')
            })
        }
        return attrArray
    }
}

export default new WxDomParser()