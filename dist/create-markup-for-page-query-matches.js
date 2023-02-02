"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkupForPageQueryMatches = void 0;
const createMarkupForPageQueryMatches = ({ pageElement, pageMatches }) => {
    Array.from(pageMatches).forEach(([element, { matches }]) => {
        matches.reduce(([currentElement, offset], [start, end]) => {
            const matchNode = currentElement.splitText(start - offset);
            const nextElement = matchNode.splitText(end - start);
            const range = pageElement.ownerDocument.createRange();
            range.setStart(matchNode, 0);
            range.setEndAfter(matchNode);
            range.surroundContents(document.createElement('mark'));
            return [nextElement, end];
        }, [element, 0]);
    });
    return pageElement;
};
exports.createMarkupForPageQueryMatches = createMarkupForPageQueryMatches;
//# sourceMappingURL=create-markup-for-page-query-matches.js.map