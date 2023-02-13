declare module '*.scss';

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
    unregister_all(name: string): void;
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
        content?: string | undefined;
        markdown: string;
    };
    video: unknown;
    src: unknown;
    flags: unknown;
}

class JournalEntry extends ClientDocumentMixin(foundry.documents.BaseJournalEntry) {
    pages: DocumentCollection<JournalPageData, 'pages'>;
}

declare class JournalSheet<Options extends JournalSheetOptions = JournalSheetOptions> extends DocumentSheet<
    Options,
    ConcreteJournalEntry
> {
    mode: unknown;
    pageIndex: string;

    object: JournalEntry;

    goToPage(pageId: string, anchor?: unknown): void | Promise<void>;

    // Private members not in types
    _onClickPageLink(evt: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>): void;
    _onSearchFilter(_: InputEvent, query: string, rgx: RegExp, html: HTMLElement): void;
    _pages: Record<string, JournalPageData>;
    _render(force: boolean, options: unknown): Promise<void>;
    _renderPageViews(html: JQuery<HTMLElement>, toc: unknown): Promise<void>;
}

declare class JournalDirectory<
    Options extends SidebarDirectory.Options = SidebarDirectory.Options,
> extends SidebarDirectory<'JournalEntry', Options> {
    _render(force: boolean, options: unknown): Promise<void>;
    _onSearchFilter(_: InputEvent, query: string, rgx: RegExp, html: HTMLElement): void;
}

declare class EnhancedJournal {
    appId: number;
    searchText(query: string): void;

    object: {
        apps: Record<string, JournalSheet>;
    };
}

declare namespace ClientSettings {
    interface Values {
        'journal-search.enable-monks-enhanced-journal-compatibility': boolean;
        'journal-search.highlight-page-matches-on-hover': boolean;
        'journal-search.mark-background-colour': string;
        'journal-search.mark-foreground-colour': string;
        'journal-search.sidebar-page-title-text-colour': string;
        'journal-search.sidebar-page-title-underline-colour': string;
    }
}

type JournalSearchSettingsKeys = {
    [_ in keyof JournalSearchSettings]: _ extends `journal-search.${infer K}` ? K : never;
}[keyof JournalSearchSettings];

declare interface Window {
    Ardittristan: {
        ColorSetting: any;
    };
}
