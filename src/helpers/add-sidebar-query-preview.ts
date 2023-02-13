import { JournalSearchSettingsNoNS } from '../types';

export const addSidebarQueryPreview =
    ({
        pageDataMap,
        sidebarFromRender,
        sheet,
    }: {
        pageContentFromData: Map<string, HTMLElement>;
        pageDataMap: Map<string, JournalPageData>;
        settings: JournalSearchSettingsNoNS | null;
        sheet: JournalDirectory;
        sidebarFromRender: Map<string, HTMLElement>;
    }) =>
    (pagePreview: DocumentFragment, pageId: string, entryId: string) => {
        const sidebarNode = sidebarFromRender.get(entryId);
        const journalEntrySheet = sheet.documents.find((doc) => doc.id === entryId)?.sheet;

        const renderPageSheet = async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            await journalEntrySheet?.render(true, { pageId } as any);
        };

        if (sidebarNode && pagePreview.hasChildNodes()) {
            // Create a container for the preview
            const containerNode = document.createElement('div');
            containerNode.classList.add('journal-search-preview-container');

            const titleNode = document.createElement('div');
            titleNode.classList.add('journal-search-preview-page-title');
            titleNode.innerText = pageDataMap.get(pageId)?.name ?? 'unknown';
            titleNode.addEventListener('click', () => void renderPageSheet());

            containerNode.appendChild(titleNode);
            containerNode.appendChild(pagePreview.cloneNode(true));

            // Add the container to the sidebar result
            sidebarNode.parentElement?.append(containerNode);
            // Make sure result is visible
            sidebarNode.style.removeProperty('display');
            sidebarNode.closest('.directory-item.folder')?.classList.remove('collapsed');

            requestAnimationFrame(() => {
                containerNode.querySelectorAll('mark.active').forEach((queryMatchMarkElement) =>
                    queryMatchMarkElement.scrollIntoView({
                        block: 'center',
                        inline: 'center',
                    }),
                );
                containerNode
                    .querySelectorAll<HTMLElement>('.journal-search-preview.journal-search-result')
                    .forEach((previewElement) => {
                        previewElement.addEventListener('click', () => void renderPageSheet());
                    });
            });
        }
    };
