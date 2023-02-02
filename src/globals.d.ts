declare interface RegExpExecArray {
    indices?: [number, number][];
}

declare interface LibWrapper {
    register<T, K extends keyof T>(
        name: string,
        path: `${string}.prototype.${K}`,
        wrapper: (this: T, wrapped: T[K], ...args: Parameters<T[K]>) => ReturnType<T[K]>,
        mode: 'WRAPPER' | 'MIXED' | 'OVERRIDE',
    );
}

declare const libWrapper: LibWrapper;

declare interface JournalPageData {
    _id: string;
    sort: number;
    name: string;
    type: string;
    title: {
        show: boolean;
        level: number;
    };
    image: unknown;
    text: {
        format: number;
        content: string;
        markdown: string;
    };
    video: unknown;
    src: unknown;
    flags: unknown;
}

declare class JournalSheet<Options extends JournalSheetOptions = JournalSheetOptions> extends DocumentSheet<
    Options,
    ConcreteJournalEntry
> {
    goToPage(pageId: string, anchor?: unknown): void | Promise<void>;
    pageIndex: string;
    object: {
        pages: DocumentCollection<JournalPageData, 'pages'>;
    };

    // Added by module
    _targetAnchorIndex?: number;

    // Private members not in types
    _pages: Record<string, JournalPageData>;
    _onSearchFilter(_: InputEvent, query: string, rgx: RegExp, html: HTMLElement): void;
    _onClickPageLink(evt: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>): void;
}
