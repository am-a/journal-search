import { PageQueryMatches } from './types';

export const getPageMatches = (pageElement: HTMLElement, queryRegEx: RegExp): PageQueryMatches => {
    const treeWalker = document.createTreeWalker(pageElement, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => (node.textContent?.match(/\w/) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
    });

    const nodeMatches = new Map<Text, { matches: [number, number][] }>();

    let nodeMatch: RegExpExecArray | null = null;
    let nextNode: Text | null = null;

    const globalRegEx = new RegExp(queryRegEx.source, 'gdi');

    while ((nextNode = treeWalker.nextNode() as Text)) {
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
