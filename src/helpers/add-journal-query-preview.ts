import { JournalSearchSettingsNoNS } from '../types';

export const addJournalQueryPreview =
    (
        TOCFromRender: Map<string, HTMLElement>,
        contentFromRender: Map<string, HTMLElement>,
        sheet: JournalSheet,
        settings: JournalSearchSettingsNoNS | null,
    ) =>
    (pagePreview: DocumentFragment, pageId: string) => {
        const pageTOCElement = TOCFromRender.get(pageId);

        if (!pageTOCElement) {
            return;
        }

        // Remove all the journal search preview elements
        pageTOCElement.querySelectorAll('.journal-search-preview').forEach((previewElement) => previewElement.remove());

        if (pagePreview.hasChildNodes()) {
            pageTOCElement.append(pagePreview.cloneNode(true));
            pageTOCElement.classList.toggle('hidden', false);

            requestAnimationFrame(() => {
                pageTOCElement.querySelectorAll('mark.active').forEach((queryMatchMarkElement) =>
                    queryMatchMarkElement.scrollIntoView({
                        block: 'center',
                        inline: 'center',
                    }),
                );

                pageTOCElement
                    .querySelectorAll<HTMLElement>('.journal-search-preview.journal-search-result')
                    .forEach((previewElement, markIndex) => {
                        const renderedPage = contentFromRender.get(pageId);
                        const targetMark = renderedPage?.querySelectorAll('mark')[markIndex];

                        const onPreviewClick = () => {
                            if (!renderedPage) {
                                void sheet.goToPage(pageId);
                                return;
                            }

                            targetMark?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                                inline: 'center',
                            });
                        };

                        previewElement.addEventListener('click', onPreviewClick);

                        if (settings?.['highlight-page-matches-on-hover']) {
                            previewElement.addEventListener('mouseover', () => {
                                renderedPage?.classList.add('mark-active');
                                targetMark?.classList.add('active');
                            });
                            previewElement.addEventListener('mouseout', () => {
                                renderedPage?.classList.remove('mark-active');
                                targetMark?.classList.remove('active');
                            });
                        }
                    });
            });
        }
    };
