import { createTextNodeOnlyElement } from './create-text-node-only-element';

export const createPreviewsFromPageQueryMarkup = (
    pageWithQueryMarkup: HTMLElement,
    pageElement: HTMLElement,
    {
        onPreviewClicked,
        onPreviewHover,
        onPreviewHoverEnd,
    }: {
        onPreviewClicked?: (anchorIndex: number) => void | Promise<void>;
        onPreviewHover?: (anchorIndex: number) => void;
        onPreviewHoverEnd?: (anchorIndex: number) => void;
    },
) => {
    const textOnlyElement = createTextNodeOnlyElement(pageWithQueryMarkup);

    const matches = Array.from(textOnlyElement.querySelectorAll('mark'));

    matches.slice(0, 3).forEach((_, i) => {
        const $preview = $(`<div class="journal-search-preview journal-search-result" data-result-index="${i}"></div>`)
            .append($(textOnlyElement).clone().contents())
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

        $preview.on('mouseover', () => {
            void onPreviewHover?.(i);
        });

        $preview.on('mouseout', () => {
            void onPreviewHoverEnd?.(i);
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
