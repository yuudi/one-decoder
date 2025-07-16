declare module 'zero-width-lib' {
  export const zeroWidthDict: Record<string, string>;
  export function encode(vis: string, hid: string): string;
  export function decode(vis: string): string;
}
