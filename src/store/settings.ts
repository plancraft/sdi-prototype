import { atom } from 'jotai';

export const dataSourceAtom = atom<'mock' | 'sandbox'>('mock');