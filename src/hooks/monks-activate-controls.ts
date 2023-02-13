import { monksQuery$ } from '../observables';

export function monksActivateControlsHook(
    sheet: EnhancedJournal,
    controls: { id?: string; callback: (...args: unknown[]) => unknown }[],
) {
    type SearchControlEvent = JQuery.TriggeredEvent<HTMLInputElement, undefined, HTMLElement, HTMLElement>;

    const searchControl = controls.find((control) => control.id === 'search') as
        | { id: string; callback: (...args: [query: string, evt: SearchControlEvent]) => void }
        | undefined;

    const appId = Object.values(sheet.object.apps)[0]?.appId;

    if (searchControl && appId) {
        // Patch the search control to log the search query
        searchControl.callback = new Proxy(searchControl.callback, {
            apply(target, thisArg, args) {
                Reflect.apply(target, thisArg, args);
                monksQuery$.next({
                    appId,
                    query: args[0],
                });
            },
        });
    }
}
