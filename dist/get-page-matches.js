"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageMatches = void 0;
const getPageMatches = (pageElement, queryRegEx) => {
    const treeWalker = document.createTreeWalker(pageElement, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => (node.textContent?.match(/\w/) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
    });
    const nodeMatches = new Map();
    let nodeMatch = null;
    let nextNode = null;
    const globalRegEx = new RegExp(queryRegEx.source, 'gdi');
    while ((nextNode = treeWalker.nextNode())) {
        while ((nodeMatch = globalRegEx.exec(nextNode.textContent ?? ''))) {
            if (!nodeMatches.get(nextNode)) {
                nodeMatches.set(nextNode, { matches: [] });
            }
            if (nodeMatch.indices) {
                nodeMatches.get(nextNode)?.matches.push(...nodeMatch.indices);
            }
        }
    }
    return {
        pageElement,
        pageMatches: nodeMatches,
        queryRegEx,
    };
};
exports.getPageMatches = getPageMatches;
//# sourceMappingURL=get-page-matches.js.map