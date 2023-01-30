import { atom } from 'jotai';

export const showSnackbarRegistrationAtom = atom(false);

export const authTokenAtom = atom('');

export const isThemeDarkAtom = atom(true);

export const profileAtom = atom(0);

export const drawerAtom = atom(null as any);

export const isLoadingAtom = atom(false);

export const selectedGymAtom = atom({
  id: 0,
  gym_name: null,
});

export const showGymPickerAtom = atom(false);

export const refreshAtom = atom(false);

export const refreshInsideCardAtom = atom(false);
