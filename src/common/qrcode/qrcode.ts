import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { toDataURL } from 'qrcode';

@Directive({
  selector: 'img[appQRcode]',
})
export class QRcode {
  private el = inject(ElementRef);
  rawString = input.required<string>();

  constructor() {
    effect(() => {
      toDataURL(this.rawString(), { errorCorrectionLevel: 'L' }).then(
        (dataURL) => {
          this.el.nativeElement.src = dataURL;
        },
      );
    });
  }
}
