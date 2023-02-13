import { journalQuery$ } from '../../observables';

export function _onSearchFilterWrapper(
    this: JournalSheet,
    _: InputEvent,
    query: string,
    rgx: RegExp,
    sheetElement: HTMLElement,
) {
    requestAnimationFrame(() => {
        sheetElement
            .querySelectorAll<HTMLElement>(`.directory-item:has(.journal-search-preview)`)
            .forEach((element) => element.classList.toggle('hidden', false));
    });

    journalQuery$.next({ appId: this.appId, queryRegEx: query?.length ? rgx : null });
}
