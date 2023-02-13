import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { htmlStringToElement } from './helpers';
import { addSidebarQueryPreview } from './helpers/add-sidebar-query-preview';
import { getQueryObservableDefault } from './helpers/get-query-observable-default';
import { mapElementsToId } from './helpers/map-elements-to-id';
import { mapMap } from './helpers/map-map';
import { journalSearchSettings$, sidebarQuery$, sidebarRender$ } from './observables';

export const updateSidebarEntriesOnQuery = () => {
    sidebarRender$
        .pipe(
            map(({ appId, sheet }) => {
                const entryFromRender = mapElementsToId(sheet.element.find('.journalentry '), 'documentId');

                const pageDataMap = sheet.documents.reduce(
                    (pageMap, entry: JournalEntry) =>
                        new Map<string, JournalPageData>([...pageMap, ...entry.pages.entries()]),
                    new Map<string, JournalPageData>(),
                );

                const contentFromData = mapMap(pageDataMap, ({ text }) => htmlStringToElement(text.content ?? ''));

                return {
                    appId,
                    entryFromRender,
                    contentFromData,
                    pageDataMap,
                    sheet,
                };
            }),
            mergeMap((args) => getQueryObservableDefault(sidebarQuery$, sidebarRender$)(args)),
            withLatestFrom(journalSearchSettings$),
        )
        .subscribe(([{ pagePreviews, sheet, contentFromData, entryFromRender, pageDataMap }, settings]) => {
            if (!pagePreviews) {
                // Remove all the journal search preview elements
                sheet.element.find('.journal-search-preview').remove();
            }

            sheet.element[0]?.querySelectorAll('.journal-search-preview-container').forEach((el) => el.remove());

            pagePreviews?.forEach((pagePreview: DocumentFragment, pageId: string) => {
                const entryId = sheet.documents.find((entry) => entry.pages.has(pageId))?.id;
                if (entryId) {
                    return addSidebarQueryPreview({
                        pageDataMap,
                        sidebarFromRender: entryFromRender,
                        pageContentFromData: contentFromData,
                        settings,
                        sheet,
                    })(pagePreview, pageId, entryId);
                }
            });
        });
};
