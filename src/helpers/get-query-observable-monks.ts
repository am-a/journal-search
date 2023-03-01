import { debounceTime, distinctUntilKeyChanged, map, switchMap, takeUntil } from 'rxjs/operators';

import { journalRender$, journalSearchSettings$, monksQuery$ } from '../observables';
import { createPreviewsFromPageQueryMarkup } from './create-previews-from-page-query-markup';
import { createTextNodeOnlyElement } from './create-text-node-only-element';
import { filterAppId } from './filter-app-id';
import { mapMap } from './map-map';

export const getQueryObservableMonks = <
    T extends {
        appId: number;
        contentFromRender: Map<string, HTMLElement>;
    },
>({
    appId,
    contentFromRender,
    ...rest
}: T) =>
    journalSearchSettings$.pipe(
        switchMap((settings) =>
            monksQuery$.pipe(
                debounceTime(settings?.['search-preview-debounce'] ?? 0),
                filterAppId(appId),
                distinctUntilKeyChanged('query'),
                map(() => {
                    const contentMarked = contentFromRender;

                    const pagePreviews = mapMap(contentFromRender, (el) =>
                        createPreviewsFromPageQueryMarkup(
                            createTextNodeOnlyElement(el),
                            settings?.['journal-preview-count'],
                        ),
                    );

                    return {
                        ...rest,
                        appId,
                        contentMarked,
                        contentFromRender,
                        pagePreviews,
                    };
                }),
                takeUntil(journalRender$.pipe(filterAppId(appId))),
            ),
        ),
    );
