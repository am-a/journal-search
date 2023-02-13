import { sidebarQuery$ } from '../../observables';

export function _onSearchFilterWrapper(
    this: JournalDirectory,
    _: InputEvent,
    query: string,
    rgx: RegExp,
    __: HTMLElement,
) {
    sidebarQuery$.next({
        appId: this.appId,
        queryRegEx: query?.length ? rgx : null,
    });
}
