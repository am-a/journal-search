"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._onSearchFilter = void 0;
const create_markup_for_page_query_matches_1 = require("./create-markup-for-page-query-matches");
const create_previews_from_page_query_markup_1 = require("./create-previews-from-page-query-markup");
const get_page_matches_1 = require("./get-page-matches");
const createPageContentElement = (pageContent) => {
    const element = document.createElement('slot');
    element.innerHTML = pageContent;
    return element;
};
function _onSearchFilter(_, query, rgx, html) {
    const scrollToTargetAnchor = () => {
        if (this._targetAnchorIndex != null) {
            this.element[0]?.querySelectorAll('.journal-page-content mark')[this._targetAnchorIndex]?.scrollIntoView();
            this._targetAnchorIndex = undefined;
        }
    };
    Array.from(html.querySelectorAll('.directory-item')).forEach((el) => {
        $('.journal-search-preview', el).remove();
        const page = this.object.pages.get(el.dataset.pageId);
        if (!page || !query) {
            return;
        }
        const pageElement = createPageContentElement(page.text.content);
        const pageMatches = (0, get_page_matches_1.getPageMatches)(pageElement, rgx);
        const pageWithQueryMarkup = (0, create_markup_for_page_query_matches_1.createMarkupForPageQueryMatches)(pageMatches);
        // If not already hidden, might be matching page title?
        const isMatched = !el.classList.contains('hidden') || pageMatches.pageMatches.size >= 1;
        el.classList.toggle('hidden', !isMatched);
        const currentPageId = this._pages[this.pageIndex]?._id;
        if (currentPageId === page._id) {
            // replace markup here
            this.element[0]
                ?.querySelector('.journal-page-content')
                ?.replaceChildren(...pageWithQueryMarkup.cloneNode(true).children);
            scrollToTargetAnchor();
        }
        (0, create_previews_from_page_query_markup_1.createPreviewsFromPageQueryMarkup)(pageWithQueryMarkup, el, async (anchorIndex) => {
            this._targetAnchorIndex = anchorIndex;
            if (currentPageId !== page._id) {
                await this.goToPage(page._id);
            }
            else {
                scrollToTargetAnchor();
            }
        });
    });
}
exports._onSearchFilter = _onSearchFilter;
//# sourceMappingURL=on-search-filter.js.map