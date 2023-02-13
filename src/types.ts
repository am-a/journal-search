export interface TextNodeMatch {
    matchIndex: number; // relative to entire match
    node: Text;
    matchOffsets: [start: number, end: number][]; // Each match within this text node
}

export interface ElementQueryMatches {
    element: HTMLElement;
    matches: Map<Text, TextNodeMatch>;
    queryRegEx: RegExp;
}

export interface JournalTOCRender {
    appId: number;
    pageId: string;
    tocElement: HTMLElement;
}

export interface JournalPageContentRender {
    appId: number;
    pageContentElement: HTMLElement;
    pageId: string;
}

export interface MatchPreviewSelect {
    appId: number;
    pageId: string;
    markIndex: number;
}

export interface MatchPreviewHover {
    appId: number;
    isActive: boolean;
    markIndex: number;
    pageId: string;
}

export type JournalSearchSettings = {
    [_ in keyof ClientSettings.Values as _ extends `journal-search.${string}` ? _ : never]: ClientSettings.Values[_];
};

export type JournalSearchSettingsNoNS = {
    [_ in keyof ClientSettings.Values as _ extends `journal-search.${infer K}` ? K : never]: ClientSettings.Values[_];
};

export type JournalSearchSettingsKeys = {
    [_ in keyof JournalSearchSettings]: _ extends `journal-search.${infer K}` ? K : never;
}[keyof JournalSearchSettings];
