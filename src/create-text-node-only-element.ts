export const createTextNodeOnlyElement = (targetElement: HTMLElement) => {
    const nodes = new Set<Node>();

    const treeWalker = document.createTreeWalker(targetElement, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            if (node.nodeType === node.TEXT_NODE) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        },
    });

    let nextNode: Text | null = null;

    while ((nextNode = treeWalker.nextNode() as Text)) {
        nextNode?.parentNode?.nodeName.toLowerCase() === 'mark' ? nodes.add(nextNode.parentNode) : nodes.add(nextNode);
    }

    const slotElement = document.createElement('slot');
    slotElement.replaceChildren(...Array.from(nodes).map((node) => node.cloneNode(true)));
    slotElement.normalize();

    return slotElement;
};
