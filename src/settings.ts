/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createJournalSearchStyleTag } from './helpers/create-style-tag';
import { journalSearchSettings$ } from './observables';
import { JournalSearchSettingsKeys, JournalSearchSettingsNoNS } from './types';

const register = <
    K extends JournalSearchSettingsKeys,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    O extends ClientSettings.Values[`journal-search.${K}`] extends string | number | boolean | object | any[] | null
        ? InexactPartial<Omit<SettingConfig<ClientSettings.Values[`journal-search.${K}`]>, 'key' | 'namespace'>>
        : InexactPartial<Omit<SettingConfig<unknown>, 'key' | 'namespace'>>,
>(
    name: K,
    options: O,
) => (game as Game).settings.register('journal-search', name, options);

export const getGameSetting = <K extends JournalSearchSettingsKeys>(name: K) =>
    (game as Game).settings.get('journal-search', name);

const getDefaultMarkColours = () => {
    const mark = document.createElement('mark');
    mark.style.display = 'none';
    document.body.appendChild(mark);
    const { backgroundColor, color } = window.getComputedStyle(mark);
    document.body.removeChild(mark);
    return {
        backgroundColor,
        color,
    };
};

export function registerSettings() {
    register('highlight-page-matches-on-hover', {
        default: true,
        hint: 'Hovering over a page in the search results will highlight corresponding matches on the page',
        name: 'Highlight Page Matches on Hover',
        scope: 'client',
        type: Boolean,
        config: true,
        onChange: (value: boolean) =>
            journalSearchSettings$.next({
                ...(journalSearchSettings$.getValue() as JournalSearchSettingsNoNS),
                'highlight-page-matches-on-hover': value,
            }),
    });

    register('enable-monks-enhanced-journal-compatibility', {
        default: true,
        hint: 'If Monks Enhanced Journal is installed, this will enable compatibility with it',
        name: 'Enable Monks Enhanced Journal Compatibility',
        scope: 'client',
        type: Boolean,
        config: true,
        onChange: (value: boolean) =>
            journalSearchSettings$.next({
                ...(journalSearchSettings$.getValue() as JournalSearchSettingsNoNS),
                'enable-monks-enhanced-journal-compatibility': value,
            }),
    });

    const { backgroundColor, color } = getDefaultMarkColours();

    new window.Ardittristan.ColorSetting('journal-search', 'mark-background-colour', {
        name: 'Search Result Background Colour', // The name of the setting in the settings menu
        hint: 'Background colour for search result highlighted terms', // A description of the registered setting and its behavior
        label: 'Background Colour', // The text label used in the button
        restricted: false, // Restrict this setting to gamemaster only?
        defaultColor: backgroundColor, // The default color of the setting
        scope: 'client', // The scope of the setting
        onChange: (value: string) => {
            journalSearchSettings$.next({
                ...(journalSearchSettings$.getValue() as JournalSearchSettingsNoNS),
                'mark-background-colour': value,
            });
        },
    });

    new window.Ardittristan.ColorSetting('journal-search', 'mark-foreground-colour', {
        name: 'Search Result Foreground Colour',
        hint: 'Foreground colour for search result highlighted terms',
        label: 'Foreground Colour',
        restricted: false,
        defaultColor: color,
        scope: 'client',
        onChange: (value: string) => {
            journalSearchSettings$.next({
                ...(journalSearchSettings$.getValue() as JournalSearchSettingsNoNS),
                'mark-foreground-colour': value,
            });
        },
    });

    new window.Ardittristan.ColorSetting('journal-search', 'sidebar-page-title-text-colour', {
        name: 'Sidebar Page Title Text Colour',
        hint: 'Text colour of page titles in sidebar search results',
        label: 'Text Colour',
        restricted: false,
        defaultColor: '#8497f7',
        scope: 'client',
        onChange: (value: string) => {
            journalSearchSettings$.next({
                ...(journalSearchSettings$.getValue() as JournalSearchSettingsNoNS),
                'sidebar-page-title-text-colour': value,
            });
        },
    });

    new window.Ardittristan.ColorSetting('journal-search', 'sidebar-page-title-underline-colour', {
        name: 'Sidebar Page Title Underline Colour',
        hint: 'Underline colour of page titles in sidebar search results',
        label: 'Underline Colour',
        restricted: false,
        defaultColor: '#ea25e3',
        scope: 'client',
        onChange: (value: string) => {
            journalSearchSettings$.next({
                ...(journalSearchSettings$.getValue() as JournalSearchSettingsNoNS),
                'sidebar-page-title-underline-colour': value,
            });
        },
    });

    const initSettings = Array.from((game as Game).settings.settings.values())
        .filter((setting) => setting.namespace === 'journal-search')
        .reduce(
            (settings, { key }) => ({
                ...settings,
                [key]: getGameSetting(key as JournalSearchSettingsKeys),
            }),
            {} as JournalSearchSettingsNoNS,
        );

    journalSearchSettings$.subscribe((settings) => {
        if (settings) {
            // Add a style tag if it doesn't exist that will set the colour variables on the root element
            const styleTag =
                document.querySelector<HTMLStyleElement>('#journal-search-style-tag') ?? createJournalSearchStyleTag();

            styleTag.innerHTML = `
                :root {
                    --journal-search-highlight-fg: ${settings['mark-foreground-colour'] ?? 'marktext'};
                    --journal-search-highlight-bg: ${settings['mark-background-colour'] ?? 'mark'};
                    --journal-search-page-title-text-colour: ${settings['sidebar-page-title-text-colour'] ?? '#ff0000'};
                    --journal-search-page-title-underline-colour: ${
                        settings['sidebar-page-title-underline-colour'] ?? '#ff0000'
                    };
    
                    --journal-search-highlight-monks-fg: ${settings['mark-foreground-colour'] ?? 'marktext'};
                    --journal-search-highlight-monks-bg: ${
                        settings['mark-background-colour'] ?? 'mark'
                    };                
                }
            `;
        }
    });

    journalSearchSettings$.next(initSettings);
}
