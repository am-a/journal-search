import { Observable } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { createPreviewsFromPageQueryMarkup } from './create-previews-from-page-query-markup';
import { createTextNodeOnlyElement } from './create-text-node-only-element';
import { filterAppId } from './filter-app-id';
import { getElementQueryMatches } from './get-page-matches';
import { mapMap } from './map-map';
import { surroundMatchesWithMarks } from './surround-matches-with-marks';

type QueryObservable = Observable<{ appId: number; queryRegEx: RegExp | null }>;
type RenderObservable = Observable<{ appId: number; sheet: unknown }>;

export const getQueryObservableDefault =
    <Q extends QueryObservable, R extends RenderObservable>(query$: Q, render$: R) =>
    <T extends { appId: number; contentFromData: Map<string, HTMLSlotElement> }>({
        appId,
        contentFromData,
        ...rest
    }: T) =>
        query$.pipe(
            filterAppId(appId),
            distinctUntilChanged(
                ({ queryRegEx: prevQueryRegEx }, { queryRegEx: nextQueryRegEx }) =>
                    prevQueryRegEx?.source === nextQueryRegEx?.source,
            ),
            map(({ queryRegEx }) => {
                const queryMatches =
                    queryRegEx &&
                    mapMap(contentFromData, (pageElement) => getElementQueryMatches(pageElement, queryRegEx));

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
            takeUntil(render$.pipe(filterAppId(appId))),
        );
