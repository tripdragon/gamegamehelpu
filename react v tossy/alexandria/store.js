import { create } from 'zustand';

export const useStore = create((set) => {

    return {
        setState: set,
        app: {
            dialog: []
        },
        selectors: {
            currentDialog: () => {
                //
            }
        },
        actions: {
            pushDialog: () => {
                //
            }
        }
    };
});
