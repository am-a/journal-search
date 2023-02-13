import { ElementQueryMatches } from '../types';

const surroundNodeWithMark = (node: Node, parentElement: HTMLElement) => {
    const range = parentElement.ownerDocument.createRange();
    range.setStart(node, 0);
    range.setEndAfter(node);
    const mark = document.createElement('mark');
    mark.classList.add('journal-search');
    range.surroundContents(mark);
};

export const surroundMatchesWithMarks = ({ element: pageElement, matches }: ElementQueryMatches) => {
    Array.from(matches).forEach(([textNode, { matchOffsets }]) => {
        matchOffsets.reduce(
            ([currentNode, offset], [start, end]) => {
                const matchNode = currentNode.splitText(start - offset);
                const nextNode = matchNode.splitText(end - start);
                // TODO - Clone node?
                surroundNodeWithMark(matchNode, pageElement);

                return [nextNode, end] as [Text, number];
            },
            [textNode, 0] as [Text, number],
        );
    });

    return pageElement;
};
