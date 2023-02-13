import { distinctUntilKeyChanged, map, takeUntil } from 'rxjs';

import { journalRender$, monksQuery$ } from '../observables';
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
    monksQuery$.pipe(
        filterAppId(appId),
        distinctUntilKeyChanged('query'),
        map(() => {
            const contentMarked = contentFromRender;

            const pagePreviews = mapMap(contentFromRender, (el) =>
                createPreviewsFromPageQueryMarkup(createTextNodeOnlyElement(el)),
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
    );
