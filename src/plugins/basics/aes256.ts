import { Plugin } from '../../decoders/decorators';
import { DecodeError, DecodeErrorCode } from '../../decoders/errors';
import { type DecoderPluginImplement } from '../../decoders/types';

const enum CryptoMode {
  CBC = 'CBC',
  CTR = 'CTR',
}
const enum BinaryCoding {
  Hex = 'hex',
  Base64 = 'base64',
}

// Abstract base class for AES256 operations
abstract class AES256Base implements DecoderPluginImplement {
  protected abstract cryptoMode: CryptoMode;
  protected abstract binaryCoding: BinaryCoding;

  // Helper method to convert hex string to Uint8Array
  protected hexToBytes(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) {
      throw new DecodeError('Invalid hex string length', {
        code: DecodeErrorCode.InvalidInput,
      });
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
  }

  // Helper method to convert Uint8Array to hex string
  protected bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
      '',
    );
  }

  // Helper method to convert base64 string to Uint8Array
  protected base64ToBytes(base64: string): Uint8Array {
    try {
      // Normalize base64 string: replace URL-safe characters and add padding if needed
      let normalizedBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding if needed
      const paddingNeeded = (4 - (normalizedBase64.length % 4)) % 4;
      normalizedBase64 += '='.repeat(paddingNeeded);

      const binaryString = atob(normalizedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch {
      throw new DecodeError('Invalid base64 string', {
        code: DecodeErrorCode.InvalidInput,
      });
    }
  }

  // Helper method to convert Uint8Array to base64 string
  protected bytesToBase64(bytes: Uint8Array): string {
    const binaryString = Array.from(bytes, (byte) =>
      String.fromCharCode(byte),
    ).join('');
    return btoa(binaryString);
  }

  // Helper method to convert string to Uint8Array
  protected stringToBytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  // Helper method to convert Uint8Array to string
  protected bytesToString(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes);
  }

  // PKCS#7 padding for CBC mode
  protected addPKCS7Padding(data: Uint8Array, blockSize = 16): Uint8Array {
    const paddingLength = blockSize - (data.length % blockSize);
    const paddedData = new Uint8Array(data.length + paddingLength);
    paddedData.set(data);

    // Fill padding bytes with the padding length value
    for (let i = data.length; i < paddedData.length; i++) {
      paddedData[i] = paddingLength;
    }

    return paddedData;
  }

  // Remove PKCS#7 padding for CBC mode
  protected removePKCS7Padding(data: Uint8Array): Uint8Array {
    if (data.length === 0) {
      throw new DecodeError('Cannot remove padding from empty data', {
        code: DecodeErrorCode.InvalidInput,
      });
    }

    const paddingLength = data[data.length - 1];

    // Validate padding length
    if (paddingLength === 0 || paddingLength > 16) {
      throw new DecodeError('Invalid PKCS#7 padding', {
        code: DecodeErrorCode.InvalidInput,
      });
    }

    // Validate that all padding bytes have the same value
    for (let i = data.length - paddingLength; i < data.length; i++) {
      if (data[i] !== paddingLength) {
        throw new DecodeError('Invalid PKCS#7 padding', {
          code: DecodeErrorCode.InvalidInput,
        });
      }
    }

    return data.slice(0, data.length - paddingLength);
  }

  protected checkStringBase64(input: string): number {
    // Check for standard base64 (with or without padding)
    if (/^[a-zA-Z0-9+/]*={0,2}$/.test(input)) {
      return Math.min(98, 20 + input.length * 5);
    }
    // Check for URL-safe base64 (with or without padding)
    if (/^[a-zA-Z0-9-_]*={0,2}$/.test(input)) {
      return Math.min(98, 20 + input.length * 5);
    }

    return 0;
  }

  protected checkStringHex(input: string): number {
    if (/^[0-9a-fA-F]+$/.test(input)) {
      return Math.min(98, 10 + input.length * 10);
    }

    return 0;
  }

  // Import key for AES operations
  protected async importKey(
    keyString: string,
    mode: CryptoMode,
  ): Promise<CryptoKey> {
    // Convert UTF-8 string to bytes
    const keyBytes = this.stringToBytes(keyString);

    // Use SHA256 to generate a consistent 32-byte key from any input
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyBytes);
    const finalKeyBytes = new Uint8Array(hashBuffer);

    return await crypto.subtle.importKey(
      'raw',
      finalKeyBytes,
      { name: 'AES-' + mode },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  // Encode method implementation
  protected async encodeWith(
    input: string,
    key: string,
    config: {
      coding: BinaryCoding;
      mode: CryptoMode;
    },
  ) {
    const { coding, mode } = config;
    if (!key) {
      throw new DecodeError('AES256 requires a key for encoding', {
        code: DecodeErrorCode.InvalidKey,
      });
    }

    try {
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(16));

      // Convert input to bytes
      const plaintext = this.stringToBytes(input);
      const plainToEncrypt =
        mode === CryptoMode.CBC ? this.addPKCS7Padding(plaintext) : plaintext;

      // Import the key
      const cryptoKey = await this.importKey(key, mode);

      // Encrypt
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-' + mode,
          iv: iv,
        },
        cryptoKey,
        plainToEncrypt,
      );

      // Combine IV + ciphertext and convert to output format
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);

      return coding === BinaryCoding.Hex
        ? this.bytesToHex(combined)
        : this.bytesToBase64(combined);
    } catch (error) {
      throw new DecodeError(`AES256 encryption failed: ${error}`, {
        code: DecodeErrorCode.InvalidInput,
      });
    }
  }

  // Decode method implementation
  protected async decodeWith(
    input: string,
    key: string,
    config: {
      coding: BinaryCoding;
      mode: CryptoMode;
    },
  ) {
    const { coding, mode } = config;

    if (!key) {
      throw new DecodeError('AES256 requires a key', {
        code: DecodeErrorCode.InvalidKey,
      });
    }

    try {
      const encryptedBytes =
        coding === BinaryCoding.Hex
          ? this.hexToBytes(input)
          : this.base64ToBytes(input);

      // First 16 bytes are the IV
      if (encryptedBytes.length < 16) {
        throw new DecodeError(
          'Encrypted data too short (minimum 16 bytes: 16 IV)',
          {
            code: DecodeErrorCode.InvalidInput,
          },
        );
      }

      const iv = encryptedBytes.slice(0, 16);
      const ciphertext = encryptedBytes.slice(16);

      // Import the key
      const cryptoKey = await this.importKey(key, mode);

      // Decrypt
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-' + mode,
          iv: iv,
        },
        cryptoKey,
        ciphertext,
      );

      // Convert to string (remove PKCS#7 padding for CBC mode)
      const decryptedBytes = new Uint8Array(decryptedBuffer);
      const rawBytes =
        mode === CryptoMode.CBC
          ? this.removePKCS7Padding(decryptedBytes)
          : decryptedBytes;
      return this.bytesToString(rawBytes);
    } catch (error) {
      if (error instanceof DecodeError) {
        throw error;
      }
      throw new DecodeError(`AES256 decryption failed: ${error}`, {
        code: DecodeErrorCode.InvalidInput,
      });
    }
  }

  checkString(input: string, data?: { key?: string }): number {
    if (!data?.key) return 0;
    return this.binaryCoding === BinaryCoding.Hex
      ? this.checkStringHex(input)
      : this.checkStringBase64(input);
  }

  public async decode(input: string, data: { key?: string }): Promise<string> {
    const { key } = data;
    if (!key) {
      throw new DecodeError('AES256 requires a key', {
        code: DecodeErrorCode.InvalidKey,
      });
    }
    return this.decodeWith(input, key, {
      coding: this.binaryCoding,
      mode: this.cryptoMode,
    });
  }

  public async encode(input: string, key?: string): Promise<string> {
    if (!key) {
      throw new DecodeError('AES256 requires a key for encoding', {
        code: DecodeErrorCode.InvalidKey,
      });
    }
    return this.encodeWith(input, key, {
      coding: this.binaryCoding,
      mode: this.cryptoMode,
    });
  }
}

