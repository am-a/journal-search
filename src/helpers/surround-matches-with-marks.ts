import { ElementQueryMatches } from '../types';

export const surroundMatchesWithMarks = ({ element: pageElement, matches }: ElementQueryMatches) => {
    const matchHTML = Array.from(matches).map(([textNode, { matchOffsets }]) =>
        matchOffsets.reduce(
            ([currentText, offset], [start, end]) => {
                const [startOffset, endOffset] = [start + offset, end + offset];
                const [startText, matchText, endText] = [
                    currentText.slice(0, startOffset),
                    currentText.slice(startOffset, endOffset),
                    currentText.slice(endOffset),
                ];

                const nodeHTML = `${startText}<mark class="journal-search">${matchText}</mark>${endText}`;
                return [nodeHTML, offset + 36] as [string, number];
            },
            [textNode.textContent, 0] as [string, number],
        ),
    );

    Array.from(matches).forEach(([textNode], i) => {
        const newElement = document.createElement('ins');
        newElement.classList.add('journal-search-markup');
        const match = matchHTML[i];
        if (match) {
            newElement.innerHTML = match[0];
            textNode.replaceWith(newElement);
        }
    });

    return pageElement;
};
