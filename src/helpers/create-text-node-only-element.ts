export const createTextNodeOnlyElement = (targetElement: HTMLElement): DocumentFragment => {
    const nodes = new Set<Node>();

    const treeWalker = document.createTreeWalker(targetElement, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => (node.nodeType === node.TEXT_NODE ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
    });

    let nextNode: Text | null = null;

    while ((nextNode = treeWalker.nextNode() as Text)) {
        nextNode?.parentNode?.nodeName.toLowerCase() === 'mark' ? nodes.add(nextNode.parentNode) : nodes.add(nextNode);
    }

    const element = document.createDocumentFragment();
    element.append(...nodes.map((node) => node.cloneNode(true)).values());

    return element;
};
