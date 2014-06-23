// Module
declare module rison {
    export function quote(x: string): string;

    export function decode(x: string): any;

    export function encode(o: any): string;
}