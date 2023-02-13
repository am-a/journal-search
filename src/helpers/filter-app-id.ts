import { filter } from 'rxjs/operators';

// rxjs operator on a stream with appId to filter only events for that id
export const filterAppId = (appId: number) => filter(<E extends { appId: number }>(event: E) => event.appId === appId);
