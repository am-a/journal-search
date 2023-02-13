// function to create a map of elements to id from a query, using the dataset id on each element
export const mapElementsToId = (
    elements: NodeListOf<HTMLElement> | JQuery<HTMLElement>,
    datasetKey: string,
    subSelector?: (el: HTMLElement) => HTMLElement | null,
): Map<string, HTMLElement> =>
    Array.from(elements).reduce((elementMap, element) => {
        const contentElement = subSelector?.(element) ?? element;
        const elementId = element?.dataset[datasetKey];
        return contentElement && elementId ? elementMap.set(elementId, contentElement) : elementMap;
    }, new Map<string, HTMLElement>());
