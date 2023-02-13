import { BehaviorSubject, Subject } from 'rxjs';

import { JournalSearchSettingsNoNS } from './types';

export const journalSearchSettings$ = new BehaviorSubject<JournalSearchSettingsNoNS | null>(null);

export const journalRender$ = new Subject<{ appId: number; sheet: JournalSheet }>();
export const journalQuery$ = new Subject<{ appId: number; queryRegEx: RegExp | null }>();

export const sidebarRender$ = new Subject<{ appId: number; sheet: JournalDirectory }>();
export const sidebarQuery$ = new Subject<{ appId: number; queryRegEx: RegExp | null }>();

// Support monks-enhanced-journal
export const monksQuery$ = new Subject<{ appId: number; query: string | null }>();
