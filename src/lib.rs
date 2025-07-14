use wasm_bindgen::prelude::*;
use hidden_watermark::TextBlindWM;
use std::str;

// 当调用者出现 panic 时，将其转换为 JavaScript 的异常
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// 定义一个结构体来封装 TextBlindWM
#[wasm_bindgen]
pub struct Watermarker {
    wm: TextBlindWM,
}

#[wasm_bindgen]
impl Watermarker {
    #[wasm_bindgen(constructor)]
    pub fn new(password: &str) -> Watermarker {
        let wm = TextBlindWM::new(password.as_bytes());
        Watermarker { wm }
    }

    pub fn embed(&self, text: &str, watermark: &str) -> String {
        self.wm.add_wm_rnd(text, watermark.as_bytes())
    }

    pub fn extract(&self, text_with_wm: &str) -> String {
        let wm_bytes = self.wm.extract(text_with_wm);
        // 尝试将 Vec<u8> 转换为 String
        match str::from_utf8(&wm_bytes) {
            Ok(wm_str) => wm_str.to_string(),
            Err(_) => String::from("Failed to convert extracted bytes to string"),
        }
    }
}

