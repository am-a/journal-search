export const createPreviewsFromPageQueryMarkup = (
    pageWithQueryMarkup: HTMLElement,
    pageElement: HTMLElement,
    onPreviewClicked?: (anchorIndex: number) => Promise<void>,
) => {
    const matches = Array.from(pageWithQueryMarkup.querySelectorAll('mark'));

    matches.slice(0, 3).forEach((_, i) => {
        const $preview = $(`<div class="journal-search-preview journal-search-result" data-result-index="${i}"></div>`)
            .append($(pageWithQueryMarkup).clone().contents())
            .appendTo(pageElement);

        $preview.find('mark').eq(i)[0]?.scrollIntoView({
            inline: 'center',
        });

        $preview.find('mark').each((markOffset, $mark) => {
            $mark.classList.toggle('active', markOffset == i);
        });

        $preview.on('click', () => {
            void onPreviewClicked?.(i);
        });
    });

    if (matches.length > 3) {
        $(pageElement).append(`
          <div class="journal-search-preview journal-search-more">
              ... ${matches.length - 3} more not shown ...
          </div>
      `);
    }
};
