import { type DecoderPlugin } from '../decoder';

export class BeastDecoder implements DecoderPlugin {
  id = 'beast';
  name = '兽音';
  needKey = true;
  encoderHelpMessage = '“密钥”部分为字符集，必须为4个字符';

  checkString(input: string, data: { freq: Record<string, number> }): number {
    if (/^[喵嗷呜啊~]+$/.test(input)) {
      return 100;
    }
    if (
      Object.keys(data.freq).length === 4 &&
      allDifferent(Object.keys(data.freq))
    ) {
      return 80;
    }
    return 0;
  }

  decode(input: string): string {
    const charMap: [string, string, string, string] = [
      input[2],
      input[1],
      input[input.length - 1],
      input[0],
    ];
    const content = input.slice(3, -1);
    let hex = '';
    for (let i = 0; i < content.length; i += 2) {
      const j = charMap.indexOf(content[i]);
      const k = charMap.indexOf(content[i + 1]);
      const index = (j * 4 + k - ((i / 2) % 16) + 16) % 16;
      hex += index.toString(16);
    }
    let str = '';
    for (let i = 0; i < hex.length; i += 4) {
      str += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
    }
    return str;
  }

  encode(input: string, key?: string): string {
    let charMap: [string, string, string, string] = ['嗷', '呜', '啊', '~'];
    if (key) {
      if (key.length !== 4) {
        throw new Error('密钥长度必须为4个字符');
      }
      charMap = key.split('') as [string, string, string, string];
      if (!allDifferent(charMap)) {
        throw new Error('密钥4个字符必须互不相同');
      }
    }
    let hex = '';
    for (let i = 0; i < input.length; i++) {
      hex += ('0000' + input.charCodeAt(i).toString(16)).slice(-4);
    }
    hex = hex.toUpperCase();
    let content = '';
    for (let i = 0; i < hex.length; i++) {
      const k = (parseInt(hex[i], 16) + (i % 16)) % 16;
      content += charMap[Math.floor(k / 4)] + charMap[k % 4];
    }
    return `${charMap[3]}${charMap[1]}${charMap[0]}${content}${charMap[2]}`;
  }
}

function allDifferent<T>(arr: T[]): boolean {
  const uniqueChars = new Set(arr);
  return uniqueChars.size === arr.length;
}
