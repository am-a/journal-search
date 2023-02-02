"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const on_search_filter_1 = require("./on-search-filter");
Hooks.once('init', () => {
    libWrapper?.register('journal-search', 'JournalSheet.prototype._onSearchFilter', function (wrapped, ...args) {
        wrapped.call(this, ...args);
        on_search_filter_1._onSearchFilter.call(this, ...args);
        return;
    }, 'WRAPPER');
});
//# sourceMappingURL=index.js.map