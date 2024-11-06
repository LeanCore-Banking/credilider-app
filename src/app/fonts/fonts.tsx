import {Montserrat, Roboto, Roboto_Condensed}from 'next/font/google';
import {Lusitana} from 'next/font/google';

export const monserrat = Montserrat({subsets: ['latin'], weight:['400', '700']});

export const lusitana = Lusitana({subsets: ['latin'], weight:['400', '700']});

export const roboto = Roboto({subsets: ['latin'], weight:['400', '700']});

export const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['400', '700'],
  });