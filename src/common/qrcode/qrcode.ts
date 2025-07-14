import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  resource,
} from '@angular/core';

async function generateQRCode(rawString: string) {
  const { default: qrcode } = await import('qrcode'); // lazy loading
  return qrcode.toDataURL(rawString, { errorCorrectionLevel: 'L' });
}

@Directive({
  selector: 'img[appQRcode]',
})
export class QRcode {
  private el = inject(ElementRef);
  rawString = input.required<string>();

  private qrCodeResource = resource({
    params: () => this.rawString(),
    loader: ({ params }) => generateQRCode(params),
  });

  constructor() {
    effect(() => {
      const dataURL = this.qrCodeResource.value();
      if (dataURL) {
        this.el.nativeElement.src = dataURL;
      }
    });
  }
}
