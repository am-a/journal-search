import { ElementQueryMatches, TextNodeMatch } from '../types';

export const getElementQueryMatches = (element: HTMLElement, queryRegEx: RegExp): ElementQueryMatches => {
    const markedElement = element.cloneNode(true) as HTMLElement;

    const treeWalker = document.createTreeWalker(markedElement, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => (node.textContent?.match(/\w/) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
    });

    const textNodeMatches = new Map<Text, TextNodeMatch>();

    let nodeMatch: RegExpExecArray | null = null;
    let nextNode: Text | null = null;
    let matchIndex = 0;

    const globalRegEx = new RegExp(queryRegEx.source, 'gdi');

    while ((nextNode = treeWalker.nextNode() as Text)) {
        while ((nodeMatch = globalRegEx.exec(nextNode.textContent ?? ''))) {
            if (!textNodeMatches.get(nextNode)) {
                textNodeMatches.set(nextNode, { matchOffsets: [], matchIndex, node: nextNode });
            }

            if (nodeMatch.indices) {
                textNodeMatches.get(nextNode)?.matchOffsets.push(...nodeMatch.indices);
            }

            matchIndex = matchIndex + 1;
        }
    }

    return {
        element: markedElement,
        matches: textNodeMatches,
        queryRegEx,
    };
};
