'use strict';

/**
 * @constructor
 */
function KeyboardAdapter() {
  var /**
     * @type {!Object.<boolean>}
     */
    keys_pressed = {},
    keyboard = this,
    // callback to call on a keypress
    send_code;

  this.enabled = true;

  /**
   * Format:
   * Javascript event.keyCode -> make code
   * @const
   */
  var charmap = new Uint16Array([
    0, 0, 0, 0, 0, 0, 0, 0,
    // 0x08: backspace, tab, enter
    0x0e, 0x0f, 0, 0, 0, 0x1c, 0, 0,

    // 0x10: shift, ctrl, alt, pause, caps lock
    0x2a, 0x1d, 0x38, 0, 0x3a, 0, 0, 0,

    // 0x18: escape
    0, 0, 0, 0x01, 0, 0, 0, 0,

    // 0x20: spacebar, page down/up, end, home, arrow keys, ins, del
    0x39, 0xe049, 0xe051, 0x4f, 0x47, 0x4b, 0x48, 0x4d, 0x50, 0, 0, 0, 0, 0x52,
    0x53, 0,

    // 0x30: numbers
    0x0b, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a,

    // 0x3B: ;= (firefox only)
    0, 0x27, 0, 0x0d, 0, 0, 0,

    // 0x65: letters
    0x1e, 0x30, 0x2e, 0x20, 0x12, 0x21, 0x22, 0x23, 0x17, 0x24, 0x25, 0x26,
    0x32, 0x31, 0x18, 0x19, 0x10, 0x13, 0x1f, 0x14, 0x16, 0x2f, 0x11, 0x2d,
    0x15, 0x2c,

    0, 0, 0, 0, 0,

    // 0x60: keypad
    0x52, 0x4f, 0x50, 0x51, 0x4b, 0x4c, 0x4d, 0x47, 0x48, 0x49, 0, 0, 0, 0, 0,
    0,

    // 0x70: F1 to F12
    0x3b, 0x3c, 0x3d, 0x3e, 0x3f, 0x40, 0x41, 0x42, 0x43, 0x44, 0x57, 0x58,

    0, 0, 0, 0,

    // 0x80
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    // 0x90
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    // 0xA0: - (firefox only)
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x0c, 0, 0,

    // 0xB0
    // ,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x27, 0x0d, 0x33, 0x0c, 0x34, 0x35,

    // 0xC0
    // `
    0x29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    // 0xD0
    // [']\
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x1a, 0x2b, 0x1b, 0x28, 0,
  ]);

  this.init = function (code_fn) {
    this.destroy();

    send_code = code_fn;

    window.addEventListener('keyup', keyup_handler, false);
    window.addEventListener('keydown', keydown_handler, false);
    window.addEventListener('blur', blur_handler, false);
  };

  this.destroy = function () {
    window.removeEventListener('keyup', keyup_handler, false);
    window.removeEventListener('keydown', keydown_handler, false);
    window.removeEventListener('blur', blur_handler, false);
  };

  function may_handle(e) {
    if ((e.shiftKey && e.ctrlKey && e.keyCode === 74) || e.keyCode === 116) {
      // don't prevent opening chromium dev tools or F5
      // maybe add other important combinations here, too
      return false;
    }

    if (!keyboard.enabled) {
      return false;
    }

    if (e.target) {
      return (
        e.target.className === 'phone_keyboard' ||
        (e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'TEXTAREA')
      );
    } else {
      return true;
    }
  }

  function keyup_handler(e) {
    if (!may_handle(e)) {
      return;
    }

    var code = e.keyCode;

    if (!keys_pressed[code]) {
      // stray keyup
      return false;
    }

    keys_pressed[code] = false;

    if (!handler(code, false)) {
      e.preventDefault();
    }
  }

  function keydown_handler(e) {
    if (!may_handle(e)) {
      return;
    }

    var code = e.keyCode;

    if (keys_pressed[code]) {
      handler(code, false);
    }

    keys_pressed[code] = true;

    if (!handler(code, true)) {
      e.preventDefault();
    }
  }

  function blur_handler(e) {
    // trigger keyup for all pressed keys
    var keys = Object.keys(keys_pressed),
      key;

    for (var i = 0; i < keys.length; i++) {
      key = +keys[i];

      if (keys_pressed[key]) {
        handler(key, false);
      }
    }

    keys_pressed = {};
  }

  /**
   * @param {number} chr
   * @param {boolean} keydown
   */
  function handler(chr, keydown) {
    if (chr >= charmap.length || charmap[chr] === 0) {
      dbg_log('missing char: ' + h(chr), LOG_PS2);
      return true;
    }

    var code = charmap[chr];

    if (!keydown) {
      code |= 0x80;
    }
    dbg_log(
      'Key: ' + h(code) + ' from ' + h(chr) + ' down=' + keydown,
      LOG_PS2
    );

    if (code > 0xff) {
      // prefix
      send_code(code >> 8);
      send_code(code & 0xff);
    } else {
      send_code(code);
    }

    return false;
  }
}
