# Whisperer-wasm

forked from <https://github.com/Borber/Whisperer>

## Usage

### install

```sh
npm i "whisperer-wasm@git+https://github.com/yuudi/one-revealer.git#whisperer-wasm"
```

### use

```js
import { encode, decode } from "whisperer-wasm"

const str = "hello whisperer";
const encoded = encode(str);
console.log(encoded);
const decoded = decode(encoded);
console.log(decoded);
```