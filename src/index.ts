import './styles.scss';

import { init } from './init';

Hooks.once('init', () => {
    init();
});

if (module.hot) {
    module.hot.accept('./init.ts', function () {
        libWrapper?.unregister_all('journal-search');

        void import('./init').then(({ reload }) => {
            reload();
        });
    });
}
