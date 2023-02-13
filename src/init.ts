import { monksActivateControlsHook } from './hooks/monks-activate-controls';
import { registerSettings } from './settings';
import { _onSearchFilterWrapper, _renderWrapper } from './wrappers/journal-sheet';

export function init() {
    libWrapper?.register<JournalSheet, '_render'>(
        'journal-search',
        'JournalSheet.prototype._render',
        async function (this, wrapped, ...args) {
            await wrapped.call(this, ...args);
            _renderWrapper.call(this, ...args);
        },
        'WRAPPER',
    );

    libWrapper?.register<JournalSheet, '_onSearchFilter'>(
        'journal-search',
        'JournalSheet.prototype._onSearchFilter',
        function (this, wrapped, ...args) {
            wrapped.call(this, ...args);
            _onSearchFilterWrapper.call(this, ...args);
        },
        'WRAPPER',
    );

    Hooks.on('activateControls', monksActivateControlsHook);

    registerSettings();
}

export function reload() {
    init();
}
