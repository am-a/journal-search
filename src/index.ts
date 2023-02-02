import { _onSearchFilter } from './on-search-filter';

Hooks.once('init', () => {
    libWrapper?.register<JournalSheet, '_onSearchFilter'>(
        'journal-search',
        'JournalSheet.prototype._onSearchFilter',
        function (this, wrapped, ...args) {
            wrapped.call(this, ...args);
            _onSearchFilter.call(this, ...args);
            return;
        },
        'WRAPPER',
    );
});
