use rand::Rng;

use crate::config as Conf;
use crate::crypt::{decrypt, encrypt};
use wasm_bindgen::prelude::*;

mod config;
mod crypt;
mod hash;

#[wasm_bindgen]
pub fn decode(s: String, key: Option<String>) -> Result<String, String> {
    let reduction: Vec<u8> = {
        let mut v = Vec::new();
        for c in s.trim().chars() {
            match Conf::DICT.binary_search(&c) {
                Ok(idx) => v.push(idx as u8),
                Err(_) => return Err(format!("character '{}' is not in charset", c)),
            }
        }
        v
    };
    let mut clear: Vec<u8> = Vec::new();
    for (index, e) in reduction.iter().enumerate() {
        if index == 0 {
            continue;
        }
        clear.push(decrypt(
            index,
            &reduction[index - 1],
            reduction.len(),
            e,
            key.as_deref(),
        ));
    }
    let buf = zstd::stream::decode_all(clear.as_slice()).unwrap_or(clear);
    let mut result = match String::from_utf8(buf) {
        Ok(s) => s,
        Err(_) => return Err("unable to encoding UTF8".to_string()),
    };
    for key_word in &Conf::KEY_WORDS {
        result = result.replace(key_word.1, key_word.0);
    }
    Ok(result)
}

#[wasm_bindgen]
pub fn encode(s: String, key: Option<String>) -> Result<String, String> {
    let mut buf = s.trim().to_string();
    for key_word in &Conf::KEY_WORDS {
        buf = buf.replace(key_word.0, key_word.1);
    }
    let compressed =
        zstd::stream::encode_all(buf.as_bytes(), Conf::ZSTD_LEVEL).map_err(|e| e.to_string())?;
    let mut short = if buf.as_bytes().len() > compressed.len() {
        compressed
    } else {
        buf.as_bytes().to_vec()
    };
    let mut rng = rand::thread_rng();
    let random: u8 = rng.r#gen();
    short.insert(0, random);
    let mut cipher: Vec<u8> = vec![random];
    for (index, d) in short.iter().enumerate() {
        if index == 0 {
            continue;
        }
        cipher.push(encrypt(
            index,
            cipher.last().unwrap(),
            short.len(),
            d,
            key.as_deref(),
        ));
    }
    let mapped: String = cipher.iter().map(|c| Conf::DICT[*c as usize]).collect(); //映射u8为中文字符
    Ok(format!("{}{}", Conf::FLAG, mapped))
}

#[wasm_bindgen]
pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}
