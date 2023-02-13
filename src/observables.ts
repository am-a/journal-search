import { BehaviorSubject, Subject } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { htmlStringToElement } from './helpers';
import { addQueryPreview } from './helpers/add-query-preview';
import { getQueryObservableDefault } from './helpers/get-query-observable-default';
import { getQueryObservableMonks } from './helpers/get-query-observable-monks';
import { mapElementsToId } from './helpers/map-elements-to-id';
import { mapMap } from './helpers/map-map';
import { JournalSearchSettingsNoNS } from './types';

export const journalSearchSettings$ = new BehaviorSubject<JournalSearchSettingsNoNS | null>(null);

export const journalRender$ = new Subject<{ appId: number; sheet: JournalSheet }>();
export const journalQuery$ = new Subject<{ appId: number; queryRegEx: RegExp | null }>();

// Support monks-enhanced-journal
export const monksQuery$ = new Subject<{ appId: number; query: string | null }>();

const isMonksEnhancedJournalEnabled = () => {
    const isActive = (game as Game).modules.get('monks-enhanced-journal')?.active ?? false;
    return isActive;
};

journalRender$
    .pipe(
        map(({ appId, sheet }) => {
            const contentFromRender = mapElementsToId(sheet.element.find('.journal-entry-page'), 'pageId', (el) =>
                el.querySelector<HTMLElement>('.journal-page-content'),
            );

            const TOCFromRender = mapElementsToId(sheet.element.find('.directory-item'), 'pageId');

            const pageDataMap = sheet.object.pages.reduce(
                (pageMap, page: JournalPageData) => new Map<string, JournalPageData>([...pageMap, [page._id, page]]),
                new Map<string, JournalPageData>(),
            );

            const contentFromData = mapMap(pageDataMap, ({ text }) => htmlStringToElement(text.content ?? ''));

            return {
                appId,
                contentFromRender,
                contentFromData,
                TOCFromRender,
                pageDataMap,
                sheet,
            };
        }),
        mergeMap((args) =>
            !isMonksEnhancedJournalEnabled() ? getQueryObservableDefault(args) : getQueryObservableMonks(args),
        ),
        withLatestFrom(journalSearchSettings$),
    )
    .subscribe(
        ([{ contentMarked, contentFromData, contentFromRender, pagePreviews, TOCFromRender, sheet }, settings]) => {
            contentFromRender.forEach((renderedContent, pageId) => {
                const content = contentFromData.get(pageId);
                const contentWithMarkup = contentMarked?.get(pageId);

                const contentChildren =
                    (contentWithMarkup?.hasChildNodes()
                        ? contentWithMarkup.cloneNode(true).childNodes
                        : content?.cloneNode(true).childNodes) ?? renderedContent.childNodes;

                renderedContent.replaceChildren(...contentChildren);
            });

            if (!pagePreviews) {
                // Remove all the journal search preview elements
                sheet.element.find('.journal-search-preview').remove();
            }

            pagePreviews?.forEach(addQueryPreview(TOCFromRender, contentFromRender, sheet, settings));
        },
    );

const createStyleTag = () => {
    const newStyleTag = document.createElement('style');
    newStyleTag.id = 'journal-search-style-tag';
    document.head.appendChild(newStyleTag);
    return newStyleTag;
};

journalSearchSettings$.subscribe((settings) => {
    console.log('Journal Search settings changed', settings);

    if (settings) {
        // Add a style tag if it doesn't exist that will set the color variables on the root element
        const styleTag = document.querySelector<HTMLStyleElement>('#journal-search-style-tag') ?? createStyleTag();

        styleTag.innerHTML = `
            :root {
                --journal-search-highlight-fg: ${settings['mark-foreground-colour'] ?? 'marktext'};
                --journal-search-highlight-bg: ${settings['mark-background-colour'] ?? 'mark'};

                --journal-search-highlight-monks-fg: ${settings['mark-foreground-colour'] ?? 'marktext'};
                --journal-search-highlight-monks-bg: ${settings['mark-background-colour'] ?? 'mark'};                
            }
        `;
    }
});
