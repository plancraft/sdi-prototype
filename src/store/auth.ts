import { atom } from 'jotai';

export const isAuthenticatedAtom = atom<boolean>(false);
export const authTokenAtom = atom<string | null>(null);