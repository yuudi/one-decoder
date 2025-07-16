import { QRcode } from './qrcode';

describe('QRcode', () => {
  it('should create an instance', () => {
    const directive = new QRcode();
    expect(directive).toBeTruthy();
  });
});