@Plugin({
  id: 'aes256-cbc-hex',
  name: 'AES256-CBC (Hex)',
  needKey: true,
  encoderHelpMessage: '默认IV前置，PKCS#7填充',
  hide: true,
})
class AES256CBCHexDecoder extends AES256Base {
  override cryptoMode = CryptoMode.CBC;
  override binaryCoding = BinaryCoding.Hex;
}

@Plugin({
  id: 'aes256-cbc-base64',
  name: 'AES256-CBC (Base64)',
  needKey: true,
  encoderHelpMessage: '默认IV前置，PKCS#7填充',
  hide: false, // This is the only visible AES256 decoder
})
class AES256CBCBase64Decoder extends AES256Base {
  override cryptoMode = CryptoMode.CBC;
  override binaryCoding = BinaryCoding.Base64;
}

@Plugin({
  id: 'aes256-ctr-hex',
  name: 'AES256-CTR (Hex)',
  needKey: true,
  encoderHelpMessage: '默认IV前置，无填充',
  hide: true,
})
class AES256CTRHexDecoder extends AES256Base {
  override cryptoMode = CryptoMode.CTR;
  override binaryCoding = BinaryCoding.Hex;
}

@Plugin({
  id: 'aes256-ctr-base64',
  name: 'AES256-CTR (Base64)',
  needKey: true,
  encoderHelpMessage: '默认IV前置，无填充',
  hide: true,
})
class AES256CTRBase64Decoder extends AES256Base {
  override cryptoMode = CryptoMode.CTR;
  override binaryCoding = BinaryCoding.Base64;
}

export const AES256Decoders = [
  AES256CBCHexDecoder,
  AES256CBCBase64Decoder,
  AES256CTRHexDecoder,
  AES256CTRBase64Decoder,
];
