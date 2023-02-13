import { monksActivateControlsHook } from './hooks/monks-activate-controls';
import { updateJournalEntriesOnQuery } from './in-journal-search';
import { registerSettings } from './settings';
import { updateSidebarEntriesOnQuery } from './sidebar-search';
import { _onSearchFilterWrapper as _onSearchWrapperJournal, _renderWrapper } from './wrappers/journal-sheet';
import {
    _onSearchFilterWrapper as _onSearchSidebar,
    _renderWrapper as _renderWrapperSidebar,
} from './wrappers/journal-sidebar-directory';

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
            _onSearchWrapperJournal.call(this, ...args);
        },
        'WRAPPER',
    );

    libWrapper?.register<JournalDirectory, '_render'>(
        'journal-search',
        'JournalDirectory.prototype._render',
        async function (this, wrapped, ...args) {
            await wrapped.call(this, ...args);
            _renderWrapperSidebar.call(this, ...args);
        },
        'WRAPPER',
    );

    libWrapper?.register<JournalDirectory, '_onSearchFilter'>(
        'journal-search',
        'JournalDirectory.prototype._onSearchFilter',
        function (this, wrapped, ...args) {
            wrapped.call(this, ...args);
            _onSearchSidebar.call(this, ...args);
        },
        'WRAPPER',
    );

    Hooks.on('activateControls', monksActivateControlsHook);

    registerSettings();

    updateJournalEntriesOnQuery();

    updateSidebarEntriesOnQuery();
}

export function reload() {
    init();
}
