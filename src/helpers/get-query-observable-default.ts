import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { journalQuery$, journalRender$ } from '../observables';
import { createPreviewsFromPageQueryMarkup } from './create-previews-from-page-query-markup';
import { createTextNodeOnlyElement } from './create-text-node-only-element';
import { filterAppId } from './filter-app-id';
import { getElementQueryMatches } from './get-page-matches';
import { mapMap } from './map-map';
import { surroundMatchesWithMarks } from './surround-matches-with-marks';

export const getQueryObservableDefault = <
    T extends {
        appId: number;
        contentFromData: Map<string, HTMLSlotElement>;
    },
>({
    appId,
    contentFromData,
    ...rest
}: T) =>
    journalQuery$.pipe(
        filterAppId(appId),
        distinctUntilChanged(
            ({ queryRegEx: prevQueryRegEx }, { queryRegEx: nextQueryRegEx }) =>
                prevQueryRegEx?.source === nextQueryRegEx?.source,
        ),
        map(({ queryRegEx }) => {
            const queryMatches =
                queryRegEx && mapMap(contentFromData, (pageElement) => getElementQueryMatches(pageElement, queryRegEx));

            const contentMarked = queryMatches && mapMap(queryMatches, surroundMatchesWithMarks);

            const pagePreviews =
                contentMarked &&
                mapMap(contentMarked, (el) => createPreviewsFromPageQueryMarkup(createTextNodeOnlyElement(el)));

            return {
                ...rest,
                appId,
                contentFromData,
                contentMarked,
                pagePreviews,
            };
        }),
        takeUntil(journalRender$.pipe(filterAppId(appId))),
    );
