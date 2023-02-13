export const createJournalSearchStyleTag = () => {
    const newStyleTag = document.createElement('style');
    newStyleTag.id = 'journal-search-style-tag';
    document.head.appendChild(newStyleTag);
    return newStyleTag;
};
