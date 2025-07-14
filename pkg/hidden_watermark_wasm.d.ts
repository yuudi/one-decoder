/* tslint:disable */
/* eslint-disable */
export class Watermarker {
  free(): void;
  constructor(password: string);
  embed(text: string, watermark: string): string;
  extract(text_with_wm: string): string;
}
