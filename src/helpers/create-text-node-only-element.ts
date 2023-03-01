export const createTextNodeOnlyElement = (targetElement: HTMLElement): DocumentFragment => {
    const nodes = [];

    const treeWalker = document.createTreeWalker(
        targetElement.cloneNode(true),
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        (node) =>
            node.nodeName.toLowerCase() === 'mark' ||
            (node.nodeType === node.TEXT_NODE && node.parentNode?.nodeName.toLowerCase() !== 'mark')
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP,
    );

    let nextNode: Node | null = null;

    const element = document.createDocumentFragment();

    while ((nextNode = treeWalker.nextNode() as Node)) {
        nodes.push(nextNode);
    }

    element.append(...nodes);

    // empty nodes array
    nodes.length = 0;

    return element;
};
