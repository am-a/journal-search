export const isMonksEnhancedJournalEnabled = () => {
    const isActive = (game as Game).modules.get('monks-enhanced-journal')?.active ?? false;
    return isActive;
};
