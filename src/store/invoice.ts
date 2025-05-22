import { atom } from 'jotai';
import type { Invoice } from '../types/invoice';

export const selectedInvoiceAtom = atom<Invoice | null>(null);
export const invoicesAtom = atom<Invoice[]>([]);
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);
export const pageAtom = atom<number>(1);
export const hasMoreAtom = atom<boolean>(true);