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
        name: 'Search Result Foreground Colour', // The name of the setting in the settings menu
        hint: 'Foreground colour for search result highlighted terms', // A description of the registered setting and its behavior
        label: 'Foreground Colour', // The text label used in the button
        restricted: false, // Restrict this setting to gamemaster only?
        defaultColor: color, // The default color of the setting
        scope: 'client', // The scope of the setting
        onChange: (value: string) => {
            journalSearchSettings$.next({
                ...(journalSearchSettings$.getValue() as JournalSearchSettingsNoNS),
                'mark-foreground-colour': value,
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

    journalSearchSettings$.next(initSettings);
}
