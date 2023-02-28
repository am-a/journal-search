import { journalQuery$ } from '../../observables';

export function _onSearchFilterWrapper(
    this: JournalSheet,
    _: InputEvent,
    query: string,
    rgx: RegExp,
    sheetElement: HTMLElement,
) {
    requestAnimationFrame(() => {
        Array.from(sheetElement.querySelectorAll<HTMLElement>('.directory-item'))
            .filter((el) => el.querySelector('.journal-search-preview'))
            .forEach((element) => element.classList.toggle('hidden', false));
    });

    journalQuery$.next({ appId: this.appId, queryRegEx: query?.length ? rgx : null });
}
