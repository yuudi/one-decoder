import charMap from './gbk-charmap';

function isAscii(unicode: number): boolean {
  return unicode == 0x20ac || (unicode <= 0x007f && unicode >= 0x0000);
}

const charData: string = charMap
  .replace(/#(\d+)\$/g, function (a: string, b: string) {
    return Array(+b + 3).join('#');
  })
  .replace(/#/g, '####')
  .replace(
    /(\w\w):([\w#]+)(?:,|$)/g,
    function (a: string, hd: string, dt: string) {
      return dt.replace(/../g, function (a: string) {
        if (a != '##') {
          return hd + a;
        } else {
          return a;
        }
      });
    },
  );

type Charset = string[16];

class Encoder {
  charset: Charset;
  charsetDict: Record<string, number> = {};
  unicode2gbk: Record<string, string> = {};
  gbk2unicode: Record<string, string> = {};

  constructor(charset: Charset) {
    this.charset = charset;
    for (let i = 0; i < charset.length; i++) {
      this.charsetDict[charset[i]] = i;
    }
    let k = 0;
    const data = charData.match(/..../g) as string[];
    for (let i = 0x81; i <= 0xfe; i++) {
      for (let j = 0x40; j <= 0xfe; j++) {
        this.unicode2gbk[data[k++]] =
          charset[i & 0xf] +
          charset[i >> 4] +
          charset[j & 0xf] +
          charset[j >> 4];
      }
    }
    for (const key in this.unicode2gbk) {
      this.gbk2unicode[this.unicode2gbk[key]] = key;
    }
  }

  encode(str: string): string {
    return str.replace(/./g, (a) => {
      const code = a.charCodeAt(0);
      if (isAscii(code)) {
        return this.charset[code & 0xf] + this.charset[code >> 4];
      } else {
        let key = code.toString(16);
        if (key.length != 4) key = ('000' + key).match(/....$/)![0];
        return this.unicode2gbk[key] || a;
      }
    });
  }

  decode(str: string): string {
    let output = '';
    let h: string | null = null;
    for (let i = 0, charsLength = str.length; i < charsLength; i += 2) {
      if (h !== null) {
        const a = h + str.substr(i, 2);
        h = null;
        output += String.fromCharCode(Number('0x' + this.gbk2unicode[a]));
      } else if (this.charsetDict[str[i + 1]] < 8) {
        const code =
          (this.charsetDict[str[i + 1]] << 4) + this.charsetDict[str[i]];
        output += String.fromCharCode(code);
      } else {
        h = str.substr(i, 2);
      }
    }
    return output;
  }
}

export default Encoder;
