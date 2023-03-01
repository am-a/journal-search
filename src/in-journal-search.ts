import { animationFrameScheduler } from 'rxjs';
import { map, mergeMap, observeOn, switchMap, withLatestFrom } from 'rxjs/operators';

import { htmlStringToElement } from './helpers';
import { addJournalQueryPreview } from './helpers/add-journal-query-preview';
import { getQueryObservableDefault } from './helpers/get-query-observable-default';
import { getQueryObservableMonks } from './helpers/get-query-observable-monks';
import { mapElementsToId } from './helpers/map-elements-to-id';
import { mapMap } from './helpers/map-map';
import { isMonksEnhancedJournalEnabled } from './helpers/monks-enhanced-compatibility';
import { journalQuery$, journalRender$, journalSearchSettings$ } from './observables';

export const updateJournalEntriesOnQuery = () =>
    journalRender$
        .pipe(
            map(({ appId, sheet }) => {
                const contentFromRender = mapElementsToId(sheet.element.find('.journal-entry-page'), 'pageId', (el) =>
                    el.querySelector<HTMLElement>('.journal-page-content'),
                );

                const TOCFromRender = mapElementsToId(sheet.element.find('.directory-item'), 'pageId');

                const pageDataMap = sheet.object.pages.reduce(
                    (pageMap, page: JournalPageData) =>
                        new Map<string, JournalPageData>([...pageMap, [page._id, page]]),
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
                journalSearchSettings$.pipe(
                    switchMap((settings) =>
                        !isMonksEnhancedJournalEnabled() || !settings?.['enable-monks-enhanced-journal-compatibility']
                            ? getQueryObservableDefault(journalQuery$, journalRender$, 'journal')(args)
                            : getQueryObservableMonks(args),
                    ),
                ),
            ),
            withLatestFrom(journalSearchSettings$),
            observeOn(animationFrameScheduler),
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

                pagePreviews?.forEach(addJournalQueryPreview(TOCFromRender, contentFromRender, sheet, settings));
            },
        );
