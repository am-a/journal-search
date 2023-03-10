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
        const journalEntrySheet = sheet.documents.find((doc) => doc.id === entryId)?.sheet as unknown as
            | JournalSheet
            | undefined;

        const renderPageSheet = () => {
            journalEntrySheet?.render(true, { pageId } as Application.RenderOptions<JournalSheetOptions>);
        };

        // TODO - Improve horrible typing
        const pageSheet = journalEntrySheet?.getPageSheet(pageId) as
            | DocumentSheet<
                  DocumentSheetOptions<foundry.abstract.Document<foundry.abstract.DocumentData<never, never>>>
              >
            | undefined;

        const canView = pageSheet?.object.testUserPermission(
            (game as Game & { user: User }).user,
            pageSheet.options.viewPermission,
        );

        if (canView && sidebarNode && pagePreview.hasChildNodes()) {
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
            const folderNode = sidebarNode.closest<HTMLElement>('.directory-item.folder');
            folderNode?.classList.remove('collapsed');
            folderNode?.style.removeProperty('display');

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
