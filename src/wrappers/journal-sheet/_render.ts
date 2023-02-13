import { journalRender$ } from '../../observables';

export function _renderWrapper(this: JournalSheet, _: boolean, __?: unknown) {
    journalRender$.next({
        appId: this.appId,
        sheet: this,
    });
}
