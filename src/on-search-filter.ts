import { createMarkupForPageQueryMatches } from './create-markup-for-page-query-matches';
import { createPreviewsFromPageQueryMarkup } from './create-previews-from-page-query-markup';
import { getPageMatches } from './get-page-matches';

const createPageContentElement = (pageContent: string) => {
    const element = document.createElement('slot');
    element.innerHTML = pageContent;
    return element;
};

export function _onSearchFilter(this: JournalSheet, _: InputEvent, query: string, rgx: RegExp, html: HTMLElement) {
    const scrollToTargetAnchor = () => {
        if (this._targetAnchorIndex != null) {
            this.element[0]?.querySelectorAll('.journal-page-content mark')[this._targetAnchorIndex]?.scrollIntoView();
            this._targetAnchorIndex = undefined;
        }
    };

    Array.from(html.querySelectorAll<HTMLElement>('.directory-item')).forEach((el) => {
        $('.journal-search-preview', el).remove();

        if (!el.dataset.pageId) {
            return;
        }

        const page = this.object.pages.get(el.dataset.pageId) as JournalPageData | undefined;

        if (!page || !query) {
            return;
        }

        const pageElement = createPageContentElement(page.text.content);
        const pageMatches = getPageMatches(pageElement, rgx);

        const pageWithQueryMarkup = createMarkupForPageQueryMatches(pageMatches);

        // If not already hidden, might be matching page title?
        const isMatched = !el.classList.contains('hidden') || pageMatches.pageMatches.size >= 1;
        el.classList.toggle('hidden', !isMatched);

        const currentPageId = this._pages[this.pageIndex]?._id;

        if (currentPageId === page._id) {
            // replace markup here
            this.element[0]
                ?.querySelector('.journal-page-content')
                ?.replaceChildren(...(pageWithQueryMarkup.cloneNode(true) as HTMLElement).children);

            scrollToTargetAnchor();
        }

        createPreviewsFromPageQueryMarkup(pageWithQueryMarkup, el, async (anchorIndex) => {
            this._targetAnchorIndex = anchorIndex;
            if (currentPageId !== page._id) {
                await this.goToPage(page._id);
            } else {
                scrollToTargetAnchor();
            }
        });
    });
}
