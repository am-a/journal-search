export const createPreviewsFromPageQueryMarkup = (pageTextWithMarks: DocumentFragment, previewCount = 3) => {
    const element = document.createDocumentFragment();

    const matches = Array.from(pageTextWithMarks.querySelectorAll('mark'));

    const previewNodes = matches.slice(0, previewCount).map((_, i) => {
        const previewNode = document.createElement('div');
        previewNode.classList.add('journal-search-preview', 'journal-search-result');
        previewNode.dataset.resultIndex = i.toString();

        previewNode.append(...pageTextWithMarks.cloneNode(true).childNodes);
        previewNode.querySelectorAll('mark')[i]?.classList.toggle('active', true);

        return previewNode;
    });

    if (matches.length > 3) {
        const previewNode = document.createElement('div');
        previewNode.classList.add('journal-search-preview', 'journal-search-more');
        previewNode.append(`... ${matches.length - 3} more not shown ...`);

        previewNodes.push(previewNode);
    }

    element.append(...previewNodes);

    return element;
};
