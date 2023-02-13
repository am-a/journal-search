import { sidebarRender$ } from '../../observables';

export function _renderWrapper(this: JournalDirectory, _: boolean, __?: unknown) {
    sidebarRender$.next({
        appId: this.appId,
        sheet: this,
    });
}
