
const loadFile = url => fetch(url).then(d => d.arrayBuffer());

!(async () => {
  window.DEBUG = false;
  console.log('loading...');

  const settings = {
    load_devices: true,
  };
  settings.bios = await loadFile('/bios/seabios.bin');
  settings.vga_bios = await loadFile('/bios/vgabios.bin');

  settings.floppy_disk = new SyncBuffer(await loadFile('/images/windows101.img'));
  // settings.cdrom_disk = new SyncBuffer(await loadFile('/images/linux.iso'));


  const cpu = new v86();

  settings.screen_adapter = new ScreenAdapter();
  settings.keyboard_adapter = new KeyboardAdapter();
  settings.mouse_adapter = new MouseAdapter();

  cpu.init(settings);
  cpu.run();
})();