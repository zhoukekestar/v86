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

const loadFile = url => fetch(url).then(d => d.arrayBuffer());

!(async () => {
  window.DEBUG = false;
  console.log('loading...');

  const settings = {
    load_devices: true,
  };
  settings.bios = await loadFile('bios/seabios.bin');
  settings.vga_bios = await loadFile('bios/vgabios.bin');

  settings.floppy_disk = new SyncBuffer(await loadFile('images/windows101.img'));
  // settings.cdrom_disk = new SyncBuffer(await loadFile('images/linux.iso'));


  const cpu = new v86();

  settings.screen_adapter = new ScreenAdapter();
  settings.keyboard_adapter = new KeyboardAdapter();
  settings.mouse_adapter = new MouseAdapter();

  cpu.init(settings);
  cpu.run();
})();