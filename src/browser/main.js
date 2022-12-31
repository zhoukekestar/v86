// 作为时钟周期，每运行一次 cpu 指令，就 message 一次，方便调试
// setImmediate for the browser
var next_tick, set_tick;

(function () {
  var fn,
    host = location.protocol + '//' + location.hostname;

  set_tick = function (f) {
    fn = f;

    window.removeEventListener('message', tick_handler, false);
    window.addEventListener('message', tick_handler, false);
  };

  next_tick = function () {
    window.postMessage(null, host);
  };

  function tick_handler(e) {
    if (e.origin === host) {
      fn();
    }
  }
})();

function load_file(filename, done, progress) {
  var http = new XMLHttpRequest();

  http.open('get', filename, true);
  http.responseType = 'arraybuffer';

  http.onload = function (e) {
    //if(http.readyState === 4 && http.status === 200)
    if (http.response) {
      done(http.response);
    }
  };

  if (progress) {
    http.onprogress = function (e) {
      progress(e);
    };
  }

  http.send(null);
}

var settings = {
  load_devices: true,
};

load_file('bios/seabios.bin', function (img) {
  settings.bios = img;
});

load_file('bios/vgabios.bin', function (img) {
  settings.vga_bios = img;
});

load_file(
  'images/windows101.img',
  function (buffer) {
    settings.floppy_disk = new SyncBuffer(buffer);
    init(settings);
  }
);
function $(id) {
  return document.getElementById(id);
}

function log(data) {
  var log_element = document.getElementById('log');

  log_element.textContent += data + '\n';
  log_element.scrollTop = 1e9;
}


function dump_file(ab, name) {
  var blob = new Blob([ab]),
    a;

  a = document.createElement('a');
  a['download'] = name;
  (a.href = window.URL.createObjectURL(blob)),
    (a.textContent = 'Download ' + name);
  a.onclick = function () {
    a.parentNode.removeChild(a);
  };

  a.dataset['downloadurl'] = [
    'application/octet-stream',
    a['download'],
    a.href,
  ].join(':');

  document.body.appendChild(a);
}


function init(settings) {
  var cpu = new v86(),
    screen_adapter = new ScreenAdapter();

  $('boot_options').parentNode.removeChild($('boot_options'));
  $('loading').style.display = 'none';
  $('runtime_options').style.display = 'block';
  document.getElementsByClassName('phone_keyboard')[0].style.display = 'block';

  if (DEBUG) {
    $('step').onclick = function () {
      debug.step();
    };

    $('run_until').onclick = function () {
      debug.run_until();
    };

    $('debugger').onclick = function () {
      debug.debugger();
    };
  }

  var running = true;

  var time = document.getElementById('running_time'),
    ips = document.getElementById('speed'),
    last_tick = Date.now(),
    running_time = 0,
    last_instr_counter = 0;

  function update_info() {
    if (running) {
      var now = Date.now();

      running_time += now - last_tick;
      last_tick = now;

      ips.textContent = ((cpu.instr_counter - last_instr_counter) / 1000) | 0;
      time.textContent = (running_time / 1000) | 0;

      last_instr_counter = cpu.instr_counter;
    }
  }

  setInterval(update_info, 1000);

  settings.screen_adapter = screen_adapter;
  settings.keyboard_adapter = new KeyboardAdapter();
  settings.mouse_adapter = new MouseAdapter();

  cpu.init(settings);
  cpu.run();
}
