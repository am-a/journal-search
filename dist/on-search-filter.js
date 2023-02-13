"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._onSearchFilter = void 0;
const observables_1 = require("./observables");
// const scrollToTargetAnchor = () => {
//     if (this._targetAnchorIndex != null) {
//         this.element[0]?.querySelectorAll('.journal-page-content mark')[this._targetAnchorIndex]?.scrollIntoView({
//             block: 'center',
//         });
//         this._targetAnchorIndex = undefined;
//     }
// };
// if (this.mode !== (this.constructor as unknown as { VIEW_MODES: Record<string, unknown> }).VIEW_MODES.SINGLE) {
//     return;
// }
// const hasTextContent = (page: JournalPageData): page is JournalPageData & { text: { content: string } } =>
//     page.text.content != null;
function _onSearchFilter(_, query, rgx, html) {
    if (!query) {
        return;
    }
    observables_1.searchQuery$.next(rgx);
    // const pages = this.object.pages;
    // const pageElements = (pages.contents as JournalPageData[])
    //     .filter(hasTextContent)
    //     .map((page) => htmlStringToElement(page.text.content));
    // const pageQueryMatches = pageElements.map((pageElement) => getElementQueryMatches(pageElement, rgx));
    // console.log(pageQueryMatches);
    // Array.from(html.querySelectorAll<HTMLElement>('.directory-item')).forEach((el) => {
    //     $('.journal-search-preview', el).remove();
    //     if (!el.dataset.pageId) {
    //         return;
    //     }
    //     const page = this.object.pages.get(el.dataset.pageId) as JournalPageData | undefined;
    //     if (!page || !query) {
    //         return;
    //     }
    //     const pageElement = htmlStringToElement(page.text.content!);
    //     const pageMatches = getElementQueryMatches(pageElement, rgx);
    //     // MUTATES
    //     const pageWithMatchMarkup = surroundMatchesWithMarks(pageMatches);
    //     // If not already hidden, might be matching page title
    //     const isMatched = !el.classList.contains('hidden') || pageMatches.matches.size >= 1;
    //     el.classList.toggle('hidden', !isMatched);
    //     const currentPageId = this._pages[this.pageIndex]?._id;
    //     if (currentPageId === page._id) {
    //         // replace markup here
    //         this.element[0]
    //             ?.querySelector('.journal-page-content')
    //             ?.replaceChildren(...(pageWithMatchMarkup.cloneNode(true) as HTMLElement).children);
    //         // scrollToTargetAnchor();
    //     }
    //     createPreviewsFromPageQueryMarkup(pageWithMatchMarkup, el, {
    //         onPreviewClicked: async (anchorIndex) => {
    //             this._targetAnchorIndex = anchorIndex;
    //             if (currentPageId !== page._id) {
    //                 await this.goToPage(page._id);
    //             } else {
    //                 // scrollToTargetAnchor();
    //             }
    //         },
    //         onPreviewHover: (anchorIndex) => {
    //             $(this.element)
    //                 .find(`.journal-entry-page[data-page-id="${page._id}"] .journal-page-content mark`)
    //                 .each((i, $markEl) => {
    //                     $markEl.classList.toggle('active', i === anchorIndex);
    //                 });
    //         },
    //         onPreviewHoverEnd: () => {
    //             $(this.element).find('.journal-page-content mark').removeClass('active');
    //         },
    //     });
    // });
}
exports._onSearchFilter = _onSearchFilter;
//# sourceMappingURL=on-search-filter.js.map