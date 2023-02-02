import { PageQueryMatches } from './types';

export const createMarkupForPageQueryMatches = ({ pageElement, pageMatches }: PageQueryMatches) => {
    Array.from(pageMatches).forEach(([element, { matches }]) => {
        matches.reduce(
            ([currentElement, offset], [start, end]) => {
                const matchNode = currentElement.splitText(start - offset);
                const nextElement = matchNode.splitText(end - start);
                const range = pageElement.ownerDocument.createRange();
                range.setStart(matchNode, 0);
                range.setEndAfter(matchNode);
                range.surroundContents(document.createElement('mark'));
                return [nextElement, end] as [Text, number];
            },
            [element, 0] as [Text, number],
        );
    });

    return pageElement;
};
