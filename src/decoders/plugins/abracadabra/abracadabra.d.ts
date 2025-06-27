declare module 'abracadabra-cn' {
  export class Abracadabra {
    static TEXT: 'TEXT';
    static UINT8: 'UINT8';

    static ENCRYPT: 'ENCRYPT';
    static DECRYPT: 'DECRYPT';
    static AUTO: 'AUTO';

    /**
     * Create an Abracadabra instance.
     * @param inputType "TEXT" or "UINT8" (default: "TEXT")
     * @param outputType "TEXT" or "UINT8" (default: "TEXT")
     */
    constructor(inputType?: 'TEXT' | 'UINT8', outputType?: 'TEXT' | 'UINT8');

    /**
     * Traditional encrypt/decrypt mode.
     * @param input Input data (string or Uint8Array)
     * @param mode "ENCRYPT" | "DECRYPT" | "AUTO"
     * @param key Key string (default: "ABRACADABRA")
     * @param q Omit marker flag (default: false)
     * @returns 0 on success
     */
    Input(
      input: string | Uint8Array,
      mode: 'ENCRYPT' | 'DECRYPT' | 'AUTO',
      key?: string,
      q?: boolean,
    ): number;

    /**
     * Get the encryption/decryption result.
     * @returns string or Uint8Array depending on outputType
     */
    Output(): string | Uint8Array;

    /**
     * Classical Chinese encryption mode.
     * @param input Input data (string or Uint8Array)
     * @param mode "ENCRYPT" | "DECRYPT"
     * @param key Key string (default: "ABRACADABRA")
     * @param q Add punctuation to cipher text (default: true)
     * @param r Randomness (default: 50; max: 100)
     * @param p Force parallel prose (default: false)
     * @param l Force logic cipher (default: false)
     * @returns 0 on success
     */
    Input_Next(
      input: string | Uint8Array,
      mode: 'ENCRYPT' | 'DECRYPT',
      key?: string,
      q?: boolean,
      r?: number,
      p?: boolean,
      l?: boolean,
    ): number;
  }
}
