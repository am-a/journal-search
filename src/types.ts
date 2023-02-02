export interface PageQueryMatches {
    pageElement: HTMLElement;
    pageMatches: Map<Text, { matches: [number, number][] }>;
    queryRegEx: RegExp;
}
