export function htmlStringToElement(htmlString: string) {
    const element = document.createElement('slot');
    if (htmlString) {
        element.innerHTML = htmlString;
    }
    return element;
}
