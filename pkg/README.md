# Hidden-watermark-wasm

forked from <https://github.com/guofei9987/hidden_watermark_web>

## Usage

### install

```sh
npm i "hidden-watermark-wasm@git+https://github.com/yuudi/one-revealer.git#hidden-watermark-wasm"
```

### use

```js
import { Watermarker } from "hidden-watermark-wasm"

const str = "hidden-watermark";
const plainText = "hello world!";
const password = "super-secure-password";
const coder = new Watermarker(password);
const displayText = coder.embed(plainText, str);
console.log(displayText);
const hiddenText = coder.extract(displayText);
console.log(hiddenText);
```

### build

```sh
cargo install wasm-pack
wasm-pack build
```