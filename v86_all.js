//const.js

/** @define {boolean} */            
var DEBUG = true;


var

/** 
 * @const 
 * @type {number}
 */
memory_size = 1024 * 1024 * 64;

var 

/** @const */ LOG_ALL = -1,
/** @const */ LOG_NONE = 0,

/** @const */ LOG_OTHER =  0x00001,
/** @const */ LOG_CPU =    0x00002,
/** @const */ LOG_FPU =    0x00004,
/** @const */ LOG_MEM =    0x00008,
/** @const */ LOG_DMA =    0x00010,
/** @const */ LOG_IO =     0x00020,
/** @const */ LOG_PS2 =    0x00040,
/** @const */ LOG_PIC =    0x00080,
/** @const */ LOG_VGA =    0x00100,
/** @const */ LOG_PIT =    0x00200,
/** @const */ LOG_MOUSE =  0x00400,
/** @const */ LOG_PCI =    0x00800,
/** @const */ LOG_BIOS =   0x01000,
/** @const */ LOG_CD =     0x02000,
/** @const */ LOG_SERIAL = 0x04000,
/** @const */ LOG_DISK =   0x08000,
/** @const */ LOG_RTC =    0x10000,



///** @const */ LOG_LEVEL = LOG_OTHER | LOG_PS2 | LOG_BIOS;
///** @const */ LOG_LEVEL = LOG_PS2 | LOG_OTHER | LOG_IO;
///** @const */ LOG_LEVEL = LOG_PS2;
///** @const */ LOG_LEVEL = LOG_OTHER | LOG_CPU | LOG_BIOS;
///** @const */ LOG_LEVEL = LOG_VGA | LOG_IO | LOG_BIOS | LOG_OTHER;
///** @const */ LOG_LEVEL = LOG_FPU | LOG_OTHER;
///** @const */ LOG_LEVEL = LOG_DMA | LOG_DISK | LOG_IO | LOG_PCI;
///** @const */ LOG_LEVEL = LOG_DMA | LOG_DISK | LOG_PCI | LOG_CD | LOG_BIOS;
/** @const */ LOG_LEVEL = LOG_ALL & ~LOG_DISK & ~LOG_DMA & ~LOG_VGA & ~LOG_PS2 & ~LOG_FPU;
///** @const */ LOG_LEVEL = LOG_SERIAL | LOG_IO;
///** @const */ LOG_LEVEL = LOG_PIT | LOG_RTC;
///** @const */ LOG_LEVEL = 0;


var
/** @const */ TLB_SYSTEM_READ = 1,
/** @const */ TLB_SYSTEM_WRITE = 2,
/** @const */ TLB_USER_READ = 4,
/** @const */ TLB_USER_WRITE = 8;


var 


// flags register bitflags
/** @const */ flag_carry = 1,
/** @const */ flag_parity = 4,
/** @const */ flag_adjust = 16,
/** @const */ flag_zero = 64,
/** @const */ flag_sign = 128, 
/** @const */ flag_trap = 256,
/** @const */ flag_interrupt = 512,
/** @const */ flag_direction = 1024,
/** @const */ flag_overflow = 2048,
/** @const */ flag_iopl = 1 << 12 | 1 << 13,
/** @const */ flag_nt = 1 << 14,
/** @const */ flag_vm = 1 << 17,

/** 
 * default values of unused flags bits
 * @const
 */
flags_default = 1 << 1,

/** 
 * bitmask to select used flags bits
 * @const
 */
flags_mask = 1 << 0 | 1 << 2 | 1 << 4 | 1 << 6 | 1 << 7 | 1 << 8 | 1 << 9
                        | 1 << 10 | 1 << 11 | 1 << 12 | 1 << 13 | 1 << 14 | 
                        1 << 16 | 1 << 17 | 1 << 18 | 1 << 19 | 1 << 20 | 1 << 21,

/**
 * all arithmetic flags
 * @const
 */
flags_all = flag_carry | flag_parity | flag_adjust | flag_zero | flag_sign | flag_overflow,



/**
 * opsizes used by get flag functions
 *
 * @const
 */
OPSIZE_8 = 8,
/** @const */
OPSIZE_16 = 16,
/** @const */
OPSIZE_32 = 32,

/** @const */
PSE_ENABLED = 128,

/** @const */ reg_eax = 0,
/** @const */ reg_ecx = 1,
/** @const */ reg_edx = 2,
/** @const */ reg_ebx = 3,
/** @const */ reg_esp = 4,
/** @const */ reg_ebp = 5,
/** @const */ reg_esi = 6,
/** @const */ reg_edi = 7,

/** @const */ reg_ax = 0,
/** @const */ reg_cx = 2,
/** @const */ reg_dx = 4,
/** @const */ reg_bx = 6,
/** @const */ reg_sp = 8,
/** @const */ reg_bp = 10,
/** @const */ reg_si = 12,
/** @const */ reg_di = 14,

/** @const */ reg_al = 0,
/** @const */ reg_cl = 4,
/** @const */ reg_dl = 8,
/** @const */ reg_bl = 12,
/** @const */ reg_ah = 1,
/** @const */ reg_ch = 5,
/** @const */ reg_dh = 9,
/** @const */ reg_bh = 13,


/** @const */ reg_es = 0,
/** @const */ reg_cs = 1,
/** @const */ reg_ss = 2,
/** @const */ reg_ds = 3,
/** @const */ reg_fs = 4,
/** @const */ reg_gs = 5,
/** @const */ reg_noseg = 6,



/** @const */ LOOP_COUNTER = 20001,
/** @const */ TIME_PER_FRAME = 33;




//browser/main.js
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

  // settings.floppy_disk = new SyncBuffer(await loadFile('images/windows101.img'));
  settings.cdrom_disk = new SyncBuffer(await loadFile('images/linux.iso'));


  const cpu = new v86();

  settings.screen_adapter = new ScreenAdapter();
  settings.keyboard_adapter = new KeyboardAdapter();
  settings.mouse_adapter = new MouseAdapter();

  cpu.init(settings);
  cpu.run();
})();
//io.js
"use strict";

/**
 * The ISA IO bus
 * Devices register their ports here
 *
 * @constructor
 */
function IO()
{
    var a20_byte = 0,
        me = this;

    function get_port_description(addr)
    {
        // via seabios ioport.h
        var ports = {
            0x0004: "PORT_DMA_ADDR_2",
            0x0005: "PORT_DMA_CNT_2",
            0x000a: "PORT_DMA1_MASK_REG",
            0x000b: "PORT_DMA1_MODE_REG",
            0x000c: "PORT_DMA1_CLEAR_FF_REG",
            0x000d: "PORT_DMA1_MASTER_CLEAR",
            0x0020: "PORT_PIC1_CMD",
            0x0021: "PORT_PIC1_DATA",
            0x0040: "PORT_PIT_COUNTER0",
            0x0041: "PORT_PIT_COUNTER1",
            0x0042: "PORT_PIT_COUNTER2",
            0x0043: "PORT_PIT_MODE",
            0x0060: "PORT_PS2_DATA",
            0x0061: "PORT_PS2_CTRLB",
            0x0064: "PORT_PS2_STATUS",
            0x0070: "PORT_CMOS_INDEX",
            0x0071: "PORT_CMOS_DATA",
            0x0080: "PORT_DIAG",
            0x0081: "PORT_DMA_PAGE_2",
            0x0092: "PORT_A20",
            0x00a0: "PORT_PIC2_CMD",
            0x00a1: "PORT_PIC2_DATA",
            0x00b2: "PORT_SMI_CMD",
            0x00b3: "PORT_SMI_STATUS",
            0x00d4: "PORT_DMA2_MASK_REG",
            0x00d6: "PORT_DMA2_MODE_REG",
            0x00da: "PORT_DMA2_MASTER_CLEAR",
            0x00f0: "PORT_MATH_CLEAR",
            0x0170: "PORT_ATA2_CMD_BASE",
            0x01f0: "PORT_ATA1_CMD_BASE",
            0x0278: "PORT_LPT2",
            0x02e8: "PORT_SERIAL4",
            0x02f8: "PORT_SERIAL2",
            0x0374: "PORT_ATA2_CTRL_BASE",
            0x0378: "PORT_LPT1",
            0x03e8: "PORT_SERIAL3",
            //0x03f4: "PORT_ATA1_CTRL_BASE",
            0x03f0: "PORT_FD_BASE",
            0x03f2: "PORT_FD_DOR",
            0x03f4: "PORT_FD_STATUS",
            0x03f5: "PORT_FD_DATA",
            0x03f6: "PORT_HD_DATA",
            0x03f7: "PORT_FD_DIR",
            0x03f8: "PORT_SERIAL1",
            0x0cf8: "PORT_PCI_CMD",
            0x0cf9: "PORT_PCI_REBOOT",
            0x0cfc: "PORT_PCI_DATA",
            0x0402: "PORT_BIOS_DEBUG",
            0x0510: "PORT_QEMU_CFG_CTL",
            0x0511: "PORT_QEMU_CFG_DATA",
            0xb000: "PORT_ACPI_PM_BASE",
            0xb100: "PORT_SMB_BASE",
            0x8900:  "PORT_BIOS_APM"
        };

        if(ports[addr])
        {
            return "  (" + ports[addr] + ")";
        }
        else
        {
            return "";
        }
    }

    function empty_port_read_debug(port_addr)
    {
        dbg_log(
            "read port  #" + h(port_addr, 3) + get_port_description(port_addr),
            LOG_IO
        );

        return 0xFF;
    }

    function empty_port_write_debug(port_addr, out_byte)
    {
        dbg_log(
            "write port #" + h(port_addr, 3) + " <- " + h(out_byte, 2) + get_port_description(port_addr),
            LOG_IO
        );
    }

    function empty_port_read()
    {
        return 0xFF;
    }

    function empty_port_write(x)
    {
    }

    var read_callbacks = [],
        write_callbacks = [];

    for(var i = 0; i < 0x10000; i++)
    {
        // avoid sparse arrays

        if(DEBUG)
        {
            read_callbacks[i] = empty_port_read_debug.bind(0, i);
            write_callbacks[i] = empty_port_write_debug.bind(0, i);
        }
        else
        {
            read_callbacks[i] = empty_port_read;
            write_callbacks[i] = empty_port_write;
        }
    }

    /**
     * @param {number} port_addr
     * @param {function():number} callback
     */
    this.register_read = function(port_addr, callback)
    {
        read_callbacks[port_addr] = callback;
    };

    /**
     * @param {number} port_addr
     * @param {function(number)} callback
     */
    this.register_write = function(port_addr, callback)
    {
        write_callbacks[port_addr] = callback;
    };


    // should maybe be somewhere else?
    this.register_read(0x92, function()
    {
        return a20_byte;
    });

    this.register_write(0x92, function(out_byte)
    {
        a20_byte = out_byte;
    });

    // use by linux for timing
    this.register_write(0x80, function(out_byte)
    {
    });

    this.port_write = function(port_addr, out_byte)
    {
        write_callbacks[port_addr](out_byte);
    };

    // read byte from port
    this.port_read = function(port_addr)
    {
        return read_callbacks[port_addr]();
    };
}


//cpu.js
"use strict";
var debug = {};
/** @constructor */
function v86()
{
var cpu = this;
this.run = function()
{
    if(!running)
    {
        cpu_run();
    }
}
this.stop = cpu_stop;
this.init = cpu_init;
this.restart = cpu_restart;
this.dev = {};
this.instr_counter = 0;
var
    segment_is_null,
    segment_offsets,
    segment_limits,
    segment_infos,
    /*
     * Translation Lookaside Buffer 
     */
    tlb_user_read,
    tlb_user_write,
    tlb_system_read,
    tlb_system_write,
    /*
     * Information about which pages are cached in the tlb.
     * By bit:
     *   0 system, read
     *   1 system, write
     *   2 user, read
     *   3 user, write
     */
    tlb_info,
    /*
     * Same as tlb_info, except it only contains global pages
     */
    tlb_info_global,
    /** 
     * Wheter or not in protected mode
     * @type {boolean} 
     */
    protected_mode,
    /** 
     * interrupt descriptor table
     * @type {number}
     */
    idtr_size,
    /** @type {number} */
    idtr_offset,
    /** 
     * global descriptor table register
     * @type {number}
     */
    gdtr_size,
    /** @type {number} */
    gdtr_offset,
    /** 
     * local desciptor table
     * @type {number}
     */
    ldtr_size,
    /** @type {number} */
    ldtr_offset,
    /**
     * task register 
     * @type {number} 
     */
    tsr_size,
    /** @type {number} */
    tsr_offset,
    /*
     * whether or not a page fault occured
     */
    page_fault,
    /** @type {number} */
    cr0,
    /** @type {number} */
    cr2,
    /** @type {number} */
    cr3,
    /** @type {number} */
    cr4,
    // current privilege level
    /** @type {number} */
    cpl,
    // paging enabled
    /** @type {boolean} */
    paging,
    // if false, pages are 4 KiB, else 4 Mib
    /** @type {number} */
    page_size_extensions,
    // current operand/address/stack size
    /** @type {boolean} */
    is_32,
    /** @type {boolean} */
    operand_size_32,
    /** @type {boolean} */
    stack_size_32,
    /** 
     * Cycles since last cpu reset, used by rdtsc instruction
     * @type {number}
     */
    cpu_timestamp_counter,
    /** @type {number} */
    previous_ip,
    /** 
     * wheter or not in step mode
     * used for debugging
     * @type {boolean}
     */
    step_mode,
    /**
     * was the last instruction a hlt
     * @type {boolean}
     */
    in_hlt,
    /** @type {VGAScreen} */
    vga,
    /** @type {PS2} */
    ps2,
    /** 
     * Programmable interval timer
     * @type {PIT}
     */
    timer,
    /** 
     * Real Time Clock
     * @type {RTC}
     */
    rtc,
    /**
     * Floppy Disk controller
     * @type {FloppyController}
     */
    fdc,
    /**
     * Serial controller
     * @type {UART}
     */
    uart,
    /** @type {boolean} */
    running,
    /** @type {boolean} */
    stopped,
    /** @type {number} */
    loop_counter,
    /** @type {Memory} */
    memory,
    /** @type {(FPU|NoFPU)} */
    fpu,
    /**
     * Programmable interrupt controller
     * @type {PIC}
     */
    pic,
    /**
     * @type {IO}
     */
    io,
    /**
     * @type {PCI}
     */
    pci,
    /**
     * @type {CDRom}
     */
    cdrom,
    /**
     * @type {HDD}
     */
    hda,
    /**
     * @type {HDD}
     */
    hdb,
    /**
     * Direct Memory Access Controller
     * @type {DMA}
     */
    dma,
    translate_address_read,
    translate_address_write,
    ops,
    /** @type {boolean} */
    address_size_32,
    /** @type {number} */
    instruction_pointer,
    /** @type {number} */
    last_virt_eip,
    /** @type {number} */
    eip_phys,
    /** @type {number} */
    last_virt_esp,
    /** @type {number} */
    esp_phys,
    // current state of prefixes
    segment_prefix,
    /** @type {boolean} */
    repeat_string_prefix,
    /** @type {boolean} */
    repeat_string_type,
    /** @type {number} */
    last_result,
    /** @type {number} */
    flags,
    /** 
     * bitmap of flags which are not updated in the flags variable
     * changed by arithmetic instructions, so only relevant to arithmetic flags
     * @type {number}
     */
    flags_changed,
    /** 
     * the last 2 operators and the result and size of the last arithmetic operation
     * @type {number} 
     */
    last_op1,
    /** @type {number} */
    last_op2,
    /** @type {number} */
    last_op_size,
    // registers
    reg32,
    reg32s,
    reg16,
    reg16s,
    reg8,
    reg8s,
    sreg,
    // sp or esp, depending on stack size attribute
    stack_reg,
    reg_vsp,
    reg_vbp,
    // reg16 or reg32, depending on address size attribute
    regv,
    reg_vcx,
    reg_vsi,
    reg_vdi,
    // functions that are set depending on whether paging is enabled or not
    read_imm8,
    read_imm8s,
    read_imm16,
    read_imm32s,
    safe_read8,
    safe_read8s,
    safe_read16,
    safe_read32s,
    get_esp_read,
    get_esp_write,
    table,
    table0F,
    modrm_resolve,
    current_settings
;
function cpu_run()
{
    if(stopped)
    {
        stopped = running = false;
        return;
    }
    running = true;
    try {
        do_run();
    }
    catch(e)
    {
        if(e === 0xDEADBEE)
        {
            // A legit CPU exception (for instance, a page fault happened)
            // call_interrupt_vector has already been called at this point,
            // so we just need to reset some state
            page_fault = false;
            repeat_string_prefix = false;
            segment_prefix = -1;
            address_size_32 = is_32;
            update_address_size();
            operand_size_32 = is_32;
            update_operand_size();
            cpu_run();
        }
        else
        {
            throw e;
        }
    }
};
function cpu_stop()
{
    if(running)
    {
        stopped = true;
    }
}
function cpu_restart()
{
    var was_running = running;
    stopped = true;
    running = false;
    setTimeout(function()
    {
        ps2.destroy();
        vga.destroy();
        cpu_init(current_settings);
        if(was_running)
        {
            cpu_run();
        }
    }, 10);
}
function cpu_reboot_internal()
{
    dbg_assert(running);
    ps2.destroy();
    vga.destroy();
    cpu_init(current_settings);
    throw 0xDEADBEE;
}
function cpu_init(settings)
{
    // see browser/main.js or node/main.js
    if(typeof set_tick !== "undefined")
    {
        set_tick(cpu_run);
    }
    current_settings = settings;
    cpu.memory = memory = new Memory(new ArrayBuffer(memory_size), memory_size);
    segment_is_null = new Uint8Array(8);
    segment_limits = new Uint32Array(8);
    segment_infos = new Uint32Array(8);
    segment_offsets = new Int32Array(8);
    // 16 MB in total
    tlb_user_read = new Int32Array(1 << 20);
    tlb_user_write = new Int32Array(1 << 20);
    tlb_system_read = new Int32Array(1 << 20);
    tlb_system_write = new Int32Array(1 << 20);
    tlb_info = new Uint8Array(1 << 20);
    tlb_info_global = new Uint8Array(1 << 20);
    reg32 = new Uint32Array(8);
    reg32s = new Int32Array(reg32.buffer);
    reg16 = new Uint16Array(reg32.buffer);
    reg16s = new Int16Array(reg32.buffer);
    reg8 = new Uint8Array(reg32.buffer);
    reg8s = new Int8Array(reg32.buffer);
    sreg = new Uint16Array(8);
    protected_mode = false;
    idtr_size = 0;
    idtr_offset = 0;
    gdtr_size = 0;
    gdtr_offset = 0;
    ldtr_size = 0;
    ldtr_offset = 0;
    tsr_size = 0;
    tsr_offset = 0;
    page_fault = false;
    cr0 = 0;
    cr2 = 0;
    cr3 = 0;
    cr4 = 0;
    cpl = 0;
    paging = false;
    page_size_extensions = 0;
    is_32 = false;
    operand_size_32 = false;
    stack_size_32 = false;
    address_size_32 = false;
    paging_changed();
    update_operand_size();
    update_address_size();
    stack_reg = reg16;
    reg_vsp = reg_sp;
    reg_vbp = reg_bp;
    cpu_timestamp_counter = 0;
    previous_ip = 0;
    step_mode = false;
    in_hlt = false;
    running = false;
    stopped = false;
    loop_counter = 20;
    translate_address_read = translate_address_disabled;
    translate_address_write = translate_address_disabled;
    segment_prefix = -1;
    repeat_string_prefix = false;
    last_result = 0;
    flags = flags_default;
    flags_changed = 0;
    last_op1 = 0;
    last_op2 = 0;
    last_op_size = 0;
    if(settings.bios)
    {
        // load bios
        var data = new Uint8Array(settings.bios),
            start = 0x100000 - settings.bios.byteLength;
        for(var i = 0; i < settings.bios.byteLength; i++)
        {
            memory.mem8[start + i] = data[i];
        }
        if(settings.vga_bios)
        {
            // load vga bios
            data = new Uint8Array(settings.vga_bios);
            for(var i = 0; i < settings.vga_bios.byteLength; i++)
            {
                memory.mem8[0xC0000 + i] = data[i];
            }
        }
        // ip initial value
        instruction_pointer = 0xFFFF0;
        // ss and sp inital value
        switch_seg(reg_ss, 0x30);
        reg16[reg_sp] = 0x100;
    }
    else if(settings.linux)
    {
        instruction_pointer = 0x10000;
        memory.write_blob(new Uint8Array(settings.linux.vmlinux), 0x100000);
        memory.write_blob(new Uint8Array(settings.linux.linuxstart), instruction_pointer);
        if(settings.linux.root)
        {
            memory.write_blob(new Uint8Array(settings.linux.root), 0x00400000);
            reg32[reg_ebx] = settings.linux.root.byteLength;
        }
        memory.write_string(settings.linux.cmdline, 0xF800);
        reg32[reg_eax] = memory_size;
        reg32[reg_ecx] = 0xF800;
        switch_seg(reg_cs, 0);
        switch_seg(reg_ss, 0);
        switch_seg(reg_ds, 0);
        switch_seg(reg_es, 0);
        switch_seg(reg_gs, 0);
        switch_seg(reg_fs, 0);
        is_32 = true;
        address_size_32 = true;
        operand_size_32 = true;
        stack_size_32 = true;
        protected_mode = true;
        update_operand_size();
        update_address_size();
        regv = reg32;
        reg_vsp = reg_esp;
        reg_vbp = reg_ebp;
        cr0 = 1;
    }
    else
    {
        switch_seg(reg_ss, 0x30);
        reg16[reg_sp] = 0x100;
        instruction_pointer = 0;
    }
    cpu.dev = {};
    if(settings.load_devices)
    {
        var devapi = {
            memory: memory,
            reboot: cpu_reboot_internal,
        };
        devapi.io = cpu.dev.io = io = new IO();
        devapi.pic = pic = new PIC(devapi, call_interrupt_vector, handle_irqs);
        devapi.pci = pci = new PCI(devapi);
        devapi.dma = dma = new DMA(devapi);
        cpu.dev.vga = vga = new VGAScreen(devapi, settings.screen_adapter)
        cpu.dev.ps2 = ps2 = new PS2(devapi, settings.keyboard_adapter, settings.mouse_adapter);
        //fpu = new NoFPU();
        fpu = new FPU(devapi);
        uart = new UART(devapi);
        cpu.dev.fdc = fdc = new FloppyController(devapi, settings.floppy_disk);
        if(settings.cdrom_disk)
        {
            cpu.dev.cdrom = cdrom = new CDRom(devapi, settings.cdrom_disk);
        }
        if(settings.hda_disk)
        {
            cpu.dev.hda = hda = new HDD(devapi, settings.hda_disk, 0);
        }
        if(settings.hdb_disk)
        {
            cpu.dev.hdb = hdb = new HDD(devapi, settings.hdb_disk, 1);
        }
        timer = new PIT(devapi);
        rtc = new RTC(devapi, fdc.type);
    }
    if(DEBUG)
    {
        // used for debugging 
        ops = new CircularQueue(30000);
        if(typeof window !== "undefined")
        {
            window.memory = memory;
            window.vga = vga;
        }
        if(io)
        {
            // write seabios debug output to console
            var seabios_debug = "";
            io.register_write(0x402, function(out_byte)
            {
                // seabios debug
                //
                if(out_byte === 10)
                {
                    dbg_log(seabios_debug, LOG_BIOS);
                    seabios_debug = "";
                }
                else
                {
                    seabios_debug += String.fromCharCode(out_byte);
                }
            });
        }
    }
}
function do_run()
{
    var
        /** 
         * @type {number}
         */
        now,
        start = Date.now();
    vga.timer(start);
    // outer loop:
    // runs cycles + timers
    for(var j = loop_counter; j--;)
    {
        // inner loop:
        // runs only cycles
        for(var k = LOOP_COUNTER; k--;)
        {
            previous_ip = instruction_pointer;
            cycle();
            cpu_timestamp_counter++;
        }
        now = Date.now();
        timer.timer(now);
        rtc.timer(now);
    }
    cpu.instr_counter += loop_counter * LOOP_COUNTER;
    if(now - start > TIME_PER_FRAME)
    {
        loop_counter--;
    }
    else
    {
        loop_counter++;
    }
    next_tick();
}
// do_run must not be inlined into cpu_run, because then more code 
// is in the deoptimized try-catch. 
// This trick is a bit ugly, but it works without further complication.
if(typeof window !== "undefined")
{
    window.__no_inline = do_run;
}
/**
 * execute a single instruction cycle on the cpu
 * this includes reading all prefixes and the whole instruction
 */
function cycle()
{
    var opcode = read_imm8();
    logop(instruction_pointer - 1, opcode);
    // call the instruction
    table[opcode]();
    // TODO
    //if(flags & flag_trap)
    //{
    //    
    //}
}
cpu.cycle = function()
{
    table[read_imm8()]();
}
function cr0_changed()
{
    //protected_mode = (cr0 & 1) === 1;
    //dbg_log("cr0 = " + h(cr0));
    var new_paging = (cr0 & 0x80000000) !== 0;
    if(fpu.is_fpu)
    {
        cr0 &= ~4;
    }
    else
    {
        cr0 |= 4;
    }
    if(new_paging !== paging)
    {
        paging = new_paging;
        paging_changed();
    }
}
function paging_changed()
{
    var table = paging ? pe_functions : npe_functions;
    read_imm8 = table.read_imm8;
    read_imm8s = table.read_imm8s;
    read_imm16 = table.read_imm16;
    read_imm32s = table.read_imm32s;
    safe_read8 = table.safe_read8;
    safe_read8s = table.safe_read8s;
    safe_read16 = table.safe_read16;
    safe_read32s = table.safe_read32s;
    get_esp_read = table.get_esp_read;
    get_esp_write = table.get_esp_write;
    // set translate_address_* depending on cpl and paging
    cpl_changed();
}
function cpl_changed()
{
    last_virt_eip = -1;
    last_virt_esp = -1;
    if(!paging)
    {
        translate_address_write = translate_address_disabled;
        translate_address_read = translate_address_disabled;
    }
    else if(cpl)
    {
        translate_address_write = translate_address_user_write;
        translate_address_read = translate_address_user_read;
    }
    else
    {
        translate_address_write = translate_address_system_write;
        translate_address_read = translate_address_system_read;
    }
}
// functions that are used when paging is disabled
var npe_functions = {
    get_esp_read: get_esp_npe,
    get_esp_write: get_esp_npe,
    read_imm8: function()
    {
        return memory.mem8[instruction_pointer++];
    },
    read_imm8s: function()
    {
        return memory.mem8s[instruction_pointer++];
    },
    read_imm16 : function()
    {
        var data16 = memory.read16(instruction_pointer);
        instruction_pointer = instruction_pointer + 2 | 0;
        return data16;
    },
    read_imm32s : function()
    {
        var data32 = memory.read32s(instruction_pointer);
        instruction_pointer = instruction_pointer + 4 | 0;
        return data32;
    },
    safe_read8 : function(addr) { return memory.read8(addr) },
    safe_read8s : function(addr) { return memory.read8s(addr); },
    safe_read16 : function(addr) { return memory.read16(addr); },
    safe_read32s : function(addr) { return memory.read32s(addr); },
};
// functions that are used when paging is enabled
var pe_functions =
{
    get_esp_read: get_esp_pe_read,
    get_esp_write: get_esp_pe_write,
    read_imm8 : function()
    {
        if((instruction_pointer & ~0xFFF) ^ last_virt_eip)
        {
            eip_phys = translate_address_read(instruction_pointer) ^ instruction_pointer;
            last_virt_eip = instruction_pointer & ~0xFFF;
        }
        // memory.read8 inlined under the assumption that code never runs in 
        // memory-mapped io
        return memory.mem8[eip_phys ^ instruction_pointer++];
    },
    read_imm8s : function()
    {
        if((instruction_pointer & ~0xFFF) ^ last_virt_eip)
        {
            eip_phys = translate_address_read(instruction_pointer) ^ instruction_pointer;
            last_virt_eip = instruction_pointer & ~0xFFF;
        }
        return memory.mem8s[eip_phys ^ instruction_pointer++];
    },
    read_imm16 : function()
    {
        // Two checks in one comparison:
        //    1. Did the high 20 bits of eip change
        // or 2. Are the low 12 bits of eip 0xFFF (and this read crosses a page boundary)
        if((instruction_pointer ^ last_virt_eip) > 0xFFE)
        {
            return read_imm8() | read_imm8() << 8;
        }
        var data16 = memory.read16(eip_phys ^ instruction_pointer);
        instruction_pointer = instruction_pointer + 2 | 0;
        return data16;
    },
    read_imm32s : function()
    {
        // Analogue to the above comment
        if((instruction_pointer ^ last_virt_eip) > 0xFFC)
        {
            return read_imm16() | read_imm16() << 16;
        }
        var data32 = memory.read32s(eip_phys ^ instruction_pointer);
        instruction_pointer = instruction_pointer + 4 | 0;
        return data32;
    },
    safe_read8 : do_safe_read8,
    safe_read8s : do_safe_read8s,
    safe_read16 : do_safe_read16,
    safe_read32s : do_safe_read32s,
};
// read word from a page boundary, given 2 physical addresses
function virt_boundary_read16(low, high)
{
    dbg_assert((low & 0xFFF) === 0xFFF);
    dbg_assert((high & 0xFFF) === 0);
    return memory.read8(low) | memory.read8(high) << 8;
}
// read doubleword from a page boundary, given 2 addresses
function virt_boundary_read32s(low, high)
{
    dbg_assert((low & 0xFFF) >= 0xFFD);
    dbg_assert((high - 3 & 0xFFF) === (low & 0xFFF));
    var result = memory.read8(low) | memory.read8(high) << 24;
    if(low & 1)
    {
        if(low & 2)
        {
            // 0xFFF
            result |= memory.read8(high - 2) << 8 |
                        memory.read8(high - 1) << 16;
        }
        else
        {
            // 0xFFD
            result |= memory.read8(low + 1) << 8 |
                        memory.read8(low + 2) << 16;
        }
    }
    else
    {
        // 0xFFE
        result |= memory.read8(low + 1) << 8 |
                    memory.read8(high - 1) << 16;
    }
    return result;
}
function virt_boundary_write16(low, high, value)
{
    dbg_assert((low & 0xFFF) === 0xFFF);
    dbg_assert((high & 0xFFF) === 0);
    memory.write8(low, value);
    memory.write8(high, value >> 8);
}
function virt_boundary_write32(low, high, value)
{
    dbg_assert((low & 0xFFF) >= 0xFFD);
    dbg_assert((high - 3 & 0xFFF) === (low & 0xFFF));
    memory.write8(low, value);
    memory.write8(high, value >> 24);
    if(low & 1)
    {
        if(low & 2)
        {
            // 0xFFF
            memory.write8(high - 2, value >> 8);
            memory.write8(high - 1, value >> 16);
        }
        else
        {
            // 0xFFD
            memory.write8(low + 1, value >> 8);
            memory.write8(low + 2, value >> 16);
        }
    }
    else
    {
        // 0xFFE
        memory.write8(low + 1, value >> 8);
        memory.write8(high - 1, value >> 16);
    }
}
// safe_read, safe_write
// read or write byte, word or dword to the given *virtual* address,
// and be safe on page boundaries
function do_safe_read8(addr)
{
    return memory.read8(translate_address_read(addr));
}
function do_safe_read8s(addr)
{
    return memory.read8s(translate_address_read(addr));
}
function do_safe_read16(addr)
{
    if((addr & 0xFFF) === 0xFFF)
    {
        return safe_read8(addr) | safe_read8(addr + 1) << 8;
    }
    else
    {
        return memory.read16(translate_address_read(addr));
    }
}
function do_safe_read32s(addr)
{
    if((addr & 0xFFF) >= 0xFFD)
    {
        return safe_read16(addr) | safe_read16(addr + 2) << 16;
    }
    else
    {
        return memory.read32s(translate_address_read(addr));
    }
}
function safe_write8(addr, value)
{
    memory.write8(translate_address_write(addr), value);
}
function safe_write16(addr, value)
{
    var phys_low = translate_address_write(addr);
    if((addr & 0xFFF) === 0xFFF)
    {
        virt_boundary_write16(phys_low, translate_address_write(addr + 1), value);
    }
    else
    {
        memory.write16(phys_low, value);
    }
}
function safe_write32(addr, value)
{
    var phys_low = translate_address_write(addr);
    if((addr & 0xFFF) >= 0xFFD)
    {
        virt_boundary_write32(phys_low, translate_address_write(addr + 3), value);
    }
    else
    {
        memory.write32(phys_low, value);
    }
}
// read 2 or 4 byte from ip, depending on address size attribute
function read_moffs()
{
    if(address_size_32)
    {
        return get_seg_prefix(reg_ds) + read_imm32s();
    }
    else
    {
        return get_seg_prefix(reg_ds) + read_imm16();
    }
}
function get_flags()
{
    return (flags & ~flags_all) | getcf() | getpf() | getaf() | getzf() | getsf() | getof();
}
function load_flags()
{
    flags = get_flags();
    flags_changed = 0;
}
// get esp with paging disabled
function get_esp_npe(mod)
{
    if(stack_size_32)
    {
        return get_seg(reg_ss) + stack_reg[reg_vsp] + mod;
    }
    else
    {
        return get_seg(reg_ss) + (stack_reg[reg_vsp] + mod & 0xFFFF);
    }
}
function get_esp_pe_read(mod)
{
    // UNSAFE: stack_reg[reg_vsp]+mod needs to be masked in 16 bit mode 
    //   (only if paging is enabled and in 16 bit mode)
    return translate_address_read(get_seg(reg_ss) + stack_reg[reg_vsp] + mod);
}
function get_esp_pe_write(mod)
{
    return translate_address_write(get_seg(reg_ss) + stack_reg[reg_vsp] + mod);
}
/*
 * returns the "real" instruction pointer, 
 * without segment offset
 */
function get_real_ip()
{
    return instruction_pointer - get_seg(reg_cs);
}
function call_interrupt_vector(interrupt_nr, is_software_int, error_code)
{
    if(DEBUG)
    {
        ops.add(instruction_pointer);
        ops.add("-- INT " + h(interrupt_nr));
        ops.add(1);
    }
    //if(interrupt_nr == 0x13)
    //{
    //    dbg_log("INT 13");
    //    dbg_log(memory.read8(ch) + "/" + memory.read8(dh) + "/" + memory.read8(cl) + "   |" + memory.read8(al));
    //    dbg_log("=> ", h(memory.read16(es) * 16 + memory.read16(bx)));
    //}
    //if(interrupt_nr == 0x10)
    //{
    //    dbg_log("int10 ax=" + h(reg16[reg_ax], 4) + " '" + String.fromCharCode(reg8[reg_al]) + "'"); 
    //    dump_regs_short();
    //    if(reg8[reg_ah] == 0xe) vga.tt_write(reg8[reg_al]);
    //}
    //dbg_log("int " + h(interrupt_nr));
    //if(interrupt_nr === 0x13)
    //{
    //    dump_regs_short();
    //}
    //if(interrupt_nr === 0x80)
    //{
    //    dbg_log("linux syscall");
    //    dump_regs_short();
    //}
    if(interrupt_nr === 14)
    {
        dbg_log("int14 error_code=" + error_code + " cr2=" + h(cr2) + " prev=" + h(previous_ip) + " cpl=" + cpl, LOG_CPU);
    }
    if(in_hlt)
    {
        // return to the instruction following the hlt
        instruction_pointer++;
        in_hlt = false;
    }
    if(protected_mode)
    {
        if((interrupt_nr << 3 | 7) > idtr_size)
        {
            dbg_log(interrupt_nr, LOG_CPU);
            dbg_trace();
            throw unimpl("#GP handler");
        }
        var addr = idtr_offset + (interrupt_nr << 3) | 0;
        dbg_assert((addr & 0xFFF) < 0xFF8);
        if(paging)
        {
            addr = translate_address_system_read(addr);
        }
        var base = memory.read16(addr) | memory.read16(addr + 6) << 16,
            selector = memory.read16(addr + 2),
            type = memory.read8(addr + 5),
            dpl = type >> 5 & 3,
            is_trap;
        if((type & 128) === 0)
        {
            // present bit not set
            throw unimpl("#NP handler");
        }
        if(is_software_int && dpl < cpl)
        {
            trigger_gp(interrupt_nr << 3 | 2);
        }
        type &= 31;
        if(type === 14)
        {
            is_trap = false;
        }
        else if(type === 15)
        {
            is_trap = true;
        }
        else if(type === 5)
        {
            throw unimpl("call int to task gate");
        }
        else if(type === 6)
        {
            throw unimpl("16 bit interrupt gate");
        }
        else if(type === 7)
        {
            throw unimpl("16 bit trap gate");
        }
        else
        {
            // invalid type
            dbg_trace();
            dbg_log("invalid type: " + h(type));
            dbg_log(h(addr) + " " + h(base) + " " + h(selector));
            throw unimpl("#GP handler");
        }
        var info = lookup_segment_selector(selector);
        if(info.is_null)
        {
            dbg_log("is null");
            throw unimpl("#GP handler");
        }
        if(info === -1)
        {
            dbg_log("is -1");
            throw unimpl("#GP handler");
        }
        if(!info.is_executable || info.dpl > cpl)
        {
            dbg_log("not exec");
            throw unimpl("#GP handler");
        }
        if(!info.is_present)
        {
            dbg_log("not present");
            throw unimpl("#NP handler");
        }
        if(flags & flag_vm)
        {
            throw unimpl("VM flag");
        }
        if(!info.dc_bit && info.dpl < cpl)
        {
            // inter privilege level interrupt
            var tss_stack_addr = (info.dpl << 3) + 4;
            if(tss_stack_addr + 5 > tsr_size)
            {
                throw unimpl("#TS handler");
            }
            tss_stack_addr += tsr_offset;
            if(paging)
            {
                tss_stack_addr = translate_address_system_read(tss_stack_addr);
            }
            var new_esp = memory.read32s(tss_stack_addr),
                new_ss = memory.read16(tss_stack_addr + 4),
                ss_info = lookup_segment_selector(new_ss);
            if(ss_info.is_null)
            {
                throw unimpl("#TS handler");
            }
            if(ss_info.rpl !== info.dpl)
            {
                throw unimpl("#TS handler");
            }
            if(ss_info.dpl !== info.dpl || !ss_info.rw_bit)
            {
                throw unimpl("#TS handler");
            }
            if(!ss_info.is_present)
            {
                throw unimpl("#TS handler");
            }
            var old_esp = reg32s[reg_esp],
                old_ss = sreg[reg_ss];
            reg32[reg_esp] = new_esp;
            sreg[reg_ss] = new_ss;
            cpl = info.dpl;
            //dbg_log("int" + h(interrupt_nr, 2) +" from=" + h(instruction_pointer, 8) 
            //        + " cpl=" + cpl + " old ss:esp=" + h(old_ss,4) + ":" + h(old_esp,8), LOG_CPU);
            cpl_changed();
            push32(old_ss);
            push32(old_esp);
        }
        else if(info.dc_bit || info.dpl === cpl)
        {
            // intra privilege level interrupt
            //dbg_log("int" + h(interrupt_nr, 2) +" from=" + h(instruction_pointer, 8), LOG_CPU);
        }
        load_flags();
        push32(flags);
        push32(sreg[reg_cs]);
        push32(get_real_ip());
        //dbg_log("pushed eip to " + h(reg32[reg_esp], 8), LOG_CPU);
        if(error_code !== false)
        {
            dbg_assert(typeof error_code == "number");
            push32(error_code);
        }
        // TODO
        sreg[reg_cs] = selector;
        //switch_seg(reg_cs);
        //dbg_log("current esp: " + h(reg32[reg_esp]), LOG_CPU);
        //dbg_log("call int " + h(interrupt_nr) + " from " + h(instruction_pointer) + " to " + h(base) + " with error_code=" + error_code, LOG_CPU);
        instruction_pointer = get_seg(reg_cs) + base | 0;
        //dbg_log("int" + h(interrupt_nr) + " trap=" + is_trap + " if=" + +!!(flags & flag_interrupt));
        if(!is_trap)
        {
            // clear int flag for interrupt gates
            flags &= ~flag_interrupt;
        }
        else
        {
            handle_irqs();
        }
    }
    else
    {
        // call 4 byte cs:ip interrupt vector from ivt at memory 0
        //logop(instruction_pointer, "callu " + h(interrupt_nr) + "." + h(memory.read8(ah)));
        //dbg_log("callu " + h(interrupt_nr) + "." + h(memory.read8(ah)) + " at " + h(instruction_pointer, 8), LOG_CPU, LOG_CPU);
        // push flags, cs:ip
        load_flags();
        push16(flags);
        push16(sreg[reg_cs]);
        push16(get_real_ip());
        flags = flags & ~flag_interrupt;
        switch_seg(reg_cs, memory.read16((interrupt_nr << 2) + 2));
        instruction_pointer = get_seg(reg_cs) + memory.read16(interrupt_nr << 2) | 0;
    }
}
// assumes ip to point to the byte before the next instruction
function raise_exception(interrupt_nr)
{
    if(DEBUG)
    {
        // warn about error
        dbg_log("Exception " + h(interrupt_nr), LOG_CPU);
        dbg_trace();
        //throw "exception: " + interrupt_nr;
    }
    // TODO
    call_interrupt_vector(interrupt_nr, false, false);
    throw 0xDEADBEE;
}
function raise_exception_with_code(interrupt_nr, error_code)
{
    if(DEBUG)
    {
        dbg_log("Exception " + h(interrupt_nr) + " err=" + h(error_code), LOG_CPU);
        dbg_trace();
        //throw "exception: " + interrupt_nr;
    }
    call_interrupt_vector(interrupt_nr, false, error_code);
    throw 0xDEADBEE;
}
function trigger_de()
{
    instruction_pointer = previous_ip;
    raise_exception(0);
}
function trigger_ud()
{
    instruction_pointer = previous_ip;
    raise_exception(6);
}
function trigger_gp(code)
{
    instruction_pointer = previous_ip;
    raise_exception_with_code(13, code);
}
function trigger_np(code)
{
    instruction_pointer = previous_ip;
    raise_exception_with_code(11, code);
}
function trigger_ss(code)
{
    instruction_pointer = previous_ip;
    raise_exception_with_code(12, code);
}
/**
 * @param {number} seg
 */
function seg_prefix(seg)
{
    dbg_assert(segment_prefix === -1);
    dbg_assert(seg >= 0 && seg <= 5);
    segment_prefix = seg;
    table[read_imm8()]();
    segment_prefix = -1;
}
/**
 * Get segment base by prefix or default
 * @param {number} default_segment
 */
function get_seg_prefix(default_segment /*, offset*/)
{
    if(segment_prefix === -1)
    {
        return get_seg(default_segment /*, offset*/);
    }
    else
    {
        return get_seg(segment_prefix /*, offset*/);
    }
}
/**
 * Get segment base
 * @param {number} segment
 */
function get_seg(segment /*, offset*/)
{
    dbg_assert(segment >= 0 && segment < 8);
    dbg_assert(protected_mode || (sreg[segment] << 4) == segment_offsets[segment]);
    if(protected_mode)
    {
        if(segment_is_null[segment])
        {
            // trying to access null segment
            if(DEBUG)
            {
                dbg_log("Load null segment: " + h(segment), LOG_CPU);
                throw unimpl("#GP handler");
            }
        }
        // TODO: 
        // - validate segment limits
        // - validate if segment is writable
        // - set accessed bit
    }
    return segment_offsets[segment];
}
function arpl(seg, r16)
{
    flags_changed &= ~flag_zero;
    if((seg & 3) < (reg16[r16] & 3))
    {
        flags |= flag_zero;
        return seg & ~3 | reg16[r16] & 3;
    }
    else
    {
        flags &= ~flag_zero;
        return seg;
    }
}
function handle_irqs()
{
    if(pic)
    {
        if((flags & flag_interrupt) && !page_fault)
        {
            pic.handle_irqs();
        }
    }
}
// any two consecutive 8-bit ports can be treated as a 16-bit port;
// and four consecutive 8-bit ports can be treated as a 32-bit port
//
// http://css.csail.mit.edu/6.858/2012/readings/i386/s08_01.htm
function out8(port_addr, out_byte)
{
    if(privileges_for_io())
    {
        io.port_write(port_addr, out_byte);
    }
    else
    {
        trigger_gp(0);
    }
}
function out16(port_addr, out_word)
{
    if(privileges_for_io())
    {
        io.port_write(port_addr, out_word & 0xFF);
        io.port_write(port_addr + 1, out_word >> 8 & 0xFF);
    }
    else
    {
        trigger_gp(0);
    }
}
function out32(port_addr, out_dword)
{
    if(privileges_for_io())
    {
        io.port_write(port_addr, out_dword & 0xFF);
        io.port_write(port_addr + 1, out_dword >> 8 & 0xFF);
        io.port_write(port_addr + 2, out_dword >> 16 & 0xFF);
        io.port_write(port_addr + 3, out_dword >> 24 & 0xFF);
    }
    else
    {
        trigger_gp(0);
    }
}
function in8(port_addr)
{
    if(privileges_for_io())
    {
        return io.port_read(port_addr);
    }
    else
    {
        trigger_gp(0);
    }
}
function in16(port_addr)
{
    if(privileges_for_io())
    {
        return io.port_read(port_addr) |
                io.port_read(port_addr + 1) << 8;
    }
    else
    {
        trigger_gp(0);
    }
}
function in32(port_addr)
{
    if(privileges_for_io())
    {
        return io.port_read(port_addr) |
                io.port_read(port_addr + 1) << 8 |
                io.port_read(port_addr + 2) << 16 |
                io.port_read(port_addr + 3) << 24;
    }
    else
    {
        trigger_gp(0);
    }
}
/**
 * returns the current iopl from the eflags register
 */
function getiopl()
{
    return flags >> 12 & 3;
}
function privileges_for_io()
{
    return !protected_mode || cpl <= getiopl();
}
function cpuid()
{
    // cpuid
    // TODO: Fill in with less bogus values
    // http://lxr.linux.no/linux+%2a/arch/x86/include/asm/cpufeature.h
    var id = reg32s[reg_eax];
    if((id & 0x7FFFFFFF) === 0)
    {
        reg32[reg_eax] = 2;
        if(id === 0)
        {
            reg32[reg_ebx] = 0x756E6547; // Genu
            reg32[reg_edx] = 0x49656E69; // ineI
            reg32[reg_ecx] = 0x6C65746E; // ntel
        }
    }
    else if(id === 1)
    {
        // pentium
        reg32[reg_eax] = 0x513;
        reg32[reg_ebx] = 0;
        reg32[reg_ecx] = 0;
        reg32[reg_edx] = fpu.is_fpu | 1 << 3 | 1 << 4 | 1 << 8| 1 << 13 | 1 << 15;
    }
    else if(id === 2)
    {
        // Taken from http://siyobik.info.gf/main/reference/instruction/CPUID
        reg32[reg_eax] = 0x665B5001;
        reg32[reg_ebx] = 0;
        reg32[reg_ecx] = 0;
        reg32[reg_edx] = 0x007A7000;
    }
    else if(id === (0x80860000 | 0))
    {
        reg32[reg_eax] = 0;
        reg32[reg_ebx] = 0;
        reg32[reg_ecx] = 0;
        reg32[reg_edx] = 0;
    }
    else if((id & 0xF0000000) === ~~0x40000000)
    {
        // Invalid
    }
    else
    {
        if(DEBUG) throw "cpuid: unimplemented eax: " + h(id);
    }
}
/**
 * Update the flags register depending on iopl and cpl
 */
function update_flags(new_flags)
{
    if(cpl === 0 || !protected_mode)
    {
        // can update all flags
        flags = new_flags;
    }
    else if(cpl <= getiopl())
    {
        // cpl != 0 and iopl <= cpl
        // can update interrupt flag but not iopl
        flags = (new_flags & ~flag_iopl) | (flags & flag_iopl);
    }
    else
    {
        // cannot update interrupt flag or iopl
        flags = (new_flags & ~flag_iopl & ~flag_interrupt) | (flags & (flag_iopl | flag_interrupt));
    }
    flags_changed = 0;
    //flags = (flags & flags_mask) | flags_default;
}
function update_operand_size()
{
    if(operand_size_32)
    {
        table = table32;
        table0F = table0F_32;
    }
    else
    {
        table = table16;
        table0F = table0F_16;
    }
}
function update_address_size()
{
    if(address_size_32)
    {
        modrm_resolve = modrm_resolve32;
        regv = reg32;
        reg_vcx = reg_ecx;
        reg_vsi = reg_esi;
        reg_vdi = reg_edi;
    }
    else
    {
        modrm_resolve = modrm_resolve16;
        regv = reg16;
        reg_vcx = reg_cx;
        reg_vsi = reg_si;
        reg_vdi = reg_di;
    }
}
/**
 * @param {number} selector
 */
function lookup_segment_selector(selector)
{
    var is_gdt = (selector & 4) === 0,
        selector_offset = selector & ~7,
        info,
        table_offset,
        table_limit;
    info = {
        rpl: selector & 3,
        from_gdt: is_gdt,
        is_null: false,
        is_valid: true,
    };
    if(is_gdt)
    {
        table_offset = gdtr_offset;
        table_limit = gdtr_size;
    }
    else
    {
        table_offset = ldtr_offset
        table_limit = ldtr_size;
    }
    if(selector_offset === 0)
    {
        info.is_null = true;
        return info;
    }
    // limit is the number of entries in the table minus one
    if((selector_offset >> 3) > table_limit)
    {
        info.is_valid = false;
        return info;
    }
    table_offset += selector_offset;
    if(paging)
    {
        table_offset = translate_address_system_read(table_offset);
    }
    info.base = memory.read16(table_offset + 2) | memory.read8(table_offset + 4) << 16 |
            memory.read8(table_offset + 7) << 24,
    info.access = memory.read8(table_offset + 5),
    info.flags = memory.read8(table_offset + 6) >> 4,
    info.limit = memory.read16(table_offset) | (memory.read8(table_offset + 6) & 0xF) << 16,
    // used if system
    info.type = info.access & 0xF;
    info.dpl = info.access >> 5 & 3;
    info.is_system = (info.access & 0x10) === 0;
    info.is_present = (info.access & 0x80) === 0x80;
    info.is_executable = (info.access & 8) === 8;
    info.rw_bit = (info.access & 2) === 2;
    info.dc_bit = (info.access & 4) === 4;
    info.size = (info.flags & 4) === 4;
    info.granularity = (info.flags & 8) === 8;
    if(info.gr_bit)
    {
        info.real_limit = (info.limit << 12 | 0xFFF) >>> 0;
    }
    else
    {
        info.real_limit = info.limit;
    }
    info.is_writable = info.rw_bit && !info.is_executable;
    info.is_readable = info.rw_bit || !info.is_executable;
    return info;
}
/**
 * @param {number} reg
 * @param {number} selector
 */
function switch_seg(reg, selector)
{
    dbg_assert(reg >= 0 && reg <= 5);
    dbg_assert(typeof selector === "number" && selector < 0x10000 && selector >= 0);
    if(reg === reg_cs)
    {
        protected_mode = (cr0 & 1) === 1;
    }
    if(!protected_mode)
    {
        sreg[reg] = selector;
        segment_is_null[reg] = 0;
        segment_limits[reg] = 0xFFFFF;
        segment_offsets[reg] = selector << 4;
        return;
    }
    var info = lookup_segment_selector(selector);
    if(reg === reg_ss)
    {
        if(info.is_null)
        {
            trigger_gp(0);
            return false;
        }
        if(!info.is_valid ||
                info.is_system ||
                info.rpl !== cpl ||
                !info.is_writable ||
                info.dpl !== cpl)
        {
            trigger_gp(selector & ~3);
            return false;
        }
        if(!info.is_present)
        {
            trigger_ss(selector & ~3);
            return false;
        }
        stack_size_32 = info.size;
        if(info.size)
        {
            stack_reg = reg32s;
            reg_vsp = reg_esp;
            reg_vbp = reg_ebp;
        }
        else
        {
            stack_reg = reg16;
            reg_vsp = reg_sp;
            reg_vbp = reg_bp;
        }
    }
    else if(reg === reg_cs)
    {
        if(!info.is_executable)
        {
            // cs not executable
            dbg_log(info + " " + h(selector & ~3), LOG_CPU);
            throw unimpl("#GP handler");
        }
        if(info.is_system)
        {
            dbg_log(info + " " + h(selector & ~3), LOG_CPU);
            throw unimpl("load system segment descriptor, type = " + (info.access & 15));
        }
        if(info.dc_bit && (info.dpl !== info.rpl))
        {
            dbg_log(info + " " + h(selector & ~3), LOG_CPU);
            throw unimpl("#GP handler");
        }
        if(info.rpl !== cpl)
        {
            dbg_log(info + " " + h(selector & ~3), LOG_CPU);
            throw unimpl("privilege change");
        }
        dbg_assert(cpl === info.dpl);
        if(!info.dc_bit && info.dpl < cpl)
        {
            throw unimpl("inter privilege interrupt");
        }
        else
        {
            if(info.dc_bit || info.dpl === cpl)
            {
                // ok
            }
            else
            {
                // PE = 1, interrupt or trap gate, nonconforming code segment, DPL > CPL
                dbg_log(info + " " + h(selector & ~3), LOG_CPU);
                throw unimpl("#GP handler");
            }
        }
        operand_size_32 = address_size_32 = is_32 = info.size;
        update_operand_size();
        update_address_size();
    }
    else
    {
        // es, ds, fs, gs
        if(info.is_null)
        {
            sreg[reg] = selector;
            segment_is_null[reg] = 1;
            return true;
        }
        if(!info.is_valid ||
                info.is_system ||
                !info.is_readable ||
                ((!info.is_executable || !info.dc_bit) &&
                 info.rpl > info.dpl &&
                 cpl > info.dpl))
        {
            trigger_gp(selector & ~3);
            return false;
        }
        if(!info.is_present)
        {
            trigger_np(selector & ~3);
            return false;
        }
    }
    //dbg_log("seg " + reg + " " + h(info.base));
    segment_is_null[reg] = 0;
    segment_limits[reg] = info.real_limit;
    segment_infos[reg] = 0; // TODO
    segment_offsets[reg] = info.base;
    sreg[reg] = selector;
    return true;
}
function load_tr(selector)
{
    var info = lookup_segment_selector(selector);
    //dbg_log("load tr");
    if(!info.from_gdt)
    {
        throw unimpl("TR can only be loaded from GDT");
    }
    if(info.is_null)
    {
        dbg_log("#GP(0) | tried to load null selector (ltr)");
        throw unimpl("#GP handler");
    }
    if(!info.is_present)
    {
        dbg_log("#GP | present bit not set (ltr)");
        throw unimpl("#GP handler");
    }
    if(!info.is_system)
    {
        dbg_log("#GP | ltr: not a system entry");
        throw unimpl("#GP handler");
    }
    if(info.type !== 9)
    {
        dbg_log("#GP | ltr: invalid type (type = " + info.type + ")");
        throw unimpl("#GP handler");
    }
    tsr_size = info.limit;
    tsr_offset = info.base;
    //dbg_log("tsr at " + h(tsr_offset) + "; (" + tsr_size + " bytes)");
}
function load_ldt(selector)
{
    var info = lookup_segment_selector(selector);
    if(info.is_null)
    {
        // invalid
        ldtr_size = 0;
        ldtr_offset = 0;
        return;
    }
    if(!info.from_gdt)
    {
        throw unimpl("LDTR can only be loaded from GDT");
    }
    if(!info.is_present)
    {
        dbg_log("lldt: present bit not set");
        throw unimpl("#GP handler");
    }
    if(!info.is_system)
    {
        dbg_log("lldt: not a system entry");
        throw unimpl("#GP handler");
    }
    if(info.type !== 2)
    {
        dbg_log("lldt: invalid type (" + info.type + ")");
        throw unimpl("#GP handler");
    }
    ldtr_size = info.limit;
    ldtr_offset = info.base;
    //dbg_log("ldt at " + h(ldtr_offset) + "; (" + ldtr_size + " bytes)");
}
function clear_tlb()
{
    // clear tlb excluding global pages
    last_virt_eip = -1;
    last_virt_esp = -1;
    tlb_info.set(tlb_info_global);
    //dbg_log("page table loaded", LOG_CPU);
}
function full_clear_tlb()
{
    // clear tlb including global pages
    tlb_info_global = new Uint8Array(1 << 20);
    clear_tlb();
}
function invlpg(addr)
{
    var page = addr >>> 12;
    dbg_log("invlpg: " + h(page), LOG_CPU);
    tlb_info[page] = 0;
    tlb_info_global[page] = 0;
    last_virt_eip = -1;
    last_virt_esp = -1;
}
/**
 * @param {number} addr
 */
function translate_address_disabled(addr)
{
    return addr;
}
function translate_address_user_write(addr)
{
    var base = addr >>> 12;
    if(tlb_info[base] & TLB_USER_WRITE)
    {
        return tlb_user_write[base] ^ addr;
    }
    else
    {
        return do_page_translation(addr, 1, 1) | addr & 0xFFF;
    }
}
function translate_address_user_read(addr)
{
    var base = addr >>> 12;
    if(tlb_info[base] & TLB_USER_READ)
    {
        return tlb_user_read[base] ^ addr;
    }
    else
    {
        return do_page_translation(addr, 0, 1) | addr & 0xFFF;
    }
}
function translate_address_system_write(addr)
{
    var base = addr >>> 12;
    if(tlb_info[base] & TLB_SYSTEM_WRITE)
    {
        return tlb_system_write[base] ^ addr;
    }
    else
    {
        return do_page_translation(addr, 1, 0) | addr & 0xFFF;
    }
}
function translate_address_system_read(addr)
{
    var base = addr >>> 12;
    if(tlb_info[base] & TLB_SYSTEM_READ)
    {
        return tlb_system_read[base] ^ addr;
    }
    else
    {
        return do_page_translation(addr, 0, 0) | addr & 0xFFF;
    }
}
/**
 * @return {number} 
 */
function do_page_translation(addr, for_writing, user)
{
    var page = addr >>> 12,
        page_dir_addr = (cr3 >>> 2) + (page >> 10),
        page_dir_entry = memory.mem32s[page_dir_addr],
        high,
        can_write = true,
        global,
        cachable = true,
        allow_user = true;
    if(!(page_dir_entry & 1))
    {
        // to do at this place:
        //
        // - set cr2 = addr (which caused the page fault)
        // - call_interrupt_vector  with id 14, error code 0-7 (requires information if read or write)
        // - prevent execution of the function that triggered this call
        dbg_log("#PF not present", LOG_CPU);
        cr2 = addr;
        trigger_pagefault(for_writing, user, 0);
        // never reached as trigger_pagefault throws up
        dbg_assert(false);
    }
    if((page_dir_entry & 2) === 0)
    {
        can_write = false;
        if(for_writing)
        {
            cr2 = addr;
            trigger_pagefault(for_writing, user, 1);
            dbg_assert(false);
        }
    }
    if((page_dir_entry & 4) === 0)
    {
        allow_user = false;
        if(user)
        {
            // "Page Fault: page table accessed by non-supervisor";
            dbg_log("#PF supervisor", LOG_CPU);
            cr2 = addr;
            trigger_pagefault(for_writing, user, 1);
            dbg_assert(false);
        }
    }
    if((page_dir_entry & 0x10) === 0)
    {
        cachable = false;
    }
    if(page_dir_entry & page_size_extensions)
    {
        // size bit is set
        // set the accessed and dirty bits
        memory.mem32s[page_dir_addr] = page_dir_entry | 0x20 | for_writing << 6;
        high = (page_dir_entry & 0xFFC00000) | (page << 12 & 0x3FF000);
        global = page_dir_entry & 0x100;
    }
    else
    {
        var page_table_addr = ((page_dir_entry & 0xFFFFF000) >>> 2) + (page & 0x3FF),
            page_table_entry = memory.mem32s[page_table_addr];
        if(!(page_table_entry & 1))
        {
            dbg_log("#PF not present table", LOG_CPU);
            cr2 = addr;
            trigger_pagefault(for_writing, user, 0);
            dbg_assert(false);
        }
        if((page_table_entry & 2) === 0)
        {
            can_write = false;
            if(for_writing)
            {
                dbg_log("#PF not writable page", LOG_CPU);
                cr2 = addr;
                trigger_pagefault(for_writing, user, 1);
                dbg_assert(false);
            }
        }
        if((page_table_entry & 4) === 0)
        {
            allow_user = false;
            if(user)
            {
                dbg_log("#PF not supervisor page", LOG_CPU);
                cr2 = addr;
                trigger_pagefault(for_writing, user, 1);
                dbg_assert(false);
            }
        }
        if((page_table_entry & 0x10) === 0)
        {
            cachable = false;
        }
        // set the accessed and dirty bits
        memory.mem32s[page_dir_addr] = page_dir_entry | 0x20;
        memory.mem32s[page_table_addr] = page_table_entry | 0x20 | for_writing << 6;
        high = page_table_entry & 0xFFFFF000;
        global = page_table_entry & 0x100;
    }
    if(cachable)
    {
        var cache_entry = high ^ page << 12,
            info = 0;
        if(allow_user)
        {
            tlb_user_read[page] = cache_entry;
            info |= TLB_USER_READ;
            if(can_write)
            {
                tlb_user_write[page] = cache_entry;
                info |= TLB_USER_WRITE;
            }
        }
        tlb_system_read[page] = cache_entry;
        info |= TLB_SYSTEM_READ;
        if(can_write)
        {
            tlb_system_write[page] = cache_entry;
            info |= TLB_SYSTEM_WRITE;
        }
        tlb_info[page] |= info;
        if(global)
        {
            tlb_info_global[page] = info;
        }
    }
    return high ;
}
function trigger_pagefault(write, user, present)
{
    if(LOG_LEVEL & LOG_CPU)
    {
        dbg_trace();
    }
    if(page_fault)
    {
        dbg_trace();
        throw unimpl("Double fault");
    }
    instruction_pointer = previous_ip;
    page_fault = true;
    call_interrupt_vector(14, false, user << 2 | write << 1 | present);
    throw 0xDEADBEE;
}
// it looks pointless to have these two here, but 
// Closure Compiler is able to remove unused functions
//#include "test_helpers.js"
"use strict";
debug.dump_regs = dump_regs;
debug.dump_regs_short = dump_regs_short;
debug.dump_stack = dump_stack;
debug.dump_page_directory = dump_page_directory;
debug.dump_gdt_ldt = dump_gdt_ldt;
debug.dump_idt = dump_idt;
debug.step = step;
debug.run_until = run_until;
debug.debugger = function()
{
    debugger;
}
function step()
{
    step_mode = true;
    if(!running)
    {
        cycle();
    }
    dump_regs();
    var now = Date.now();
    vga.timer(now);
    timer.timer(now);
    rtc.timer(now);
    running = false;
}
function run_until()
{
    running = false;
    var a = parseInt(prompt("input hex", ""), 16);
    if(a) while(instruction_pointer != a) cycle()
    dump_regs();
}
// http://ref.x86asm.net/x86reference.xml
// for debuggin' purposes
var opcode_map = [
    "ADD", "ADD", "ADD", "ADD", "ADD", "ADD", "PUSH", "POP",
    "OR", "OR", "OR", "OR", "OR", "OR", "PUSH", "0F:",
    "ADC", "ADC", "ADC", "ADC", "ADC", "ADC", "PUSH", "POP",
    "SBB", "SBB", "SBB", "SBB", "SBB", "SBB", "PUSH", "POP",
    "AND", "AND", "AND", "AND", "AND", "AND", "ES", "DAA",
    "SUB", "SUB", "SUB", "SUB", "SUB", "SUB", "CS", "DAS",
    "XOR", "XOR", "XOR", "XOR", "XOR", "XOR", "SS", "AAA",
    "CMP", "CMP", "CMP", "CMP", "CMP", "CMP", "DS", "AAS",
    "INC", "INC", "INC", "INC", "INC", "INC", "INC", "INC",
    "DEC", "DEC", "DEC", "DEC", "DEC", "DEC", "DEC", "DEC",
    "PUSH", "PUSH", "PUSH", "PUSH", "PUSH", "PUSH", "PUSH", "PUSH",
    "POP", "POP", "POP", "POP", "POP", "POP", "POP", "POP",
    "PUSHA", "POPA", "BOUND", "ARPL", "FS", "GS", "none", "none",
    "PUSH", "IMUL", "PUSH", "IMUL", "INS", "INS", "OUTS", "OUTS",
    "JO", "JNO", "JB", "JNB", "JZ", "JNZ", "JBE", "JNBE",
    "JS", "JNS", "JP", "JNP", "JL", "JNL", "JLE", "JNLE",
    "ADD", "ADD", "ADD", "ADD", "TEST", "TEST", "XCHG", "XCHG",
    "MOV", "MOV", "MOV", "MOV", "MOV", "LEA", "MOV", "POP",
    "NOP", "XCHG", "XCHG", "XCHG", "XCHG", "XCHG", "XCHG", "XCHG",
    "CBW", "CWD", "CALLF", "FWAIT", "PUSHF", "POPF", "SAHF", "LAHF",
    "MOV", "MOV", "MOV", "MOV", "MOVS", "MOVS", "CMPS", "CMPS",
    "TEST", "TEST", "STOS", "STOS", "LODS", "LODS", "SCAS", "SCAS",
    "MOV", "MOV", "MOV", "MOV", "MOV", "MOV", "MOV", "MOV",
    "MOV", "MOV", "MOV", "MOV", "MOV", "MOV", "MOV", "MOV",
    "ROL", "ROL", "RETN", "RETN", "LES", "LDS", "MOV", "MOV",
    "ENTER", "LEAVE", "RETF", "RETF", "INT", "INT", "INTO", "IRET",
    "ROL", "ROL", "ROL", "ROL", "AAM", "AAD", "none", "XLAT",
    "FADD", "FLD", "FIADD", "FILD", "FADD", "FLD", "FIADD", "FILD",
    "LOOPNZ", "LOOPZ", "LOOP", "JCXZ", "IN", "IN", "OUT", "OUT",
    "CALL", "JMP", "JMPF", "JMP", "IN", "IN", "OUT", "OUT",
    "LOCK", "none", "REPNZ", "REPZ", "HLT", "CMC", "TEST", "TEST",
    "CLC", "STC", "CLI", "STI", "CLD", "STD", "INC", "INC"
];
function logop(_ip, op)
{
    if(!DEBUG || !ops)
    {
        return;
    }
    if(!step_mode)
    {
        //return;
    }
    ops.add(_ip);
    ops.add(opcode_map[op] || "unkown");
    ops.add(op);
}
function dump_stack(start, end)
{
    var esp = reg32[reg_esp];
    dbg_log("========= STACK ==========");
    if(end >= start || end === undefined)
    {
        start = 5;
        end = -5;
    }
    for(var i = start; i > end; i--)
    {
        var line = "    ";
        if(!i) line = "=>  ";
        line += h(i, 2) + " | ";
        dbg_log(line + h(esp + 4 * i, 8) + " | " + h(memory.read32s(esp + 4 * i) >>> 0));
    }
}
function dump_regs_short()
{
    var
        r32 = { "eax": reg_eax, "ecx": reg_ecx, "edx": reg_edx, "ebx": reg_ebx,
                "esp": reg_esp, "ebp": reg_ebp, "esi": reg_esi, "edi": reg_edi },
        r32_names = ["eax", "ecx", "edx", "ebx", "esp", "ebp", "esi", "edi"],
        s = { "cs": reg_cs, "ds": reg_ds, "es": reg_es, "fs": reg_fs, "gs": reg_gs, "ss": reg_ss },
        line1 = "",
        line2 = "";
    for(var i = 0; i < 4; i++)
    {
        line1 += r32_names[i] + "=" + h(reg32[r32[r32_names[i]]], 8) + " ";
        line2 += r32_names[i+4] + "=" + h(reg32[r32[r32_names[i+4]]], 8) + " ";
    }
    line1 += " eip=" + h(get_real_ip(), 8);
    line2 += " flg=" + h(get_flags());
    line1 += "  ds=" + h(sreg[reg_ds], 4) + " es=" + h(sreg[reg_es], 4) + "  fs=" + h(sreg[reg_fs], 4);
    line2 += "  gs=" + h(sreg[reg_gs], 4) + " cs=" + h(sreg[reg_cs], 4) + "  ss=" + h(sreg[reg_ss], 4);
    dbg_log(line1);
    dbg_log(line2);
}
function dump_regs()
{
    var
        r32 = { "eax": reg_eax, "ecx": reg_ecx, "edx": reg_edx, "ebx": reg_ebx,
                "esp": reg_esp, "ebp": reg_ebp, "esi": reg_esi, "edi": reg_edi },
        s = { "cs": reg_cs, "ds": reg_ds, "es": reg_es,
              "fs": reg_fs, "gs": reg_gs, "ss": reg_ss },
        out = "";
    var opcodes = ops.toArray();
    for(var i = 0; i < opcodes.length; i += 3)
    {
        if(opcodes[i])
        {
            out += h(opcodes[i], 6) + ":        " +
                String.pads(opcodes[i + 1], 20) + h(opcodes[i + 2], 2) + "\n";
        }
    }
    //dbg_log(out.substr(0, out.length - 1));
    log(out.substr(0, out.length - 1));
    ops.clear();
    dbg_log("----- DUMP (ip = 0x" + h(instruction_pointer >>> 0) + ") ----------")
    dbg_log("protected mode: " + protected_mode);
    for(i in r32)
    {
        dbg_log(i + " =  0x" + h(reg32[r32[i]], 8));
    }
    dbg_log("eip =  0x" + h(get_real_ip(), 8));
    for(i in s)
    {
        dbg_log(i + "  =  0x" + h(sreg[s[i]], 4));
        //var infos = segment_cache[ s[i] - registers_start >> 1 ];
        /*if(infos)
        {
            dbg_log(infos);
        }*/
    }
    out = "";
    var flg = { "cf": getcf, "pf": getpf, "zf": getzf, "sf": getsf,
                "of": getof, "df": flag_direction, "if": flag_interrupt };
    for(var i in flg)
    {
        if(+flg[i])
        {
            out += i + "=" + Number(!!(flags & flg[i])) + " | ";
        }
        else
        {
            out += i + "=" + Number(!!flg[i]()) + " | ";
        }
    }
    out += "iopl=" + getiopl();
    dbg_log(out);
    //dbg_log("last operation: " + h(last_op1 | 0) + ", " +  h(last_op2 | 0) + " = " +
            //h(last_result | 0) + " (" + last_op_size + " bit)")
}
function dump_gdt_ldt()
{
    dbg_log("gdt: (len = " + h(gdtr_size) + ")");
    dump_table(translate_address_read(gdtr_offset), gdtr_size);
    dbg_log("\nldt: (len = " + h(ldtr_size) + ")");
    dump_table(translate_address_read(ldtr_offset), ldtr_size);
    function dump_table(addr, size)
    {
        for(var i = 0; i < size; i += 8, addr += 8)
        {
            var base = memory.read16(addr + 2) |
                    memory.read8(addr + 4) << 16 |
                    memory.read8(addr + 7) << 24,
                limit = (memory.read16(addr) | memory.read8(addr + 6) & 0xF) + 1,
                access = memory.read8(addr + 5),
                flags = memory.read8(addr + 6) >> 4,
                flags_str = '',
                dpl = access >> 5 & 3;
            if(!(access & 128))
            {
                // present bit not set
                //continue;
                flags_str += 'NP ';
            }
            else
            {
                flags_str += ' P ';
            }
            if(access & 16)
            {
                if(flags & 4)
                {
                    flags_str += '32b ';
                }
                else
                {
                    flags_str += '16b ';
                }
                if(access & 8)
                {
                    // executable
                    flags_str += 'X ';
                    if(access & 4)
                    {
                        flags_str += 'C ';
                    }
                }
                else
                {
                    // data
                    flags_str += 'R ';
                }
            }
            else
            {
                // system
                flags_str += 'sys: ' + h(access & 15);
            }
            if(flags & 8)
            {
                limit <<= 12;
            }
            dbg_log(h(i & ~7, 4) + " " + h(base >>> 0, 8) + " (" + h(limit, 8) + " bytes) " +
                    flags_str + ";  dpl = " + dpl + ", a = " + access.toString(2) +
                    ", f = " + flags.toString(2));
        }
    }
}
function dump_idt()
{
    for(var i = 0; i < idtr_size; i += 8)
    {
        var addr = do_page_translation(idtr_offset + i, 0, 0),
            base = memory.read16(addr) | memory.read16(addr + 6) << 16,
            selector = memory.read16(addr + 2),
            type = memory.read8(addr + 5),
            line,
            dpl = type >> 5 & 3;
        if((type & 31) === 5)
        {
            line = 'task gate ';
        }
        else if((type & 31) === 14)
        {
            line = 'intr gate ';
        }
        else if((type & 31) === 15)
        {
            line = 'trap gate ';
        }
        else
        {
            line = 'invalid   ';
        }
        if(type & 128)
        {
            line += ' P';
        }
        else
        {
            // present bit not set
            //continue;
            line += 'NP';
        }
        dbg_log(h(i >> 3, 4) + " " + h(base >>> 0, 8) + ", " +
                h(selector, 4) + "; " + line + ";  dpl = " + dpl + ", t = " + type.toString(2));
    }
}
function load_page_entry(dword_entry, is_directory)
{
    if(!(dword_entry & 1))
    {
        // present bit not set
        return false;
    }
    var size = (dword_entry & 128) === 128,
        address;
    if(size && !is_directory)
    {
        address = dword_entry & 0xFFC00000;
    }
    else
    {
        address = dword_entry & 0xFFFFF000;
    }
    return {
        size: size,
        global: (dword_entry & 256) === 256,
        accessed: (dword_entry & 0x20) === 0x20,
        dirty: (dword_entry & 0x40) === 0x40,
        cache : (dword_entry & 16) === 16,
        user : (dword_entry & 4) === 4,
        read_write : (dword_entry & 2) === 2,
        address : address >>> 0
    };
}
function dump_page_directory()
{
    for(var i = 0; i < 1024; i++)
    {
        var dword = memory.read32s(cr3 + 4 * i),
            entry = load_page_entry(dword, true);
        if(!entry)
        {
            continue;
        }
        var flags = '';
        if(entry.size)
            flags += 'S ';
        if(entry.cache)
            flags += 'D ';
        if(entry.user)
            flags += 'U ';
        if(entry.read_write)
            flags += 'R ';
        if(entry.accessed)
            flags += 'A ';
        dbg_log("=== " + h(entry.address >>> 0, 8) + " | " + flags);
        //dbg_log("=========================")
        if(entry.size)
        {
            continue;
        }
        for(var j = 0; j < 1024; j++)
        {
            dword = memory.read32s(entry.address + 4 * j);
            var subentry = load_page_entry(dword, false);
            if(subentry)
            {
                flags = '';
                if(subentry.size)
                    flags += 'S ';
                if(subentry.cache)
                    flags += 'D ';
                if(subentry.user)
                    flags += 'U ';
                if(subentry.read_write)
                    flags += 'R ';
                if(subentry.global)
                    flags += 'G ';
                if(subentry.accessed)
                    flags += 'A ';
                if(subentry.dirty)
                    flags += 'Di ';
                dbg_log("# " + h((i << 22 | j << 12) >>> 0, 8) + " -> " +
                        h(subentry.address, 8) + " | " + flags);
            }
        }
    }
}
/*
 * This file contains functions to decode the modrm and sib bytes
 *
 * These functions return a virtual address
 *
 * Gets #included by cpu.macro.js
 */
"use strict";
var modrm_resolve16,
    modrm_resolve32;
(function() {
var modrm_table16 = Array(0xC0),
    modrm_table32 = Array(0xC0),
    sib_table = Array(0x100);
modrm_table16[0x00 | 0] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_bx] + reg16[reg_si]) & 0xFFFF) | 0; }; modrm_table16[0x40 | 0] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_bx] + reg16[reg_si]) + read_imm8s() & 0xFFFF) | 0; }; modrm_table16[0x80 | 0] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_bx] + reg16[reg_si]) + read_imm16() & 0xFFFF) | 0; };
modrm_table16[0x00 | 1] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_bx] + reg16[reg_di]) & 0xFFFF) | 0; }; modrm_table16[0x40 | 1] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_bx] + reg16[reg_di]) + read_imm8s() & 0xFFFF) | 0; }; modrm_table16[0x80 | 1] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_bx] + reg16[reg_di]) + read_imm16() & 0xFFFF) | 0; };
modrm_table16[0x00 | 2] = function() { return get_seg_prefix(reg_ss) + ((reg16[reg_bp] + reg16[reg_si]) & 0xFFFF) | 0; }; modrm_table16[0x40 | 2] = function() { return get_seg_prefix(reg_ss) + ((reg16[reg_bp] + reg16[reg_si]) + read_imm8s() & 0xFFFF) | 0; }; modrm_table16[0x80 | 2] = function() { return get_seg_prefix(reg_ss) + ((reg16[reg_bp] + reg16[reg_si]) + read_imm16() & 0xFFFF) | 0; };
modrm_table16[0x00 | 3] = function() { return get_seg_prefix(reg_ss) + ((reg16[reg_bp] + reg16[reg_di]) & 0xFFFF) | 0; }; modrm_table16[0x40 | 3] = function() { return get_seg_prefix(reg_ss) + ((reg16[reg_bp] + reg16[reg_di]) + read_imm8s() & 0xFFFF) | 0; }; modrm_table16[0x80 | 3] = function() { return get_seg_prefix(reg_ss) + ((reg16[reg_bp] + reg16[reg_di]) + read_imm16() & 0xFFFF) | 0; };
modrm_table16[0x00 | 4] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_si]) & 0xFFFF) | 0; }; modrm_table16[0x40 | 4] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_si]) + read_imm8s() & 0xFFFF) | 0; }; modrm_table16[0x80 | 4] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_si]) + read_imm16() & 0xFFFF) | 0; };
modrm_table16[0x00 | 5] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_di]) & 0xFFFF) | 0; }; modrm_table16[0x40 | 5] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_di]) + read_imm8s() & 0xFFFF) | 0; }; modrm_table16[0x80 | 5] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_di]) + read_imm16() & 0xFFFF) | 0; };
modrm_table16[0x00 | 6] = function() { return get_seg_prefix(reg_ss) + ((reg16[reg_bp]) & 0xFFFF) | 0; }; modrm_table16[0x40 | 6] = function() { return get_seg_prefix(reg_ss) + ((reg16[reg_bp]) + read_imm8s() & 0xFFFF) | 0; }; modrm_table16[0x80 | 6] = function() { return get_seg_prefix(reg_ss) + ((reg16[reg_bp]) + read_imm16() & 0xFFFF) | 0; };
modrm_table16[0x00 | 7] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_bx]) & 0xFFFF) | 0; }; modrm_table16[0x40 | 7] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_bx]) + read_imm8s() & 0xFFFF) | 0; }; modrm_table16[0x80 | 7] = function() { return get_seg_prefix(reg_ds) + ((reg16[reg_bx]) + read_imm16() & 0xFFFF) | 0; };
modrm_table32[0x00 | 0] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_eax]) | 0; }; modrm_table32[0x40 | 0] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_eax]) + read_imm8s() | 0; }; modrm_table32[0x80 | 0] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_eax]) + read_imm32s() | 0; };;
modrm_table32[0x00 | 1] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_ecx]) | 0; }; modrm_table32[0x40 | 1] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_ecx]) + read_imm8s() | 0; }; modrm_table32[0x80 | 1] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_ecx]) + read_imm32s() | 0; };;
modrm_table32[0x00 | 2] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_edx]) | 0; }; modrm_table32[0x40 | 2] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_edx]) + read_imm8s() | 0; }; modrm_table32[0x80 | 2] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_edx]) + read_imm32s() | 0; };;
modrm_table32[0x00 | 3] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_ebx]) | 0; }; modrm_table32[0x40 | 3] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_ebx]) + read_imm8s() | 0; }; modrm_table32[0x80 | 3] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_ebx]) + read_imm32s() | 0; };;
modrm_table32[0x00 | 4] = function() { return (getsib(false)) | 0; }; modrm_table32[0x40 | 4] = function() { return (getsib(false)) + read_imm8s() | 0; }; modrm_table32[0x80 | 4] = function() { return (getsib(false)) + read_imm32s() | 0; };;
modrm_table32[0x00 | 5] = function() { return (get_seg_prefix(reg_ss) + reg32s[reg_ebp]) | 0; }; modrm_table32[0x40 | 5] = function() { return (get_seg_prefix(reg_ss) + reg32s[reg_ebp]) + read_imm8s() | 0; }; modrm_table32[0x80 | 5] = function() { return (get_seg_prefix(reg_ss) + reg32s[reg_ebp]) + read_imm32s() | 0; };;
modrm_table32[0x00 | 6] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_esi]) | 0; }; modrm_table32[0x40 | 6] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_esi]) + read_imm8s() | 0; }; modrm_table32[0x80 | 6] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_esi]) + read_imm32s() | 0; };;
modrm_table32[0x00 | 7] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_edi]) | 0; }; modrm_table32[0x40 | 7] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_edi]) + read_imm8s() | 0; }; modrm_table32[0x80 | 7] = function() { return (get_seg_prefix(reg_ds) + reg32s[reg_edi]) + read_imm32s() | 0; };;
// special cases
modrm_table16[0x00 | 6] = function() { return get_seg_prefix(reg_ds) + read_imm16() | 0; }
modrm_table32[0x00 | 5] = function() { return get_seg_prefix(reg_ds) + read_imm32s() | 0; };
modrm_table32[0x00 | 4] = function() { return getsib(false) | 0; };
modrm_table32[0x40 | 4] = function() { return getsib(true) + read_imm8s() | 0; };
modrm_table32[0x80 | 4] = function() { return getsib(true) + read_imm32s() | 0; };
for(var low = 0; low < 8; low++)
{
    for(var high = 0; high < 3; high++)
    {
        for(var i = 1; i < 8; i++)
        {
            var x = low | high << 6;
            modrm_table32[x | i << 3] = modrm_table32[x];
            modrm_table16[x | i << 3] = modrm_table16[x];
        }
    }
}
sib_table[0x00 | 0 << 3 | 0] = function(mod) { return (reg32s[reg_eax]) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x00 | 0 << 3 | 1] = function(mod) { return (reg32s[reg_eax]) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x00 | 0 << 3 | 2] = function(mod) { return (reg32s[reg_eax]) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x00 | 0 << 3 | 3] = function(mod) { return (reg32s[reg_eax]) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x00 | 0 << 3 | 4] = function(mod) { return (reg32s[reg_eax]) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x00 | 0 << 3 | 5] = function(mod) { return (reg32s[reg_eax]) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x00 | 0 << 3 | 6] = function(mod) { return (reg32s[reg_eax]) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x00 | 0 << 3 | 7] = function(mod) { return (reg32s[reg_eax]) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x40 | 0 << 3 | 0] = function(mod) { return (reg32s[reg_eax] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x40 | 0 << 3 | 1] = function(mod) { return (reg32s[reg_eax] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x40 | 0 << 3 | 2] = function(mod) { return (reg32s[reg_eax] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x40 | 0 << 3 | 3] = function(mod) { return (reg32s[reg_eax] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x40 | 0 << 3 | 4] = function(mod) { return (reg32s[reg_eax] << 1) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x40 | 0 << 3 | 5] = function(mod) { return (reg32s[reg_eax] << 1) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x40 | 0 << 3 | 6] = function(mod) { return (reg32s[reg_eax] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x40 | 0 << 3 | 7] = function(mod) { return (reg32s[reg_eax] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x80 | 0 << 3 | 0] = function(mod) { return (reg32s[reg_eax] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x80 | 0 << 3 | 1] = function(mod) { return (reg32s[reg_eax] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x80 | 0 << 3 | 2] = function(mod) { return (reg32s[reg_eax] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x80 | 0 << 3 | 3] = function(mod) { return (reg32s[reg_eax] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x80 | 0 << 3 | 4] = function(mod) { return (reg32s[reg_eax] << 2) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x80 | 0 << 3 | 5] = function(mod) { return (reg32s[reg_eax] << 2) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x80 | 0 << 3 | 6] = function(mod) { return (reg32s[reg_eax] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x80 | 0 << 3 | 7] = function(mod) { return (reg32s[reg_eax] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0xC0 | 0 << 3 | 0] = function(mod) { return (reg32s[reg_eax] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0xC0 | 0 << 3 | 1] = function(mod) { return (reg32s[reg_eax] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0xC0 | 0 << 3 | 2] = function(mod) { return (reg32s[reg_eax] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0xC0 | 0 << 3 | 3] = function(mod) { return (reg32s[reg_eax] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0xC0 | 0 << 3 | 4] = function(mod) { return (reg32s[reg_eax] << 3) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0xC0 | 0 << 3 | 5] = function(mod) { return (reg32s[reg_eax] << 3) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0xC0 | 0 << 3 | 6] = function(mod) { return (reg32s[reg_eax] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0xC0 | 0 << 3 | 7] = function(mod) { return (reg32s[reg_eax] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; };;
sib_table[0x00 | 1 << 3 | 0] = function(mod) { return (reg32s[reg_ecx]) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x00 | 1 << 3 | 1] = function(mod) { return (reg32s[reg_ecx]) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x00 | 1 << 3 | 2] = function(mod) { return (reg32s[reg_ecx]) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x00 | 1 << 3 | 3] = function(mod) { return (reg32s[reg_ecx]) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x00 | 1 << 3 | 4] = function(mod) { return (reg32s[reg_ecx]) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x00 | 1 << 3 | 5] = function(mod) { return (reg32s[reg_ecx]) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x00 | 1 << 3 | 6] = function(mod) { return (reg32s[reg_ecx]) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x00 | 1 << 3 | 7] = function(mod) { return (reg32s[reg_ecx]) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x40 | 1 << 3 | 0] = function(mod) { return (reg32s[reg_ecx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x40 | 1 << 3 | 1] = function(mod) { return (reg32s[reg_ecx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x40 | 1 << 3 | 2] = function(mod) { return (reg32s[reg_ecx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x40 | 1 << 3 | 3] = function(mod) { return (reg32s[reg_ecx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x40 | 1 << 3 | 4] = function(mod) { return (reg32s[reg_ecx] << 1) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x40 | 1 << 3 | 5] = function(mod) { return (reg32s[reg_ecx] << 1) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x40 | 1 << 3 | 6] = function(mod) { return (reg32s[reg_ecx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x40 | 1 << 3 | 7] = function(mod) { return (reg32s[reg_ecx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x80 | 1 << 3 | 0] = function(mod) { return (reg32s[reg_ecx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x80 | 1 << 3 | 1] = function(mod) { return (reg32s[reg_ecx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x80 | 1 << 3 | 2] = function(mod) { return (reg32s[reg_ecx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x80 | 1 << 3 | 3] = function(mod) { return (reg32s[reg_ecx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x80 | 1 << 3 | 4] = function(mod) { return (reg32s[reg_ecx] << 2) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x80 | 1 << 3 | 5] = function(mod) { return (reg32s[reg_ecx] << 2) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x80 | 1 << 3 | 6] = function(mod) { return (reg32s[reg_ecx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x80 | 1 << 3 | 7] = function(mod) { return (reg32s[reg_ecx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0xC0 | 1 << 3 | 0] = function(mod) { return (reg32s[reg_ecx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0xC0 | 1 << 3 | 1] = function(mod) { return (reg32s[reg_ecx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0xC0 | 1 << 3 | 2] = function(mod) { return (reg32s[reg_ecx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0xC0 | 1 << 3 | 3] = function(mod) { return (reg32s[reg_ecx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0xC0 | 1 << 3 | 4] = function(mod) { return (reg32s[reg_ecx] << 3) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0xC0 | 1 << 3 | 5] = function(mod) { return (reg32s[reg_ecx] << 3) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0xC0 | 1 << 3 | 6] = function(mod) { return (reg32s[reg_ecx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0xC0 | 1 << 3 | 7] = function(mod) { return (reg32s[reg_ecx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; };;
sib_table[0x00 | 2 << 3 | 0] = function(mod) { return (reg32s[reg_edx]) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x00 | 2 << 3 | 1] = function(mod) { return (reg32s[reg_edx]) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x00 | 2 << 3 | 2] = function(mod) { return (reg32s[reg_edx]) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x00 | 2 << 3 | 3] = function(mod) { return (reg32s[reg_edx]) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x00 | 2 << 3 | 4] = function(mod) { return (reg32s[reg_edx]) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x00 | 2 << 3 | 5] = function(mod) { return (reg32s[reg_edx]) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x00 | 2 << 3 | 6] = function(mod) { return (reg32s[reg_edx]) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x00 | 2 << 3 | 7] = function(mod) { return (reg32s[reg_edx]) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x40 | 2 << 3 | 0] = function(mod) { return (reg32s[reg_edx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x40 | 2 << 3 | 1] = function(mod) { return (reg32s[reg_edx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x40 | 2 << 3 | 2] = function(mod) { return (reg32s[reg_edx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x40 | 2 << 3 | 3] = function(mod) { return (reg32s[reg_edx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x40 | 2 << 3 | 4] = function(mod) { return (reg32s[reg_edx] << 1) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x40 | 2 << 3 | 5] = function(mod) { return (reg32s[reg_edx] << 1) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x40 | 2 << 3 | 6] = function(mod) { return (reg32s[reg_edx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x40 | 2 << 3 | 7] = function(mod) { return (reg32s[reg_edx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x80 | 2 << 3 | 0] = function(mod) { return (reg32s[reg_edx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x80 | 2 << 3 | 1] = function(mod) { return (reg32s[reg_edx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x80 | 2 << 3 | 2] = function(mod) { return (reg32s[reg_edx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x80 | 2 << 3 | 3] = function(mod) { return (reg32s[reg_edx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x80 | 2 << 3 | 4] = function(mod) { return (reg32s[reg_edx] << 2) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x80 | 2 << 3 | 5] = function(mod) { return (reg32s[reg_edx] << 2) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x80 | 2 << 3 | 6] = function(mod) { return (reg32s[reg_edx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x80 | 2 << 3 | 7] = function(mod) { return (reg32s[reg_edx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0xC0 | 2 << 3 | 0] = function(mod) { return (reg32s[reg_edx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0xC0 | 2 << 3 | 1] = function(mod) { return (reg32s[reg_edx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0xC0 | 2 << 3 | 2] = function(mod) { return (reg32s[reg_edx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0xC0 | 2 << 3 | 3] = function(mod) { return (reg32s[reg_edx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0xC0 | 2 << 3 | 4] = function(mod) { return (reg32s[reg_edx] << 3) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0xC0 | 2 << 3 | 5] = function(mod) { return (reg32s[reg_edx] << 3) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0xC0 | 2 << 3 | 6] = function(mod) { return (reg32s[reg_edx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0xC0 | 2 << 3 | 7] = function(mod) { return (reg32s[reg_edx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; };;
sib_table[0x00 | 3 << 3 | 0] = function(mod) { return (reg32s[reg_ebx]) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x00 | 3 << 3 | 1] = function(mod) { return (reg32s[reg_ebx]) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x00 | 3 << 3 | 2] = function(mod) { return (reg32s[reg_ebx]) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x00 | 3 << 3 | 3] = function(mod) { return (reg32s[reg_ebx]) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x00 | 3 << 3 | 4] = function(mod) { return (reg32s[reg_ebx]) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x00 | 3 << 3 | 5] = function(mod) { return (reg32s[reg_ebx]) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x00 | 3 << 3 | 6] = function(mod) { return (reg32s[reg_ebx]) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x00 | 3 << 3 | 7] = function(mod) { return (reg32s[reg_ebx]) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x40 | 3 << 3 | 0] = function(mod) { return (reg32s[reg_ebx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x40 | 3 << 3 | 1] = function(mod) { return (reg32s[reg_ebx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x40 | 3 << 3 | 2] = function(mod) { return (reg32s[reg_ebx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x40 | 3 << 3 | 3] = function(mod) { return (reg32s[reg_ebx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x40 | 3 << 3 | 4] = function(mod) { return (reg32s[reg_ebx] << 1) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x40 | 3 << 3 | 5] = function(mod) { return (reg32s[reg_ebx] << 1) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x40 | 3 << 3 | 6] = function(mod) { return (reg32s[reg_ebx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x40 | 3 << 3 | 7] = function(mod) { return (reg32s[reg_ebx] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x80 | 3 << 3 | 0] = function(mod) { return (reg32s[reg_ebx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x80 | 3 << 3 | 1] = function(mod) { return (reg32s[reg_ebx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x80 | 3 << 3 | 2] = function(mod) { return (reg32s[reg_ebx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x80 | 3 << 3 | 3] = function(mod) { return (reg32s[reg_ebx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x80 | 3 << 3 | 4] = function(mod) { return (reg32s[reg_ebx] << 2) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x80 | 3 << 3 | 5] = function(mod) { return (reg32s[reg_ebx] << 2) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x80 | 3 << 3 | 6] = function(mod) { return (reg32s[reg_ebx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x80 | 3 << 3 | 7] = function(mod) { return (reg32s[reg_ebx] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0xC0 | 3 << 3 | 0] = function(mod) { return (reg32s[reg_ebx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0xC0 | 3 << 3 | 1] = function(mod) { return (reg32s[reg_ebx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0xC0 | 3 << 3 | 2] = function(mod) { return (reg32s[reg_ebx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0xC0 | 3 << 3 | 3] = function(mod) { return (reg32s[reg_ebx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0xC0 | 3 << 3 | 4] = function(mod) { return (reg32s[reg_ebx] << 3) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0xC0 | 3 << 3 | 5] = function(mod) { return (reg32s[reg_ebx] << 3) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0xC0 | 3 << 3 | 6] = function(mod) { return (reg32s[reg_ebx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0xC0 | 3 << 3 | 7] = function(mod) { return (reg32s[reg_ebx] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; };;
sib_table[0x00 | 4 << 3 | 0] = function(mod) { return (0) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x00 | 4 << 3 | 1] = function(mod) { return (0) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x00 | 4 << 3 | 2] = function(mod) { return (0) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x00 | 4 << 3 | 3] = function(mod) { return (0) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x00 | 4 << 3 | 4] = function(mod) { return (0) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x00 | 4 << 3 | 5] = function(mod) { return (0) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x00 | 4 << 3 | 6] = function(mod) { return (0) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x00 | 4 << 3 | 7] = function(mod) { return (0) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x40 | 4 << 3 | 0] = function(mod) { return (0 << 1) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x40 | 4 << 3 | 1] = function(mod) { return (0 << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x40 | 4 << 3 | 2] = function(mod) { return (0 << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x40 | 4 << 3 | 3] = function(mod) { return (0 << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x40 | 4 << 3 | 4] = function(mod) { return (0 << 1) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x40 | 4 << 3 | 5] = function(mod) { return (0 << 1) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x40 | 4 << 3 | 6] = function(mod) { return (0 << 1) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x40 | 4 << 3 | 7] = function(mod) { return (0 << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x80 | 4 << 3 | 0] = function(mod) { return (0 << 2) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x80 | 4 << 3 | 1] = function(mod) { return (0 << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x80 | 4 << 3 | 2] = function(mod) { return (0 << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x80 | 4 << 3 | 3] = function(mod) { return (0 << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x80 | 4 << 3 | 4] = function(mod) { return (0 << 2) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x80 | 4 << 3 | 5] = function(mod) { return (0 << 2) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x80 | 4 << 3 | 6] = function(mod) { return (0 << 2) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x80 | 4 << 3 | 7] = function(mod) { return (0 << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0xC0 | 4 << 3 | 0] = function(mod) { return (0 << 3) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0xC0 | 4 << 3 | 1] = function(mod) { return (0 << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0xC0 | 4 << 3 | 2] = function(mod) { return (0 << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0xC0 | 4 << 3 | 3] = function(mod) { return (0 << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0xC0 | 4 << 3 | 4] = function(mod) { return (0 << 3) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0xC0 | 4 << 3 | 5] = function(mod) { return (0 << 3) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0xC0 | 4 << 3 | 6] = function(mod) { return (0 << 3) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0xC0 | 4 << 3 | 7] = function(mod) { return (0 << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; };;
sib_table[0x00 | 5 << 3 | 0] = function(mod) { return (reg32s[reg_ebp]) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x00 | 5 << 3 | 1] = function(mod) { return (reg32s[reg_ebp]) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x00 | 5 << 3 | 2] = function(mod) { return (reg32s[reg_ebp]) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x00 | 5 << 3 | 3] = function(mod) { return (reg32s[reg_ebp]) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x00 | 5 << 3 | 4] = function(mod) { return (reg32s[reg_ebp]) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x00 | 5 << 3 | 5] = function(mod) { return (reg32s[reg_ebp]) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x00 | 5 << 3 | 6] = function(mod) { return (reg32s[reg_ebp]) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x00 | 5 << 3 | 7] = function(mod) { return (reg32s[reg_ebp]) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x40 | 5 << 3 | 0] = function(mod) { return (reg32s[reg_ebp] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x40 | 5 << 3 | 1] = function(mod) { return (reg32s[reg_ebp] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x40 | 5 << 3 | 2] = function(mod) { return (reg32s[reg_ebp] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x40 | 5 << 3 | 3] = function(mod) { return (reg32s[reg_ebp] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x40 | 5 << 3 | 4] = function(mod) { return (reg32s[reg_ebp] << 1) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x40 | 5 << 3 | 5] = function(mod) { return (reg32s[reg_ebp] << 1) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x40 | 5 << 3 | 6] = function(mod) { return (reg32s[reg_ebp] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x40 | 5 << 3 | 7] = function(mod) { return (reg32s[reg_ebp] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x80 | 5 << 3 | 0] = function(mod) { return (reg32s[reg_ebp] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x80 | 5 << 3 | 1] = function(mod) { return (reg32s[reg_ebp] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x80 | 5 << 3 | 2] = function(mod) { return (reg32s[reg_ebp] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x80 | 5 << 3 | 3] = function(mod) { return (reg32s[reg_ebp] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x80 | 5 << 3 | 4] = function(mod) { return (reg32s[reg_ebp] << 2) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x80 | 5 << 3 | 5] = function(mod) { return (reg32s[reg_ebp] << 2) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x80 | 5 << 3 | 6] = function(mod) { return (reg32s[reg_ebp] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x80 | 5 << 3 | 7] = function(mod) { return (reg32s[reg_ebp] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0xC0 | 5 << 3 | 0] = function(mod) { return (reg32s[reg_ebp] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0xC0 | 5 << 3 | 1] = function(mod) { return (reg32s[reg_ebp] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0xC0 | 5 << 3 | 2] = function(mod) { return (reg32s[reg_ebp] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0xC0 | 5 << 3 | 3] = function(mod) { return (reg32s[reg_ebp] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0xC0 | 5 << 3 | 4] = function(mod) { return (reg32s[reg_ebp] << 3) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0xC0 | 5 << 3 | 5] = function(mod) { return (reg32s[reg_ebp] << 3) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0xC0 | 5 << 3 | 6] = function(mod) { return (reg32s[reg_ebp] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0xC0 | 5 << 3 | 7] = function(mod) { return (reg32s[reg_ebp] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; };;
sib_table[0x00 | 6 << 3 | 0] = function(mod) { return (reg32s[reg_esi]) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x00 | 6 << 3 | 1] = function(mod) { return (reg32s[reg_esi]) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x00 | 6 << 3 | 2] = function(mod) { return (reg32s[reg_esi]) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x00 | 6 << 3 | 3] = function(mod) { return (reg32s[reg_esi]) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x00 | 6 << 3 | 4] = function(mod) { return (reg32s[reg_esi]) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x00 | 6 << 3 | 5] = function(mod) { return (reg32s[reg_esi]) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x00 | 6 << 3 | 6] = function(mod) { return (reg32s[reg_esi]) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x00 | 6 << 3 | 7] = function(mod) { return (reg32s[reg_esi]) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x40 | 6 << 3 | 0] = function(mod) { return (reg32s[reg_esi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x40 | 6 << 3 | 1] = function(mod) { return (reg32s[reg_esi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x40 | 6 << 3 | 2] = function(mod) { return (reg32s[reg_esi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x40 | 6 << 3 | 3] = function(mod) { return (reg32s[reg_esi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x40 | 6 << 3 | 4] = function(mod) { return (reg32s[reg_esi] << 1) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x40 | 6 << 3 | 5] = function(mod) { return (reg32s[reg_esi] << 1) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x40 | 6 << 3 | 6] = function(mod) { return (reg32s[reg_esi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x40 | 6 << 3 | 7] = function(mod) { return (reg32s[reg_esi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x80 | 6 << 3 | 0] = function(mod) { return (reg32s[reg_esi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x80 | 6 << 3 | 1] = function(mod) { return (reg32s[reg_esi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x80 | 6 << 3 | 2] = function(mod) { return (reg32s[reg_esi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x80 | 6 << 3 | 3] = function(mod) { return (reg32s[reg_esi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x80 | 6 << 3 | 4] = function(mod) { return (reg32s[reg_esi] << 2) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x80 | 6 << 3 | 5] = function(mod) { return (reg32s[reg_esi] << 2) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x80 | 6 << 3 | 6] = function(mod) { return (reg32s[reg_esi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x80 | 6 << 3 | 7] = function(mod) { return (reg32s[reg_esi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0xC0 | 6 << 3 | 0] = function(mod) { return (reg32s[reg_esi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0xC0 | 6 << 3 | 1] = function(mod) { return (reg32s[reg_esi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0xC0 | 6 << 3 | 2] = function(mod) { return (reg32s[reg_esi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0xC0 | 6 << 3 | 3] = function(mod) { return (reg32s[reg_esi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0xC0 | 6 << 3 | 4] = function(mod) { return (reg32s[reg_esi] << 3) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0xC0 | 6 << 3 | 5] = function(mod) { return (reg32s[reg_esi] << 3) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0xC0 | 6 << 3 | 6] = function(mod) { return (reg32s[reg_esi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0xC0 | 6 << 3 | 7] = function(mod) { return (reg32s[reg_esi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; };;
sib_table[0x00 | 7 << 3 | 0] = function(mod) { return (reg32s[reg_edi]) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x00 | 7 << 3 | 1] = function(mod) { return (reg32s[reg_edi]) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x00 | 7 << 3 | 2] = function(mod) { return (reg32s[reg_edi]) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x00 | 7 << 3 | 3] = function(mod) { return (reg32s[reg_edi]) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x00 | 7 << 3 | 4] = function(mod) { return (reg32s[reg_edi]) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x00 | 7 << 3 | 5] = function(mod) { return (reg32s[reg_edi]) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x00 | 7 << 3 | 6] = function(mod) { return (reg32s[reg_edi]) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x00 | 7 << 3 | 7] = function(mod) { return (reg32s[reg_edi]) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x40 | 7 << 3 | 0] = function(mod) { return (reg32s[reg_edi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x40 | 7 << 3 | 1] = function(mod) { return (reg32s[reg_edi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x40 | 7 << 3 | 2] = function(mod) { return (reg32s[reg_edi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x40 | 7 << 3 | 3] = function(mod) { return (reg32s[reg_edi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x40 | 7 << 3 | 4] = function(mod) { return (reg32s[reg_edi] << 1) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x40 | 7 << 3 | 5] = function(mod) { return (reg32s[reg_edi] << 1) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x40 | 7 << 3 | 6] = function(mod) { return (reg32s[reg_edi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x40 | 7 << 3 | 7] = function(mod) { return (reg32s[reg_edi] << 1) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0x80 | 7 << 3 | 0] = function(mod) { return (reg32s[reg_edi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0x80 | 7 << 3 | 1] = function(mod) { return (reg32s[reg_edi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0x80 | 7 << 3 | 2] = function(mod) { return (reg32s[reg_edi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0x80 | 7 << 3 | 3] = function(mod) { return (reg32s[reg_edi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0x80 | 7 << 3 | 4] = function(mod) { return (reg32s[reg_edi] << 2) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0x80 | 7 << 3 | 5] = function(mod) { return (reg32s[reg_edi] << 2) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0x80 | 7 << 3 | 6] = function(mod) { return (reg32s[reg_edi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0x80 | 7 << 3 | 7] = function(mod) { return (reg32s[reg_edi] << 2) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; }; sib_table[0xC0 | 7 << 3 | 0] = function(mod) { return (reg32s[reg_edi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_eax] | 0; }; sib_table[0xC0 | 7 << 3 | 1] = function(mod) { return (reg32s[reg_edi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ecx] | 0; }; sib_table[0xC0 | 7 << 3 | 2] = function(mod) { return (reg32s[reg_edi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edx] | 0; }; sib_table[0xC0 | 7 << 3 | 3] = function(mod) { return (reg32s[reg_edi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_ebx] | 0; }; sib_table[0xC0 | 7 << 3 | 4] = function(mod) { return (reg32s[reg_edi] << 3) + get_seg_prefix(reg_ss) + reg32s[reg_esp] | 0; }; sib_table[0xC0 | 7 << 3 | 5] = function(mod) { return (reg32s[reg_edi] << 3) + (mod ? get_seg_prefix(reg_ss) + reg32s[reg_ebp] : get_seg_prefix(reg_ds) + read_imm32s()) | 0; }; sib_table[0xC0 | 7 << 3 | 6] = function(mod) { return (reg32s[reg_edi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_esi] | 0; }; sib_table[0xC0 | 7 << 3 | 7] = function(mod) { return (reg32s[reg_edi] << 3) + get_seg_prefix(reg_ds) + reg32s[reg_edi] | 0; };;
/**
 * @param {number} modrm_byte
 * @return {number}
 */
modrm_resolve16 = function(modrm_byte)
{
    return modrm_table16[modrm_byte]();
}
/**
 * @param {number} modrm_byte
 * @return {number}
 */
modrm_resolve32 = function(modrm_byte)
{
    return modrm_table32[modrm_byte]();
}
/**
 * @param {boolean} mod
 * @return {number}
 */
function getsib(mod)
{
    return sib_table[read_imm8()](mod);
}
})();
/*
 * Arithmatic functions
 * This file contains:
 *
 * add, adc, sub, sbc, cmp
 * inc, dec
 * neg, not
 * imul, mul, idiv, div
 * xadd
 *
 * das, daa, aad, aam
 *
 * and, or, xor, test
 * shl, shr, sar, ror, rol, rcr, rcl
 * shld, shrd
 *
 * bts, btr, btc, bt
 * bsf, bsr
 *
 * Gets #included by cpu.macro.js
 *
*/
"use strict";
/**
 * Helper function for multiplying 2 32 bit numbers
 * Returns the low 32 bit (which would normally get cut off)
 *
 * @param {number} n1
 * @param {number} n2
 */
function multiply_low(n1, n2)
{
    var low1 = n1 & 0xFFFF,
        low2 = n2 & 0xFFFF,
        high1 = n1 & ~0xFFFF,
        high2 = n2 & ~0xFFFF;
    return low1 * low2 + low1 * high2 + high1 * low2;
}
function add8(dest_operand, source_operand)
{
    // very likely to be a crash
    if(DEBUG && memory.read32s(translate_address_read(instruction_pointer)) === 0)
    {
        dump_regs();
        throw "detected jump to 00000000";
    }
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + source_operand | 0;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all;
    return last_result;
}
function add16(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + source_operand | 0;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all;
    return last_result;
}
function add32(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + source_operand;
    last_op_size = OPSIZE_32;
    flags_changed = flags_all;
    return last_result;
}
function adc8(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + last_op2 + getcf() | 0;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all;
    return last_result;
}
function adc16(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + last_op2 + getcf() | 0;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all;
    return last_result;
}
function adc32(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + last_op2 + getcf();
    last_op_size = OPSIZE_32;
    flags_changed = flags_all;
    return last_result;
}
function cmp8(dest_operand, source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand < 0x100);
    dbg_assert(dest_operand >= 0 && dest_operand < 0x100);
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all;
}
function cmp16(dest_operand, source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand < 0x10000);
    dbg_assert(dest_operand >= 0 && dest_operand < 0x10000);
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all;
}
function cmp32(dest_operand, source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand < 0x100000000);
    dbg_assert(dest_operand >= 0 && dest_operand < 0x100000000);
    last_op1 = dest_operand;
    last_op2 = -source_operand - 1;
    last_result = last_op1 - source_operand;
    last_op_size = OPSIZE_32;
    flags_changed = flags_all;
}
function sub8(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand | 0;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all;
    return last_result;
}
function sub16(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand | 0;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all;
    return last_result;
}
function sub32(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = -source_operand - 1;
    last_result = last_op1 - source_operand;
    last_op_size = OPSIZE_32;
    flags_changed = flags_all;
    return last_result;
}
function sbb8(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand - getcf() | 0;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all;
    return last_result;
}
function sbb16(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand - getcf() | 0;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all;
    return last_result;
}
function sbb32(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = -source_operand - 1;
    last_result = last_op1 - source_operand - getcf();
    last_op_size = OPSIZE_32;
    flags_changed = flags_all;
    return last_result;
}
/*
 * inc and dec
 */
function inc8(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = 1;
    last_result = last_op1 + 1 | 0;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all & ~flag_carry;
    return last_result;
}
function inc16(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = 1;
    last_result = last_op1 + 1 | 0;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all & ~flag_carry;
    return last_result;
}
function inc32(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = 1;
    last_result = last_op1 + 1;
    last_op_size = OPSIZE_32;
    flags_changed = flags_all & ~flag_carry;
    return last_result;
}
function dec8(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = -1;
    last_result = last_op1 - 1 | 0;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all & ~flag_carry;
    return last_result;
}
function dec16(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = -1;
    last_result = last_op1 - 1 | 0;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all & ~flag_carry;
    return last_result;
}
function dec32(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = -1;
    last_result = last_op1 - 1;
    last_op_size = OPSIZE_32;
    flags_changed = flags_all & ~flag_carry;
    return last_result;
}
/*
 * neg and not
 */
function not8(dest_operand)
{
    return ~dest_operand;
}
function not16(dest_operand)
{
    return ~dest_operand;
}
function not32(dest_operand)
{
    return ~dest_operand;
}
function neg8(dest_operand)
{
    last_result = -dest_operand;
    flags_changed = flags_all;
    last_op_size = OPSIZE_8;
    last_op1 = 0;
    last_op2 = last_result - 1;
    return last_result;
}
function neg16(dest_operand)
{
    last_result = -dest_operand;
    flags_changed = flags_all;
    last_op_size = OPSIZE_16;
    last_op1 = 0;
    last_op2 = last_result - 1;
    return last_result;
}
function neg32(dest_operand)
{
    last_result = -dest_operand;
    flags_changed = flags_all;
    last_op_size = OPSIZE_32;
    last_op1 = 0;
    last_op2 = last_result - 1;
    return last_result;
}
/*
 * mul, imul, div, idiv
 *
 * Note: imul has some extra opcodes
 *       while other functions only allow
 *       ax * modrm
 */
function mul8(source_operand)
{
    var result = source_operand * reg8[reg_al];
    reg16[reg_ax] = result;
    if(result < 0x100)
    {
        flags = flags & ~1 & ~flag_overflow;
    }
    else
    {
        flags = flags | 1 | flag_overflow;
    }
    flags_changed = 0;
}
function imul8(source_operand)
{
    var result = source_operand * reg8s[reg_al];
    reg16[reg_ax] = result;
    if(result > 0x7F || result < -0x80)
    {
        flags = flags | 1 | flag_overflow;
    }
    else
    {
        flags = flags & ~1 & ~flag_overflow;
    }
    flags_changed = 0;
}
function mul16(source_operand)
{
    var result = source_operand * reg16[reg_ax],
        high_result = result >>> 16;
    //console.log(h(a) + " * " + h(reg16[reg_ax]) + " = " + h(result));
    reg16[reg_ax] = result;
    reg16[reg_dx] = high_result;
    if(high_result === 0)
    {
        flags &= ~1 & ~flag_overflow;
    }
    else
    {
        flags |= 1 | flag_overflow;
    }
    flags_changed = 0;
}
/*
 * imul with 1 argument
 * ax = ax * r/m
 */
function imul16(source_operand)
{
    var result = source_operand * reg16s[reg_ax];
    reg16[reg_ax] = result;
    reg16[reg_dx] = result >> 16;
    if(result > 0x7FFF || result < -0x8000)
    {
        flags |= 1 | flag_overflow;
    }
    else
    {
        flags &= ~1 & ~flag_overflow;
    }
    flags_changed = 0;
}
/*
 * imul with 2 or 3 arguments
 * reg = reg * r/m
 * reg = imm * r/m
 */
function imul_reg16(operand1, operand2)
{
    dbg_assert(operand1 < 0x8000 && operand1 >= -0x8000);
    dbg_assert(operand2 < 0x8000 && operand2 >= -0x8000);
    var result = operand1 * operand2;
    if(result > 0x7FFF || result < -0x8000)
    {
        flags |= 1 | flag_overflow;
    }
    else
    {
        flags &= ~1 & ~flag_overflow;
    }
    flags_changed = 0;
    return result;
}
function mul32(source_operand)
{
    var dest_operand = reg32[reg_eax],
        high_result = source_operand * dest_operand / 0x100000000 | 0;
    reg32[reg_eax] = multiply_low(source_operand, dest_operand);
    reg32[reg_edx] = high_result;
    if(high_result === 0)
    {
        flags &= ~1 & ~flag_overflow;
    }
    else
    {
        flags |= 1 | flag_overflow;
    }
    flags_changed = 0;
    //console.log(memory.read32s(address) + " * " + old);
    //console.log("= " + reg32[reg_edx] + " " + reg32[reg_eax]);
}
function imul32(source_operand)
{
    dbg_assert(source_operand < 0x80000000 && source_operand >= -0x80000000);
    var dest_operand = reg32s[reg_eax],
        high_result = source_operand * dest_operand / 0x100000000 | 0,
        low_result = multiply_low(source_operand, dest_operand);
    if(high_result === 0 && low_result < 0)
    {
        high_result = -1;
    }
    reg32[reg_eax] = low_result;
    reg32[reg_edx] = high_result;
    if(high_result === (reg32[reg_eax] < 0x80000000 ? 0 : -1))
    {
        flags &= ~1 & ~flag_overflow;
    }
    else
    {
        flags |= 1 | flag_overflow;
    }
    flags_changed = 0;
    //console.log(target_operand + " * " + source_operand);
    //console.log("= " + h(reg32[reg_edx]) + " " + h(reg32[reg_eax]));
}
/*
 * imul with 2 or 3 arguments
 * reg = reg * r/m
 * reg = imm * r/m
 */
function imul_reg32(operand1, operand2)
{
    dbg_assert(operand1 < 0x80000000 && operand1 >= -0x80000000);
    dbg_assert(operand2 < 0x80000000 && operand2 >= -0x80000000);
    var result = multiply_low(operand1, operand2),
        high_result = operand1 * operand2 / 0x100000000 | 0;
    if(high_result === 0)
    {
        flags &= ~1 & ~flag_overflow;
    }
    else
    {
        flags |= 1 | flag_overflow;
    }
    flags_changed = 0;
    return result;
    //console.log(operand + " * " + source_operand);
    //console.log("= " + reg32[reg]);
}
function div8(source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand < 0x100);
    var target_operand = reg16[reg_ax],
        result = target_operand / source_operand | 0;
    if(result > 0xFF || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg8[reg_al] = result;
        reg8[reg_ah] = target_operand % source_operand;
    }
}
function idiv8(source_operand)
{
    dbg_assert(source_operand >= -0x80 && source_operand < 0x80);
    var target_operand = reg16s[reg_ax],
        result = target_operand / source_operand | 0;
    if(result > 0x7F || result < -0x80 || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg8[reg_al] = result;
        reg8[reg_ah] = target_operand % source_operand;
    }
}
function div16(source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand < 0x10000);
    var
        target_operand = (reg16[reg_ax] | reg16[reg_dx] << 16) >>> 0,
        result = target_operand / source_operand | 0;
    if(result > 0xFFFF || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg16[reg_ax] = result;
        reg16[reg_dx] = target_operand % source_operand;
    }
}
function idiv16(source_operand)
{
    dbg_assert(source_operand >= -0x8000 && source_operand < 0x8000);
    var target_operand = reg16[reg_ax] | (reg16[reg_dx] << 16),
        result = target_operand / source_operand | 0;
    if(result > 0x7FFF || result < -0x8000 || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg16[reg_ax] = result;
        reg16[reg_dx] = target_operand % source_operand;
    }
}
function div32(source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand <= 0xffffffff);
    var
        dest_operand_low = reg32[reg_eax],
        dest_operand_high = reg32[reg_edx],
        // Wat? Not sure if seriös ...
        mod = (0x100000000 * dest_operand_high % source_operand + dest_operand_low % source_operand) % source_operand,
        result = dest_operand_low / source_operand + dest_operand_high * 0x100000000 / source_operand;
    if(result > 0xFFFFFFFF || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg32[reg_eax] = result;
        reg32[reg_edx] = mod;
    }
    //console.log(h(dest_operand_high) + ":" + h(dest_operand_low) + " / " + h(source_operand));
    //console.log("= " + h(reg32[reg_eax]) + " rem " + h(reg32[reg_edx]));
}
function idiv32(source_operand)
{
    dbg_assert(source_operand < 0x80000000 && source_operand >= -0x80000000);
    var
        dest_operand_low = reg32[reg_eax],
        dest_operand_high = reg32s[reg_edx],
        mod = (0x100000000 * dest_operand_high % source_operand + dest_operand_low % source_operand) % source_operand,
        result = dest_operand_low / source_operand + dest_operand_high * 0x100000000 / source_operand;
    if(result > 0x7FFFFFFF || result < -0x80000000 || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg32[reg_eax] = result;
        reg32[reg_edx] = mod;
    }
    //console.log(h(dest_operand_high) + ":" + h(dest_operand_low) + " / " + h(source_operand));
    //console.log("= " + h(reg32[reg_eax]) + " rem " + h(reg32[reg_edx]));
}
function xadd8(source_operand, reg)
{
    var tmp = reg8[reg];
    reg8[reg] = source_operand;
    return add8(source_operand, tmp);
}
function xadd16(source_operand, reg)
{
    var tmp = reg16[reg];
    reg16[reg] = source_operand;
    return add16(source_operand, tmp);
}
function xadd32(source_operand, reg)
{
    var tmp = reg32[reg];
    reg32[reg] = source_operand;
    return add32(source_operand, tmp);
}
function bcd_daa()
{
    //dbg_log("daa");
    // decimal adjust after addition
    var old_al = reg8[reg_al],
        old_cf = getcf(),
        old_af = getaf();
    flags &= ~1 & ~flag_adjust
    if((old_al & 0xF) > 9 || old_af)
    {
        reg8[reg_al] += 6;
        flags |= flag_adjust;
    }
    if(old_al > 0x99 || old_cf)
    {
        reg8[reg_al] += 0x60;
        flags |= 1;
    }
    last_result = reg8[reg_al];
    last_op_size = OPSIZE_8;
    last_op1 = last_op2 = 0;
    flags_changed = flags_all & ~1 & ~flag_adjust & ~flag_overflow;
}
function bcd_das()
{
    //dbg_log("das");
    // decimal adjust after subtraction
    var old_al = reg8[reg_al],
        old_cf = getcf();
    flags &= ~1;
    if((old_al & 0xF) > 9 || getaf())
    {
        reg8[reg_al] -= 6;
        flags |= flag_adjust;
        flags = flags & ~1 | old_cf | reg8[reg_al] >> 7;
    }
    else
    {
        flags &= ~flag_adjust;
    }
    if(old_al > 0x99 || old_cf)
    {
        reg8[reg_al] -= 0x60;
        flags |= 1;
    }
    last_result = reg8[reg_al];
    last_op_size = OPSIZE_8;
    last_op1 = last_op2 = 0;
    flags_changed = flags_all & ~1 & ~flag_adjust & ~flag_overflow;
}
function bcd_aam()
{
    // ascii adjust after multiplication
    var imm8 = read_imm8();
    if(imm8 === 0)
    {
        trigger_de();
    }
    else
    {
        var temp = reg8[reg_al];
        reg8[reg_ah] = temp / imm8;
        reg8[reg_al] = temp % imm8;
        last_result = reg8[reg_al];
        flags_changed = flags_all;
    }
}
function bcd_aad()
{
    // ascii adjust after division
    var imm8 = read_imm8();
    last_result = reg8[reg_al] + reg8[reg_ah] * imm8;
    reg16[reg_ax] = last_result & 0xFF;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all;
}
function bcd_aaa()
{
    if((reg8[reg_al] & 0xF) > 9 || getaf())
    {
        reg16[reg_ax] += 6;
        reg8[reg_ah] += 1;
        flags |= flag_adjust | 1;
    }
    else
    {
        flags &= ~flag_adjust & ~1;
    }
    reg8[reg_al] &= 0xF;
    flags_changed &= ~flag_adjust & ~1;
}
function bcd_aas()
{
    if((reg8[reg_al] & 0xF) > 9 || getaf())
    {
        reg16[reg_ax] -= 6;
        reg8[reg_ah] -= 1;
        flags |= flag_adjust | 1;
    }
    else
    {
        flags &= ~flag_adjust & ~1;
    }
    reg8[reg_al] &= 0xF;
    flags_changed &= ~flag_adjust & ~1;
}
/*                     \O
 * bitwise functions    | *                     /  *

 *
 * and, or, xor, test
 * shl, shr, sar, rol, ror, rcl, ror
 * shrd, shld
 *
 * bt, bts, btr, btc
 * bsf, bsr
 */
function and8(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;
    last_op_size = OPSIZE_8;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
    return last_result;
}
function and16(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;
    last_op_size = OPSIZE_16;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
    return last_result;
}
function and32(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;
    last_op_size = OPSIZE_32;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
    return last_result;
}
function test8(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;
    last_op_size = OPSIZE_8;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
}
function test16(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;
    last_op_size = OPSIZE_16;
    flags &= ~1 & ~flag_overflow;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
}
function test32(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;
    last_op_size = OPSIZE_32;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
}
function or8(dest_operand, source_operand)
{
    last_result = dest_operand | source_operand;
    last_op_size = OPSIZE_8;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
    return last_result;
}
function or16(dest_operand, source_operand)
{
    last_result = dest_operand | source_operand;
    last_op_size = OPSIZE_16;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
    return last_result;
}
function or32(dest_operand, source_operand)
{
    last_result = dest_operand | source_operand;
    last_op_size = OPSIZE_32;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
    return last_result;
}
function xor8(dest_operand, source_operand)
{
    last_result = dest_operand ^ source_operand;
    last_op_size = OPSIZE_8;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
    return last_result;
}
function xor16(dest_operand, source_operand)
{
    last_result = dest_operand ^ source_operand;
    last_op_size = OPSIZE_16;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
    return last_result;
}
function xor32(dest_operand, source_operand)
{
    last_result = dest_operand ^ source_operand;
    last_op_size = OPSIZE_32;
    flags &= ~1 & ~flag_overflow & ~flag_adjust;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow & ~flag_adjust;
    return last_result;
}
/*
 * rotates and shifts
 */
function rol8(dest_operand, count)
{
    if(!count)
    {
        return dest_operand;
    }
    count &= 7;
    var result = dest_operand << count | dest_operand >> (8 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result & 1)
                | (result << 11 ^ result << 4) & flag_overflow;
    return result;
}
function rol16(dest_operand, count)
{
    if(!count)
    {
        return dest_operand;
    }
    count &= 15;
    var result = dest_operand << count | dest_operand >> (16 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result & 1)
                | (result << 11 ^ result >> 4) & flag_overflow;
    return result;
}
function rol32(dest_operand, count)
{
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand << count | dest_operand >>> (32 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result & 1)
                | (result << 11 ^ result >> 20) & flag_overflow;
    return result;
}
function rcl8(dest_operand, count)
{
    count %= 9;
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand << count | getcf() << (count - 1) | dest_operand >> (9 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result >> 8 & 1)
                | (result << 3 ^ result << 4) & flag_overflow;
    return result;
}
function rcl16(dest_operand, count)
{
    count %= 17;
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand << count | getcf() << (count - 1) | dest_operand >> (17 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result >> 16 & 1)
                | (result >> 5 ^ result >> 4) & flag_overflow;
    return result;
}
function rcl32(dest_operand, count)
{
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand << count | getcf() << (count - 1);
    if(count > 1)
    {
        result |= dest_operand >>> (33 - count);
    }
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow) | (dest_operand >>> (32 - count) & 1);
    flags |= (flags << 11 ^ result >> 20) & flag_overflow;
    return result;
}
function ror8(dest_operand, count)
{
    count &= 7;
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand >> count | dest_operand << (8 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result >> 7 & 1)
                | (result << 4 ^ result << 5) & flag_overflow;
    return result;
}
function ror16(dest_operand, count)
{
    count &= 15;
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand >> count | dest_operand << (16 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result >> 15 & 1)
                | (result >> 4 ^ result >> 3) & flag_overflow;
    return result;
}
function ror32(dest_operand, count)
{
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand >>> count | dest_operand << (32 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result >> 31 & 1)
                | (result >> 20 ^ result >> 19) & flag_overflow;
    return result;
}
function rcr8(dest_operand, count)
{
    count %= 9;
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand >> count | getcf() << (8 - count) | dest_operand << (9 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result >> 8 & 1)
                | (result << 4 ^ result << 5) & flag_overflow;
    return result;
}
function rcr16(dest_operand, count)
{
    count %= 17;
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand >> count | getcf() << (16 - count) | dest_operand << (17 - count);
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (result >> 16 & 1)
                | (result >> 4 ^ result >> 3) & flag_overflow;
    return result;
}
function rcr32(dest_operand, count)
{
    if(!count)
    {
        return dest_operand;
    }
    var result = dest_operand >>> count | getcf() << (32 - count);
    if(count > 1)
    {
        result |= dest_operand << (33 - count);
    }
    flags_changed &= ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (dest_operand >> (count - 1) & 1)
                | (result >> 20 ^ result >> 19) & flag_overflow;
    return result;
}
function shl8(dest_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand << count;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (last_result >> 8 & 1)
                | (last_result << 3 ^ last_result << 4) & flag_overflow;
    return last_result;
}
function shl16(dest_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand << count;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (last_result >> 16 & 1)
                | (last_result >> 5 ^ last_result >> 4) & flag_overflow;
    return last_result;
}
function shl32(dest_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand << count;
    last_op_size = OPSIZE_32;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow;
    // test this
    flags = (flags & ~1 & ~flag_overflow) | (dest_operand >>> (32 - count) & 1);
    flags |= ((flags & 1) ^ (last_result >> 31 & 1)) << 11 & flag_overflow;
    return last_result;
}
function shr8(dest_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand >> count;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (dest_operand >> (count - 1) & 1)
                | (dest_operand >> 7 & 1) << 11 & flag_overflow;
    return last_result;
}
function shr16(dest_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand >> count;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (dest_operand >> (count - 1) & 1)
                | (dest_operand >> 4) & flag_overflow;
    return last_result;
}
function shr32(dest_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand >>> count;
    last_op_size = OPSIZE_32;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow)
                | (dest_operand >>> (count - 1) & 1)
                | (dest_operand >> 20) & flag_overflow;
    return last_result;
}
function sar8(dest_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand >> count;
    last_op_size = OPSIZE_8;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow) | (dest_operand >> (count - 1) & 1);
    // of is zero
    return last_result;
}
function sar16(dest_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand >> count;
    last_op_size = OPSIZE_16;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow) | (dest_operand >> (count - 1) & 1);
    return last_result;
}
function sar32(dest_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand >> count;
    last_op_size = OPSIZE_32;
    flags_changed = flags_all & ~flag_carry & ~flag_overflow;
    flags = (flags & ~1 & ~flag_overflow) | (dest_operand >>> (count - 1) & 1);
    return last_result;
}
function shrd16(dest_operand, source_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    if(count <= 16)
    {
        last_result = dest_operand >> count | source_operand << (16 - count);
        flags = (flags & ~1) | (dest_operand >> (count - 1) & 1);
    }
    else
    {
        last_result = dest_operand << (32 - count) | source_operand >> (count - 16);
        flags = (flags & ~1) | (source_operand >> (count - 17) & 1);
    }
    last_op_size = OPSIZE_16;
    flags_changed = flags_all & ~1 & ~flag_overflow;
    flags = (flags & ~flag_overflow) | ((last_result ^ dest_operand) >> 4 & flag_overflow);
    return last_result;
}
function shrd32(dest_operand, source_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand >>> count | source_operand << (32 - count);
    last_op_size = OPSIZE_32;
    flags_changed = flags_all & ~1 & ~flag_overflow;
    flags = (flags & ~1) | (dest_operand >>> (count - 1) & 1);
    flags = (flags & ~flag_overflow) | ((last_result ^ dest_operand) >> 20 & flag_overflow);
    return last_result;
}
function shld16(dest_operand, source_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    if(count <= 16)
    {
        last_result = dest_operand << count | source_operand >>> (16 - count);
        flags = (flags & ~1) | (dest_operand >>> (16 - count) & 1);
    }
    else
    {
        last_result = dest_operand >> (32 - count) | source_operand << (count - 16);
        flags = (flags & ~1) | (source_operand >>> (32 - count) & 1);
    }
    last_op_size = OPSIZE_16;
    flags_changed = flags_all & ~1 & ~flag_overflow;
    flags = (flags & ~flag_overflow) | ((flags & 1) ^ (last_result >> 15 & 1)) << 11;
    return last_result;
}
function shld32(dest_operand, source_operand, count)
{
    if(count === 0)
    {
        return dest_operand;
    }
    last_result = dest_operand << count | source_operand >>> (32 - count);
    last_op_size = OPSIZE_32;
    flags_changed = flags_all & ~1 & ~flag_overflow;
    // test this
    flags = (flags & ~1) | (dest_operand >>> (32 - count) & 1);
    flags = (flags & ~flag_overflow) | ((flags & 1) ^ (last_result >> 31 & 1)) << 11;
    return last_result;
}
function bt_reg(bit_base, bit_offset)
{
    flags = (flags & ~1) | (bit_base >> bit_offset & 1);
    flags_changed = 0;
}
function btc_reg(bit_base, bit_offset)
{
    flags = (flags & ~1) | (bit_base >> bit_offset & 1);
    flags_changed = 0;
    return bit_base ^ 1 << bit_offset;
}
function bts_reg(bit_base, bit_offset)
{
    flags = (flags & ~1) | (bit_base >> bit_offset & 1);
    flags_changed = 0;
    return bit_base | 1 << bit_offset;
}
function btr_reg(bit_base, bit_offset)
{
    flags = (flags & ~1) | (bit_base >> bit_offset & 1);
    flags_changed = 0;
    return bit_base & ~(1 << bit_offset);
}
function bt_mem(virt_addr, bit_offset)
{
    var bit_base = safe_read8(virt_addr + (bit_offset >> 3));
    bit_offset &= 7;
    flags = (flags & ~1) | (bit_base >> bit_offset & 1);
    flags_changed = 0;
}
function btc_mem(virt_addr, bit_offset)
{
    var phys_addr = translate_address_write(virt_addr + (bit_offset >> 3));
    var bit_base = memory.read8(phys_addr);
    bit_offset &= 7;
    flags = (flags & ~1) | (bit_base >> bit_offset & 1);
    flags_changed = 0;
    memory.write8(phys_addr, bit_base ^ 1 << bit_offset);
}
function btr_mem(virt_addr, bit_offset)
{
    var phys_addr = translate_address_write(virt_addr + (bit_offset >> 3));
    var bit_base = memory.read8(phys_addr);
    bit_offset &= 7;
    flags = (flags & ~1) | (bit_base >> bit_offset & 1);
    flags_changed = 0;
    memory.write8(phys_addr, bit_base & ~(1 << bit_offset));
}
function bts_mem(virt_addr, bit_offset)
{
    var phys_addr = translate_address_write(virt_addr + (bit_offset >> 3));
    var bit_base = memory.read8(phys_addr);
    bit_offset &= 7;
    flags = (flags & ~1) | (bit_base >> bit_offset & 1);
    flags_changed = 0;
    memory.write8(phys_addr, bit_base | 1 << bit_offset);
}
var mod37_bit_position = new Uint8Array([
    32, 0, 1, 26, 2, 23, 27, 0, 3, 16, 24, 30, 28, 11, 0, 13, 4,
    7, 17, 0, 25, 22, 31, 15, 29, 10, 12, 6, 0, 21, 14, 9, 5,
    20, 8, 19, 18
]);
function bsf16(old, bit_base)
{
    flags_changed = 0;
    if(bit_base === 0)
    {
        flags |= flag_zero;
        // not defined in the docs, but value doesn't change on my intel cpu
        return old;
    }
    else
    {
        flags &= ~flag_zero;
        return mod37_bit_position[((-bit_base & bit_base) >>> 0) % 37];
    }
}
function bsf32(old, bit_base)
{
    flags_changed = 0;
    if(bit_base === 0)
    {
        flags |= flag_zero;
        return old;
    }
    else
    {
        flags &= ~flag_zero;
        return mod37_bit_position[((-bit_base & bit_base) >>> 0) % 37];
    }
}
function bsr16(old, bit_base)
{
    flags_changed = 0;
    if(bit_base === 0)
    {
        flags |= flag_zero;
        return old;
    }
    else
    {
        flags &= ~flag_zero;
        var t = bit_base >>> 8;
        if(t)
        {
            return 8 + log2_table[t];
        }
        else
        {
            return log2_table[bit_base];
        }
    }
}
function bsr32(old, bit_base)
{
    flags_changed = 0;
    if(bit_base === 0)
    {
        flags |= flag_zero;
        return old;
    }
    else
    {
        flags &= ~flag_zero;
        var tt = bit_base >>> 16,
            t;
        if(tt)
        {
            t = tt >>> 8;
            if(t)
            {
                return 24 + log2_table[t];
            }
            else
            {
                return 16 + log2_table[tt];
            }
        }
        else
        {
            t = bit_base >>> 8;
            if(t)
            {
                return 8 + log2_table[t];
            }
            else
            {
                return log2_table[bit_base];
            }
        }
    }
}
/*
 * Some miscellaneous instructions:
 *
 * jmpcc16, jmpcc32, jmp16
 * loop, loope, loopne, jcxz
 * test_cc
 *
 * mov, push, pop
 * pusha, popa
 * xchg, lss
 * lea
 * enter
 * bswap
 *
 * Gets #included by cpu.macro.js
 */
"use strict";
function jmp_rel16(rel16)
{
    var current_cs = get_seg(reg_cs);
    // limit ip to 16 bit
    // ugly
    instruction_pointer -= current_cs;
    instruction_pointer = (instruction_pointer + rel16) & 0xFFFF;
    instruction_pointer = instruction_pointer + current_cs | 0;
}
function jmpcc16(condition)
{
    if(condition)
    {
        jmp_rel16(read_imm16());
    }
    else
    {
        instruction_pointer += 2;
    }
}
function jmpcc32(condition)
{
    if(condition)
    {
        // don't write `instruction_pointer += read_imm32s()`
        var imm32s = read_imm32s();
        instruction_pointer = instruction_pointer + imm32s | 0;
    }
    else
    {
        instruction_pointer = instruction_pointer + 4 | 0;
    }
}
function loopne()
{
    if(--regv[reg_vcx] && !getzf())
    {
        var imm8s = read_imm8s();
        instruction_pointer = instruction_pointer + imm8s | 0;
    }
    else
    {
        instruction_pointer++;
    }
}
function loope()
{
    if(--regv[reg_vcx] && getzf())
    {
        var imm8s = read_imm8s();
        instruction_pointer = instruction_pointer + imm8s | 0;
    }
    else
    {
        instruction_pointer++;
    }
}
function loop()
{
    if(--regv[reg_vcx])
    {
        var imm8s = read_imm8s();
        instruction_pointer = instruction_pointer + imm8s | 0;
    }
    else
    {
        instruction_pointer++;
    }
}
function jcxz()
{
    var imm8s = read_imm8s();
    if(regv[reg_vcx] === 0)
    {
        instruction_pointer = instruction_pointer + imm8s | 0;
    }
}
var test_o = getof,
    test_b = getcf,
    test_z = getzf,
    test_s = getsf,
    test_p = getpf;
function test_be()
{
    return getcf() || getzf();
}
function test_l()
{
    return !getsf() !== !getof();
}
function test_le()
{
    return getzf() || !getsf() !== !getof();
}
/** 
 * @return {number}
 * @const
 */
function getcf()
{
    if(flags_changed & 1)
    {
        if(last_op_size === OPSIZE_32)
        {
            // cannot bit test above 2^32-1
            return last_result > 0xffffffff | last_result < 0;
            //return ((last_op1 ^ last_result) & (last_op2 ^ last_result)) >>> 31;
        }
        else
        {
            return last_result >> last_op_size & 1;
        }
        //return last_result >= (1 << last_op_size) | last_result < 0;
    }
    else
    {
        return flags & 1;
    }
}
/** @return {number} */
function getpf()
{
    if(flags_changed & flag_parity)
    {
        // inverted lookup table
        return 0x9669 << 2 >> ((last_result ^ last_result >> 4) & 0xF) & flag_parity;
    }
    else
    {
        return flags & flag_parity;
    }
}
/** @return {number} */
function getaf()
{
    if(flags_changed & flag_adjust)
    {
        return (last_op1 ^ last_op2 ^ last_result ^ (last_op2 < 0) << 4) & flag_adjust;
    }
    else
    {
        return flags & flag_adjust;
    }
}
/** @return {number} */
function getzf()
{
    if(flags_changed & flag_zero)
    {
        return (~last_result & last_result - 1) >> last_op_size - 7 & flag_zero;
    }
    else
    {
        return flags & flag_zero;
    }
}
/** @return {number} */
function getsf()
{
    if(flags_changed & flag_sign)
    {
        return last_result >> last_op_size - 8 & flag_sign;
    }
    else
    {
        return flags & flag_sign;
    }
}
/** @return {number} */
function getof()
{
    if(flags_changed & flag_overflow)
    {
        return (((last_op1 ^ last_result) & (last_op2 ^ last_result)) >> last_op_size - 1) << 11 & flag_overflow;
    }
    else
    {
        return flags & flag_overflow;
    }
}
function push16(imm16)
{
    var sp = get_esp_write(-2);
    stack_reg[reg_vsp] -= 2;
    memory.write16(sp, imm16);
}
function push32(imm32)
{
    var sp = get_esp_write(-4);
    stack_reg[reg_vsp] -= 4;
    memory.write32(sp, imm32);
}
function pop16()
{
    var sp = get_esp_read(0);
    stack_reg[reg_vsp] += 2;
    return memory.read16(sp);
}
function pop32s()
{
    var sp = get_esp_read(0);
    stack_reg[reg_vsp] += 4;
    return memory.read32s(sp);
}
function pusha16()
{
    var temp = reg16[reg_sp];
    // make sure we don't get a pagefault after having 
    // pushed several registers already
    translate_address_write(temp - 15);
    push16(reg16[reg_ax]);
    push16(reg16[reg_cx]);
    push16(reg16[reg_dx]);
    push16(reg16[reg_bx]);
    push16(temp);
    push16(reg16[reg_bp]);
    push16(reg16[reg_si]);
    push16(reg16[reg_di]);
}
function pusha32()
{
    var temp = reg32s[reg_esp];
    translate_address_write(temp - 31);
    push32(reg32s[reg_eax]);
    push32(reg32s[reg_ecx]);
    push32(reg32s[reg_edx]);
    push32(reg32s[reg_ebx]);
    push32(temp);
    push32(reg32s[reg_ebp]);
    push32(reg32s[reg_esi]);
    push32(reg32s[reg_edi]);
}
function popa16()
{
    translate_address_read(stack_reg[reg_vsp] + 15);
    reg16[reg_di] = pop16();
    reg16[reg_si] = pop16();
    reg16[reg_bp] = pop16();
    stack_reg[reg_vsp] += 2;
    reg16[reg_bx] = pop16();
    reg16[reg_dx] = pop16();
    reg16[reg_cx] = pop16();
    reg16[reg_ax] = pop16();
}
function popa32()
{
    translate_address_read(stack_reg[reg_vsp] + 31);
    reg32[reg_edi] = pop32s();
    reg32[reg_esi] = pop32s();
    reg32[reg_ebp] = pop32s();
    stack_reg[reg_vsp] += 4;
    reg32[reg_ebx] = pop32s();
    reg32[reg_edx] = pop32s();
    reg32[reg_ecx] = pop32s();
    reg32[reg_eax] = pop32s();
}
function xchg8(memory_data, modrm_byte)
{
    var mod = modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1,
        tmp = reg8[mod];
    reg8[mod] = memory_data;
    return tmp;
}
function xchg16(memory_data, modrm_byte)
{
    var mod = modrm_byte >> 2 & 14,
        tmp = reg16[mod];
    reg16[mod] = memory_data;
    return tmp;
}
function xchg16r(operand)
{
    var temp = reg16[reg_ax];
    reg16[reg_ax] = reg16[operand];
    reg16[operand] = temp;
}
function xchg32(memory_data, modrm_byte)
{
    var mod = modrm_byte >> 3 & 7,
        tmp = reg32s[mod];
    reg32[mod] = memory_data;
    return tmp;
}
function xchg32r(operand)
{
    var temp = reg32s[reg_eax];
    reg32[reg_eax] = reg32s[operand];
    reg32[operand] = temp;
}
function lss16(seg, addr, mod)
{
    var new_reg = safe_read16(addr),
        new_seg = safe_read16(addr + 2);
    switch_seg(seg, new_seg);
    reg16[mod] = new_reg;
}
function lss32(seg, addr, mod)
{
    var new_reg = safe_read32s(addr),
        new_seg = safe_read16(addr + 4);
    switch_seg(seg, new_seg);
    reg32[mod] = new_reg;
}
function lea16()
{
    var modrm_byte = read_imm8(),
        mod = modrm_byte >> 3 & 7;
    // override prefix, so modrm16 does not return the segment part
    segment_prefix = reg_noseg;
    reg16[mod << 1] = modrm_resolve(modrm_byte);
    segment_prefix = -1;
}
function lea32()
{
    var modrm_byte = read_imm8(),
        mod = modrm_byte >> 3 & 7;
    segment_prefix = reg_noseg;
    reg32[mod] = modrm_resolve(modrm_byte);
    segment_prefix = -1;
}
function enter16()
{
    var size = read_imm16(),
        nesting_level = read_imm8(),
        frame_temp;
    push16(reg16[reg_bp]);
    frame_temp = reg16[reg_sp];
    if(nesting_level > 0)
    {
        for(var i = 1; i < nesting_level; i++)
        {
            reg16[reg_bp] -= 2;
            push16(reg16[reg_bp]);
        }
        push16(frame_temp);
    }
    reg16[reg_bp] = frame_temp;
    reg16[reg_sp] = frame_temp - size;
    dbg_assert(!page_fault);
}
function enter32()
{
    var size = read_imm16(),
        nesting_level = read_imm8() & 31,
        frame_temp;
    push32(reg32s[reg_ebp]);
    frame_temp = reg32s[reg_esp];
    if(nesting_level > 0)
    {
        for(var i = 1; i < nesting_level; i++)
        {
            reg32[reg_ebp] -= 4;
            push32(reg32s[reg_ebp]);
        }
        push32(frame_temp);
    }
    reg32[reg_ebp] = frame_temp;
    reg32[reg_esp] -= size;
    dbg_assert(!page_fault);
}
function bswap(reg)
{
    var temp = reg32s[reg];
    reg32[reg] = temp >>> 24 | temp << 24 | (temp >> 8 & 0xFF00) | (temp << 8 & 0xFF0000);
}
"use strict";
/*
 * string operations
 *
 *       cmp  si  di
 * movs   0    1   1    A4
 * cmps   1    1   1    A6
 * stos   0    0   1    AA
 * lods   0    1   0    AC
 * scas   1    0   1    AE
 * ins    0    0   1
 * outs   0    1   0
 */
function movsb()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(8 >> 3) : 8 >> 3; var ds, es; if(false && !true) data_src = reg8[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 8 > 8 && (!true || (dest & (8 >> 3) - 1) === 0) && (!true || (src & (8 >> 3) - 1) === 0); do { if(aligned) { {}; } else { { safe_write8(dest, safe_read8(src)); }; } if(true) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { safe_write8(dest, safe_read8(src)); }; if(true) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(false) cmp8(data_src, data_dest);;
}
function movsw()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(16 >> 3) : 16 >> 3; var ds, es; if(false && !true) data_src = reg16[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 16 > 8 && (!true || (dest & (16 >> 3) - 1) === 0) && (!true || (src & (16 >> 3) - 1) === 0); do { if(aligned) { { var phys_src = translate_address_read(src); var phys_dest = translate_address_write(dest); memory.write_aligned16(phys_dest, memory.read_aligned16(phys_src)); }; } else { { safe_write16(dest, safe_read16(src)); }; } if(true) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { safe_write16(dest, safe_read16(src)); }; if(true) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(false) cmp16(data_src, data_dest);;
}
function movsd()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(32 >> 3) : 32 >> 3; var ds, es; if(false && !true) data_src = reg32[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 32 > 8 && (!true || (dest & (32 >> 3) - 1) === 0) && (!true || (src & (32 >> 3) - 1) === 0); do { if(aligned) { { var phys_src = translate_address_read(src); var phys_dest = translate_address_write(dest); memory.write_aligned32(phys_dest, memory.read_aligned32(phys_src)); }; } else { { safe_write32(dest, safe_read32s(src)); }; } if(true) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { safe_write32(dest, safe_read32s(src)); }; if(true) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(false) cmp32(data_src, data_dest);;
}
function cmpsb()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(8 >> 3) : 8 >> 3; var ds, es; if(true && !true) data_src = reg8[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 8 > 8 && (!true || (dest & (8 >> 3) - 1) === 0) && (!true || (src & (8 >> 3) - 1) === 0); do { if(aligned) { {}; } else { { data_dest = safe_read8(dest); data_src = safe_read8(src); }; } if(true) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!true || (data_src === data_dest) === repeat_string_type)); } else { { data_dest = safe_read8(dest); data_src = safe_read8(src); }; if(true) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(true) cmp8(data_src, data_dest);;
}
function cmpsw()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(16 >> 3) : 16 >> 3; var ds, es; if(true && !true) data_src = reg16[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 16 > 8 && (!true || (dest & (16 >> 3) - 1) === 0) && (!true || (src & (16 >> 3) - 1) === 0); do { if(aligned) { { data_dest = memory.read_aligned16(translate_address_read(dest)); data_src = memory.read_aligned16(translate_address_read(src)); }; } else { { data_dest = safe_read16(dest); data_src = safe_read16(src); }; } if(true) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!true || (data_src === data_dest) === repeat_string_type)); } else { { data_dest = safe_read16(dest); data_src = safe_read16(src); }; if(true) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(true) cmp16(data_src, data_dest);;
}
function cmpsd()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(32 >> 3) : 32 >> 3; var ds, es; if(true && !true) data_src = reg32[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 32 > 8 && (!true || (dest & (32 >> 3) - 1) === 0) && (!true || (src & (32 >> 3) - 1) === 0); do { if(aligned) { { data_dest = memory.read_aligned32(translate_address_read(dest)) >>> 0; data_src = memory.read_aligned32(translate_address_read(src)) >>> 0; }; } else { { data_dest = (safe_read32s(dest) >>> 0); data_src = (safe_read32s(src) >>> 0); }; } if(true) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!true || (data_src === data_dest) === repeat_string_type)); } else { { data_dest = (safe_read32s(dest) >>> 0); data_src = (safe_read32s(src) >>> 0); }; if(true) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(true) cmp32(data_src, data_dest);;
}
function stosb()
{
    var data = reg8[reg_al];
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(8 >> 3) : 8 >> 3; var ds, es; if(false && !false) data_src = reg8[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(false) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 8 > 8 && (!true || (dest & (8 >> 3) - 1) === 0) && (!false || (src & (8 >> 3) - 1) === 0); do { if(aligned) { {}; } else { { safe_write8(dest, data); }; } if(true) dest += size, regv[reg_vdi] += size; if(false) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { safe_write8(dest, data); }; if(true) regv[reg_vdi] += size; if(false) regv[reg_vsi] += size; } if(false) cmp8(data_src, data_dest);;
}
function stosw()
{
    var data = reg16[reg_ax];
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(16 >> 3) : 16 >> 3; var ds, es; if(false && !false) data_src = reg16[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(false) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 16 > 8 && (!true || (dest & (16 >> 3) - 1) === 0) && (!false || (src & (16 >> 3) - 1) === 0); do { if(aligned) { { memory.write_aligned16(translate_address_write(dest), data); }; } else { { safe_write16(dest, data); }; } if(true) dest += size, regv[reg_vdi] += size; if(false) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { safe_write16(dest, data); }; if(true) regv[reg_vdi] += size; if(false) regv[reg_vsi] += size; } if(false) cmp16(data_src, data_dest);;
}
function stosd()
{
    //dbg_log("stosd " + ((reg32[reg_edi] & 3) ? "mis" : "") + "aligned", LOG_CPU);
    var data = reg32[reg_eax];
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(32 >> 3) : 32 >> 3; var ds, es; if(false && !false) data_src = reg32[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(false) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 32 > 8 && (!true || (dest & (32 >> 3) - 1) === 0) && (!false || (src & (32 >> 3) - 1) === 0); do { if(aligned) { { memory.write_aligned32(translate_address_write(dest), data); }; } else { { safe_write32(dest, data); }; } if(true) dest += size, regv[reg_vdi] += size; if(false) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { safe_write32(dest, data); }; if(true) regv[reg_vdi] += size; if(false) regv[reg_vsi] += size; } if(false) cmp32(data_src, data_dest);;
}
function lodsb()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(8 >> 3) : 8 >> 3; var ds, es; if(false && !true) data_src = reg8[reg_eax]; if(false) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 8 > 8 && (!false || (dest & (8 >> 3) - 1) === 0) && (!true || (src & (8 >> 3) - 1) === 0); do { if(aligned) { {}; } else { { reg8[reg_al] = safe_read8(src); }; } if(false) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { reg8[reg_al] = safe_read8(src); }; if(false) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(false) cmp8(data_src, data_dest);;
}
function lodsw()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(16 >> 3) : 16 >> 3; var ds, es; if(false && !true) data_src = reg16[reg_eax]; if(false) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 16 > 8 && (!false || (dest & (16 >> 3) - 1) === 0) && (!true || (src & (16 >> 3) - 1) === 0); do { if(aligned) { { reg16[reg_ax] = safe_read16(src); }; } else { { reg16[reg_ax] = safe_read16(src); }; } if(false) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { reg16[reg_ax] = safe_read16(src); }; if(false) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(false) cmp16(data_src, data_dest);;
}
function lodsd()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(32 >> 3) : 32 >> 3; var ds, es; if(false && !true) data_src = reg32[reg_eax]; if(false) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 32 > 8 && (!false || (dest & (32 >> 3) - 1) === 0) && (!true || (src & (32 >> 3) - 1) === 0); do { if(aligned) { { reg32[reg_eax] = safe_read32s(src); }; } else { { reg32[reg_eax] = safe_read32s(src); }; } if(false) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { reg32[reg_eax] = safe_read32s(src); }; if(false) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(false) cmp32(data_src, data_dest);;
}
function scasb()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(8 >> 3) : 8 >> 3; var ds, es; if(true && !false) data_src = reg8[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(false) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 8 > 8 && (!true || (dest & (8 >> 3) - 1) === 0) && (!false || (src & (8 >> 3) - 1) === 0); do { if(aligned) { {}; } else { { data_dest = safe_read8(dest); }; } if(true) dest += size, regv[reg_vdi] += size; if(false) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!true || (data_src === data_dest) === repeat_string_type)); } else { { data_dest = safe_read8(dest); }; if(true) regv[reg_vdi] += size; if(false) regv[reg_vsi] += size; } if(true) cmp8(data_src, data_dest);;
}
function scasw()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(16 >> 3) : 16 >> 3; var ds, es; if(true && !false) data_src = reg16[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(false) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 16 > 8 && (!true || (dest & (16 >> 3) - 1) === 0) && (!false || (src & (16 >> 3) - 1) === 0); do { if(aligned) { { data_dest = memory.read_aligned16(translate_address_read(dest)); }; } else { { data_dest = safe_read16(dest); }; } if(true) dest += size, regv[reg_vdi] += size; if(false) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!true || (data_src === data_dest) === repeat_string_type)); } else { { data_dest = safe_read16(dest); }; if(true) regv[reg_vdi] += size; if(false) regv[reg_vsi] += size; } if(true) cmp16(data_src, data_dest);;
}
function scasd()
{
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(32 >> 3) : 32 >> 3; var ds, es; if(true && !false) data_src = reg32[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(false) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 32 > 8 && (!true || (dest & (32 >> 3) - 1) === 0) && (!false || (src & (32 >> 3) - 1) === 0); do { if(aligned) { { data_dest = memory.read_aligned32(translate_address_read(dest)) >>> 0; }; } else { { data_dest = (safe_read32s(dest) >>> 0); }; } if(true) dest += size, regv[reg_vdi] += size; if(false) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!true || (data_src === data_dest) === repeat_string_type)); } else { { data_dest = (safe_read32s(dest) >>> 0); }; if(true) regv[reg_vdi] += size; if(false) regv[reg_vsi] += size; } if(true) cmp32(data_src, data_dest);;
}
function insb()
{
    var port = reg16[reg_dx];
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(8 >> 3) : 8 >> 3; var ds, es; if(false && !false) data_src = reg8[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(false) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 8 > 8 && (!true || (dest & (8 >> 3) - 1) === 0) && (!false || (src & (8 >> 3) - 1) === 0); do { if(aligned) { { }; } else { { safe_write8(dest, in8(port)); }; } if(true) dest += size, regv[reg_vdi] += size; if(false) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { safe_write8(dest, in8(port)); }; if(true) regv[reg_vdi] += size; if(false) regv[reg_vsi] += size; } if(false) cmp8(data_src, data_dest);;
}
function insw()
{
    var port = reg16[reg_dx];
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(8 >> 3) : 8 >> 3; var ds, es; if(false && !false) data_src = reg8[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(false) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 8 > 8 && (!true || (dest & (8 >> 3) - 1) === 0) && (!false || (src & (8 >> 3) - 1) === 0); do { if(aligned) { { var phys_dest = translate_address_write(dest); memory.write_aligned16(phys_dest, in16(port)); }; } else { { safe_write16(dest, in16(port)); }; } if(true) dest += size, regv[reg_vdi] += size; if(false) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { safe_write16(dest, in16(port)); }; if(true) regv[reg_vdi] += size; if(false) regv[reg_vsi] += size; } if(false) cmp8(data_src, data_dest);;
}
function insd()
{
    var port = reg16[reg_dx];
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(32 >> 3) : 32 >> 3; var ds, es; if(false && !false) data_src = reg32[reg_eax]; if(true) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(false) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 32 > 8 && (!true || (dest & (32 >> 3) - 1) === 0) && (!false || (src & (32 >> 3) - 1) === 0); do { if(aligned) { { var phys_dest = translate_address_write(dest); memory.write_aligned32(phys_dest, in32(port)); }; } else { { safe_write32(dest, in32(port)); }; } if(true) dest += size, regv[reg_vdi] += size; if(false) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { safe_write32(dest, in32(port)); }; if(true) regv[reg_vdi] += size; if(false) regv[reg_vsi] += size; } if(false) cmp32(data_src, data_dest);;
}
function outsb()
{
    var port = reg16[reg_dx];
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(8 >> 3) : 8 >> 3; var ds, es; if(false && !true) data_src = reg8[reg_eax]; if(false) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 8 > 8 && (!false || (dest & (8 >> 3) - 1) === 0) && (!true || (src & (8 >> 3) - 1) === 0); do { if(aligned) { { out8(port, safe_read8(src)); }; } else { { out8(port, safe_read8(src)); }; } if(false) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { out8(port, safe_read8(src)); }; if(false) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(false) cmp8(data_src, data_dest);;
}
function outsw()
{
    var port = reg16[reg_dx];
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(16 >> 3) : 16 >> 3; var ds, es; if(false && !true) data_src = reg16[reg_eax]; if(false) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 16 > 8 && (!false || (dest & (16 >> 3) - 1) === 0) && (!true || (src & (16 >> 3) - 1) === 0); do { if(aligned) { { out16(port, safe_read16(src)); }; } else { { out16(port, safe_read16(src)); }; } if(false) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { out16(port, safe_read16(src)); }; if(false) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(false) cmp16(data_src, data_dest);;
}
function outsd()
{
    var port = reg16[reg_dx];
    var src, dest, data_src, data_dest; var size = flags & flag_direction ? -(32 >> 3) : 32 >> 3; var ds, es; if(false && !true) data_src = reg32[reg_eax]; if(false) es = get_seg(reg_es), dest = es + regv[reg_vdi]; if(true) ds = get_seg_prefix(reg_ds), src = ds + regv[reg_vsi]; if(repeat_string_prefix) { if(regv[reg_vcx] === 0) return; var aligned = 32 > 8 && (!false || (dest & (32 >> 3) - 1) === 0) && (!true || (src & (32 >> 3) - 1) === 0); do { if(aligned) { { out32(port, safe_read32s(src)); }; } else { { out32(port, safe_read32s(src)); }; } if(false) dest += size, regv[reg_vdi] += size; if(true) src += size, regv[reg_vsi] += size; } while(--regv[reg_vcx] && (!false || (data_src === data_dest) === repeat_string_type)); } else { { out32(port, safe_read32s(src)); }; if(false) regv[reg_vdi] += size; if(true) regv[reg_vsi] += size; } if(false) cmp32(data_src, data_dest);;
}
"use strict";
/** @const */
var FPU_LOG_OP = true;
/** 
 * this behaves as if no x87 fpu existed
 * @constructor
 */
function NoFPU(io)
{
    this.is_fpu = 0;
    //cr0 |= 4;
    this.fwait = function()
    {
    };
    this.op_D8_reg = function(imm8)
    {
        trigger_ud();
    };
    this.op_D8_mem = function(imm8, addr)
    {
        trigger_ud();
    };
    this.op_D9_reg = function(imm8)
    {
        trigger_ud();
    };
    this.op_D9_mem = function(imm8, addr)
    {
        var mod = imm8 >> 3 & 7;
        if(mod === 7)
        {
            // FNSTCW
            dbg_log("Unimplemented D9", LOG_FPU);
            safe_write16(addr, 0);
        }
        else
        {
            trigger_ud();
        }
    };
    this.op_DA = function(imm8)
    {
        trigger_ud();
    };
    this.op_DA_mem = function(imm8, addr)
    {
        trigger_ud();
    };
    this.op_DB_reg = function(imm8)
    {
        if(imm8 === 0xE3)
        {
            // fninit
            // don't error, even if no fpu is present
            dbg_log("Unimplemented DB", LOG_FPU);
        }
        else
        {
            trigger_ud();
        }
    };
    this.op_DB_mem = function(imm8, addr)
    {
        trigger_ud();
    };
    this.op_DC_reg = function(imm8)
    {
        trigger_ud();
    };
    this.op_DC_mem = function(imm8, addr)
    {
        trigger_ud();
    };
    this.op_DD_reg = function(imm8)
    {
        trigger_ud();
    };
    this.op_DD_mem = function(imm8, addr)
    {
        var mod = imm8 >> 3 & 7;
        switch(mod)
        {
            case 7:
                // fnstsw / store status word
                // no fpu -> write nonzero
                dbg_log("Unimplemented DD", LOG_FPU);
                safe_write16(addr, 1);
                break;
            default:
                trigger_ud();
        }
    };
    this.op_DE_reg = function(imm8)
    {
        trigger_ud();
    };
    this.op_DE_mem = function(imm8, addr)
    {
        trigger_ud();
    };
    this.op_DF_reg = function(imm8)
    {
        if(imm8 === 0xE0)
        {
            // fnstsw
            // no fpu -> write nonzero
            dbg_log("Unimplemented DF", LOG_FPU);
            reg16[reg_ax] = 1;
        }
        else
        {
            trigger_ud();
        }
    };
    this.op_DF_mem = function(imm8, addr)
    {
        trigger_ud();
    };
}
/**
 * @constructor
 */
function FPU(io)
{
    this.is_fpu = 1;
    // TODO:
    // - Precision Control
    // - QNaN, unordered comparison
    // - Exceptions
    var
        /** @const */
        C0 = 0x100,
        /** @const */
        C1 = 0x200,
        /** @const */
        C2 = 0x400,
        /** @const */
        C3 = 0x4000,
        /** @const */
        RESULT_FLAGS = C0 | C1 | C2 | C3,
        /** @const */
        STACK_TOP = 0x3800;
    var
        // precision, round & infinity control
        /** @const */
        PC = 3 << 8,
        /** @const */
        RC = 3 << 10,
        /** @const */
        IF = 1 << 12;
    // exception bits in the status word
    var EX_SF = 1 << 6,
        EX_P = 1 << 5,
        EX_U = 1 << 4,
        EX_O = 1 << 3,
        EX_Z = 1 << 2,
        EX_D = 1 << 1,
        EX_I = 1 << 0;
    var
        // Why no Float80Array :-(
        st = new Float64Array(8),
        st8 = new Uint8Array(st.buffer),
        st32 = new Uint32Array(st.buffer),
        // bitmap of which stack registers are empty
        stack_empty = 0xff,
        stack_ptr = 0,
        // used for conversion
        float32 = new Float32Array(1),
        float32_byte = new Uint8Array(float32.buffer),
        float32_int = new Uint32Array(float32.buffer),
        float64 = new Float64Array(1),
        float64_byte = new Uint8Array(float64.buffer),
        float64_int = new Uint32Array(float64.buffer),
        float80_int = new Uint8Array(10),
        control_word = 0x37F,
        status_word = 0,
        fpu_ip = 0,
        fpu_ip_selector = 0,
        fpu_opcode = 0,
        fpu_dp = 0,
        fpu_dp_selector = 0,
        /** @const */
        indefinite_nan = NaN;
    var constants = new Float64Array([
        1, Math.log(10) / Math.LN2, Math.LOG2E, Math.PI,
        Math.log(2) / Math.LN10, Math.LN2, 0
    ]);
    function fpu_unimpl()
    {
        dbg_trace();
        if(DEBUG) throw "fpu: unimplemented";
        else trigger_ud();
    }
    function stack_fault()
    {
        // TODO: Interrupt
        status_word |= EX_SF | EX_I;
    }
    function invalid_arithmatic()
    {
        status_word |= EX_I;
    }
    function fcom(y)
    {
        var x = get_st0();
        status_word &= ~RESULT_FLAGS;
        if(x > y)
        {
        }
        else if(y > x)
        {
            status_word |= C0;
        }
        else if(x === y)
        {
            status_word |= C3;
        }
        else
        {
            status_word |= C0 | C2 | C3;
        }
    }
    function fucom(y)
    {
        // TODO
        fcom(y);
    }
    function fcomi(y)
    {
        var x = st[stack_ptr];
        flags_changed &= ~(1 | flag_parity | flag_zero);
        flags &= ~(1 | flag_parity | flag_zero);
        if(x > y)
        {
        }
        else if(y > x)
        {
            flags |= 1;
        }
        else if(x === y)
        {
            flags |= flag_zero;
        }
        else
        {
            flags |= 1 | flag_parity | flag_zero;
        }
    }
    function fucomi(y)
    {
        // TODO
        fcomi(y);
    }
    function ftst()
    {
        var st0 = get_st0();
        status_word &= ~RESULT_FLAGS;
        if(isNaN(st0))
        {
            status_word |= C3 | C2 | C0;
        }
        else if(st0 === 0)
        {
            status_word |= C3;
        }
        else if(st0 < 0)
        {
            status_word |= C0;
        }
        // TODO: unordered (st0 is nan, etc)
    }
    function fxam()
    {
        var x = get_st0();
        status_word &= ~RESULT_FLAGS;
        status_word |= sign(0) << 9;
        if(stack_empty >> stack_ptr & 1)
        {
            status_word |= C3 | C0;
        }
        else if(isNaN(x))
        {
            status_word |= C0;
        }
        else if(x === 0)
        {
            status_word |= C3;
        }
        else if(x === Infinity || x === -Infinity)
        {
            status_word |= C2 | C0;
        }
        else
        {
            status_word |= C2;
        }
        // TODO:
        // Unsupported, Denormal
    }
    function finit()
    {
        control_word = 0x37F;
        status_word = 0;
        fpu_ip = 0;
        fpu_dp = 0;
        fpu_opcode = 0;
        stack_empty = 0xFF;
        stack_ptr = 0;
    }
    function load_status_word()
    {
        return status_word & ~(7 << 11) | stack_ptr << 11;
    }
    function safe_status_word(sw)
    {
        status_word = sw & ~(7 << 11);
        stack_ptr = sw >> 11 & 7;
    }
    function load_tag_word()
    {
        var tag_word = 0,
            value;
        for(var i = 0; i < 8; i++)
        {
            value = st[i];
            if(stack_empty >> i & 1)
            {
                tag_word |= 3 << (i << 1);
            }
            else if(value === 0)
            {
                tag_word |= 1 << (i << 1);
            }
            else if(isNaN(value) || value === Infinity || value === -Infinity)
            {
                tag_word |= 2 << (i << 1);
            }
        }
        //dbg_log("load  tw=" + h(tag_word) + " se=" + h(stack_empty) + " sp=" + stack_ptr, LOG_FPU);
        return tag_word;
    }
    function safe_tag_word(tag_word)
    {
        stack_empty = 0;
        for(var i = 0; i < 8; i++)
        {
            stack_empty |= (tag_word >> i) & (tag_word >> i + 1) & 1 << i;
        }
        //dbg_log("safe  tw=" + h(tag_word) + " se=" + h(stack_empty), LOG_FPU);
    }
    function fstenv(addr)
    {
        if(operand_size_32)
        {
            safe_write16(addr, control_word);
            safe_write16(addr + 4, load_status_word());
            safe_write16(addr + 8, load_tag_word());
            safe_write32(addr + 12, fpu_ip);
            safe_write16(addr + 16, fpu_ip_selector);
            safe_write16(addr + 18, fpu_opcode);
            safe_write32(addr + 20, fpu_dp);
            safe_write16(addr + 24, fpu_dp_selector);
        }
        else
        {
            fpu_unimpl();
        }
    }
    function fldenv(addr)
    {
        if(operand_size_32)
        {
            control_word = safe_read16(addr);
            safe_status_word(safe_read16(addr + 4));
            safe_tag_word(safe_read16(addr + 8));
            fpu_ip = (safe_read32s(addr + 12) >>> 0);
            fpu_ip_selector = safe_read16(addr + 16);
            fpu_opcode = safe_read16(addr + 18);
            fpu_dp = (safe_read32s(addr + 20) >>> 0);
            fpu_dp_selector = safe_read16(addr + 24);
        }
        else
        {
            fpu_unimpl();
        }
    }
    function fsave(addr)
    {
        fstenv(addr);
        addr += 28;
        for(var i = 0; i < 8; i++)
        {
            store_m80(addr, i - stack_ptr & 7);
            addr += 10;
        }
        //dbg_log("save " + [].slice.call(st), LOG_FPU);
        finit();
    }
    function frstor(addr)
    {
        fldenv(addr);
        addr += 28;
        for(var i = 0; i < 8; i++)
        {
            st[i] = load_m80(addr);
            addr += 10;
        }
        //dbg_log("rstor " + [].slice.call(st), LOG_FPU);
    }
    function integer_round(f)
    {
        var rc = control_word >> 10 & 3;
        if(rc === 0)
        {
            // Round to nearest, or even if equidistant
            var rounded = Math.round(f);
            if(rounded - f === 0.5 && (rounded & 1))
            {
                // Special case: Math.round rounds to positive infinity
                // if equidistant
                rounded--;
            }
            return rounded;
        }
            // rc=3 is truncate -> floor for positive numbers
        else if(rc === 1 || (rc === 3 && f > 0))
        {
            return Math.floor(f);
        }
        else
        {
            return Math.ceil(f);
        }
    }
    function truncate(x)
    {
        return x > 0 ? Math.floor(x) : Math.ceil(x);
    }
    function push(x)
    {
        stack_ptr = stack_ptr - 1 & 7;
        if(stack_empty >> stack_ptr & 1)
        {
            status_word &= ~C1;
            stack_empty &= ~(1 << stack_ptr);
            st[stack_ptr] = x;
        }
        else
        {
            status_word |= C1;
            stack_fault();
            st[stack_ptr] = indefinite_nan;
        }
    }
    function pop()
    {
        stack_empty |= 1 << stack_ptr;
        stack_ptr = stack_ptr + 1 & 7;
    }
    function get_sti(i)
    {
        dbg_assert(typeof i === "number" && i >= 0 && i < 8);
        i = i + stack_ptr & 7;
        if(stack_empty >> i & 1)
        {
            status_word &= ~C1;
            stack_fault();
            return indefinite_nan;
        }
        else
        {
            return st[i];
        }
    }
    function get_st0()
    {
        if(stack_empty >> stack_ptr & 1)
        {
            status_word &= ~C1;
            stack_fault();
            return indefinite_nan;
        }
        else
        {
            return st[stack_ptr];
        }
    }
    function assert_not_empty(i)
    {
        if(stack_empty >> (i + stack_ptr & 7) & 1)
        {
            status_word &= ~C1;
        }
        else
        {
        }
    }
    function load_m80(addr)
    {
        var exponent = safe_read16(addr + 8),
            sign,
            low = (safe_read32s(addr) >>> 0),
            high = (safe_read32s(addr + 4) >>> 0);
        sign = exponent >> 15;
        exponent &= ~0x8000;
        if(exponent === 0)
        {
            // TODO: denormal numbers
            return 0;
        }
        if(exponent < 0x7FFF)
        {
            exponent -= 0x3FFF;
        }
        else
        {
            // TODO: NaN, Infinity
            //dbg_log("Load m80 TODO", LOG_FPU);
            float64_byte[7] = 0x7F | sign << 7;
            float64_byte[6] = 0xF0 | high >> 30 << 3 & 0x08;
            float64_byte[5] = 0;
            float64_byte[4] = 0;
            float64_int[0] = 0;
            return float64[0];
        }
        // Note: some bits might be lost at this point
        var mantissa = low + 0x100000000 * high;
        if(sign)
        {
            mantissa = -mantissa;
        }
        //console.log("m: " + mantissa);
        //console.log("e: " + exponent);
        //console.log("s: " + sign);
        //console.log("f: " + mantissa * Math.pow(2, exponent - 63));
        // Simply compute the 64 bit floating point number.
        // An alternative write the mantissa, sign and exponent in the
        // float64_byte and return float64[0]
        return mantissa * Math.pow(2, exponent - 63);
    }
    function store_m80(addr, i)
    {
        float64[0] = st[stack_ptr + i & 7];
        var sign = float64_byte[7] & 0x80,
            exponent = (float64_byte[7] & 0x7f) << 4 | float64_byte[6] >> 4,
            low,
            high;
        if(exponent === 0x7FF)
        {
            // all bits set (NaN and infinity)
            exponent = 0x7FFF;
            low = 0;
            high = 0x80000000 | (float64_int[1] & 0x80000) << 11;
        }
        else if(exponent === 0)
        {
            // zero and denormal numbers
            // Just assume zero for now
            low = 0;
            high = 0;
        }
        else
        {
            exponent += 0x3FFF - 0x3FF;
            // does the mantissa need to be adjusted?
            low = float64_int[0] << 11;
            high = 0x80000000 | (float64_int[1] & 0xFFFFF) << 11 | (float64_int[0] >>> 21);
        }
        dbg_assert(exponent >= 0 && exponent < 0x8000);
        safe_write32(addr, low);
        safe_write32(addr + 4, high);
        safe_write16(addr + 8, sign << 8 | exponent);
    }
    function load_m64(addr)
    {
        float64_int[0] = safe_read32s(addr);
        float64_int[1] = safe_read32s(addr + 4);
        return float64[0];
    };
    function store_m64(addr, i)
    {
        // protect against writing only a single dword
        // and then page-faulting
        translate_address_write(addr + 7);
        float64[0] = get_sti(i);
        safe_write32(addr, float64_int[0]);
        safe_write32(addr + 4, float64_int[1]);
    };
    function load_m32(addr)
    {
        float32_int[0] = safe_read32s(addr);
        return float32[0];
    };
    function store_m32(addr, i)
    {
        float32[0] = get_sti(i);
        safe_write32(addr, float32_int[0]);
    };
    // sign of a number on the stack
    function sign(i)
    {
        return st8[(stack_ptr + i & 7) << 3 | 7] >> 7;
    };
    function dbg_log_fpu_op(op, imm8)
    {
        if(!FPU_LOG_OP)
        {
            return;
        }
        if(imm8 >= 0xC0)
        {
            dbg_log(h(op, 2) + " " + h(imm8, 2) + "/" + (imm8 >> 3 & 7) + "/" + (imm8 & 7) +
                    " @" + h(instruction_pointer, 8) + " sp=" + stack_ptr + " st=" + h(stack_empty, 2), LOG_FPU);
        }
        else
        {
            dbg_log(h(op, 2) + " /" + (imm8 >> 3 & 7) +
                    "     @" + h(instruction_pointer, 8) + " sp=" + stack_ptr + " st=" + h(stack_empty, 2), LOG_FPU);
        }
    }
    this.fwait = function()
    {
        // TODO:
        // Exceptions
    };
    this.op_D8_reg = function(imm8)
    {
        dbg_log_fpu_op(0xD8, imm8);
        var mod = imm8 >> 3 & 7,
            low = imm8 & 7,
            sti = get_sti(low),
            st0 = get_st0();
        switch(mod)
        {
            case 0:
                // fadd
                st[stack_ptr] = st0 + sti;
                break;
            case 1:
                // fmul
                st[stack_ptr] = st0 * sti;
                break;
            case 2:
                // fcom
                fcom(sti);
                break;
            case 3:
                // fcomp
                fcom(sti);
                pop();
                break;
            case 4:
                // fsub
                st[stack_ptr] = st0 - sti;
                break;
            case 5:
                // fsubr
                st[stack_ptr] = sti - st0;
                break;
            case 6:
                // fdiv
                st[stack_ptr] = st0 / sti;
                break;
            case 7:
                // fdivr
                st[stack_ptr] = sti / st0;
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_D8_mem = function(imm8, addr)
    {
        dbg_log_fpu_op(0xD8, imm8);
        var mod = imm8 >> 3 & 7,
            m32 = load_m32(addr);
        var st0 = get_st0();
        switch(mod)
        {
            case 0:
                // fadd
                st[stack_ptr] = st0 + m32;
                break;
            case 1:
                // fmul
                st[stack_ptr] = st0 * m32;
                break;
            case 2:
                // fcom
                fcom(m32);
                break;
            case 3:
                // fcomp
                fcom(m32);
                pop();
                break;
            case 4:
                // fsub
                st[stack_ptr] = st0 - m32;
                break;
            case 5:
                // fsubr
                st[stack_ptr] = m32 - st0;
                break;
            case 6:
                // fdiv
                st[stack_ptr] = st0 / m32;
                break;
            case 7:
                // fdivr
                st[stack_ptr] = m32 / st0;
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_D9_reg = function(imm8)
    {
        dbg_log_fpu_op(0xD9, imm8);
        var mod = imm8 >> 3 & 7,
            low = imm8 & 7;
        switch(mod)
        {
            case 0:
                // fld
                var sti = get_sti(low);
                push(sti);
                break;
            case 1:
                // fxch
                var sti = get_sti(low);
                st[stack_ptr + low & 7] = get_st0();
                st[stack_ptr] = sti;
                break;
            case 4:
                switch(low)
                {
                    case 0:
                        // fchs
                        st[stack_ptr] = -get_st0();
                        break;
                    case 1:
                        // fabs
                        st[stack_ptr] = Math.abs(get_st0());
                        break;
                    case 4:
                        ftst();
                        break;
                    case 5:
                        fxam();
                        break;
                    default:
                        dbg_log(low); fpu_unimpl();
                }
                break;
            case 5:
                push(constants[low]);
                break;
            case 6:
                switch(low)
                {
                    case 0:
                        // f2xm1
                        st[stack_ptr] = Math.pow(2, get_st0()) - 1;
                        break;
                    case 1:
                        // fyl2x
                        st[stack_ptr + 1 & 7] = get_sti(1) * Math.log(get_st0()) / Math.LN2;
                        pop();
                        break;
                    case 2:
                        // fptan
                        st[stack_ptr] = Math.tan(get_st0());
                        push(1); // no bug: push constant 1
                        break;
                    case 3:
                        // fpatan
                        //st[stack_ptr + 1 & 7] = Math.atan(get_sti(1) / get_st0());
                        st[stack_ptr + 1 & 7] = Math.atan2(get_sti(1), get_st0());
                        pop();
                        break;
                    case 5:
                        // fprem1
                        st[stack_ptr] = get_st0() % get_sti(1);
                        break;
                    default:
                        dbg_log(low); fpu_unimpl();
                }
                break;
            case 7:
                switch(low)
                {
                    case 0:
                        // fprem
                        st[stack_ptr] = get_st0() % get_sti(1);
                        break;
                    case 2:
                        st[stack_ptr] = Math.sqrt(get_st0());
                        break;
                    case 3:
                        var st0 = get_st0();
                        st[stack_ptr] = Math.sin(st0);
                        push(Math.cos(st0));
                        break;
                    case 4:
                        // frndint
                        st[stack_ptr] = integer_round(get_st0());
                        break;
                    case 5:
                        // fscale
                        st[stack_ptr] = get_st0() * Math.pow(2, truncate(get_sti(1)));
                        break;
                    case 6:
                        st[stack_ptr] = Math.sin(get_st0());
                        break;
                    case 7:
                        st[stack_ptr] = Math.cos(get_st0());
                        break;
                    default:
                        dbg_log(low); fpu_unimpl();
                }
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_D9_mem = function(imm8, addr)
    {
        dbg_log_fpu_op(0xD9, imm8);
        var mod = imm8 >> 3 & 7;
        switch(mod)
        {
            case 0:
                var data = load_m32(addr);
                push(data);
                break;
            case 2:
                store_m32(addr, 0);
                break;
            case 3:
                store_m32(addr, 0);
                pop();
                break;
            case 4:
                fldenv(addr);
                break;
            case 5:
                var word = safe_read16(addr);
                control_word = word;
                break;
            case 6:
                fstenv(addr);
                break;
            case 7:
                safe_write16(addr, control_word);
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DA_reg = function(imm8)
    {
        dbg_log_fpu_op(0xDA, imm8);
        var mod = imm8 >> 3 & 7,
            low = imm8 & 7;
        switch(mod)
        {
            case 0:
                // fcmovb
                if(test_b())
                {
                    st[stack_ptr] = get_sti(low);
                    stack_empty &= ~(1 << stack_ptr);
                }
                break;
            case 1:
                // fcmove
                if(test_z())
                {
                    st[stack_ptr] = get_sti(low);
                    stack_empty &= ~(1 << stack_ptr);
                }
                break;
            case 2:
                // fcmovbe
                if(test_be())
                {
                    st[stack_ptr] = get_sti(low);
                    stack_empty &= ~(1 << stack_ptr);
                }
                break;
            case 3:
                // fcmovu
                if(test_p())
                {
                    st[stack_ptr] = get_sti(low);
                    stack_empty &= ~(1 << stack_ptr);
                }
                break;
            case 5:
                if(low === 1)
                {
                    // fucompp
                    fucom(get_sti(1));
                    pop();
                    pop();
                }
                else
                {
                    dbg_log(mod); fpu_unimpl();
                }
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DA_mem = function(imm8, addr)
    {
        dbg_log_fpu_op(0xDA, imm8);
        var mod = imm8 >> 3 & 7,
            m32 = safe_read32s(addr);
        var st0 = get_st0();
        switch(mod)
        {
            case 0:
                // fadd
                st[stack_ptr] = st0 + m32;
                break;
            case 1:
                // fmul
                st[stack_ptr] = st0 * m32;
                break;
            case 2:
                // fcom
                fcom(m32);
                break;
            case 3:
                // fcomp
                fcom(m32);
                pop();
                break;
            case 4:
                // fsub
                st[stack_ptr] = st0 - m32;
                break;
            case 5:
                // fsubr
                st[stack_ptr] = m32 - st0;
                break;
            case 6:
                // fdiv
                st[stack_ptr] = st0 / m32;
                break;
            case 7:
                // fdivr
                st[stack_ptr] = m32 / st0;
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DB_reg = function(imm8)
    {
        dbg_log_fpu_op(0xDB, imm8);
        var mod = imm8 >> 3 & 7,
            low = imm8 & 7;
        switch(mod)
        {
            case 0:
                // fcmovnb
                if(!test_b())
                {
                    st[stack_ptr] = get_sti(low);
                    stack_empty &= ~(1 << stack_ptr);
                }
                break;
            case 1:
                // fcmovne
                if(!test_z())
                {
                    st[stack_ptr] = get_sti(low);
                    stack_empty &= ~(1 << stack_ptr);
                }
                break;
            case 2:
                // fcmovnbe
                if(!test_be())
                {
                    st[stack_ptr] = get_sti(low);
                    stack_empty &= ~(1 << stack_ptr);
                }
                break;
            case 3:
                // fcmovnu
                if(!test_p())
                {
                    st[stack_ptr] = get_sti(low);
                    stack_empty &= ~(1 << stack_ptr);
                }
                break;
            case 4:
                if(imm8 === 0xE3)
                {
                    finit();
                }
                else if(imm8 === 0xE4)
                {
                    // fsetpm
                    // treat as nop
                }
                else
                {
                    fpu_unimpl();
                }
                break;
            case 5:
                fucomi(get_sti(low));
                break;
            case 6:
                fcomi(get_sti(low));
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DB_mem = function(imm8, addr)
    {
        dbg_log_fpu_op(0xDB, imm8);
        var mod = imm8 >> 3 & 7;
        switch(mod)
        {
            case 0:
                // fild
                var int32 = safe_read32s(addr);
                push(int32);
                break;
            case 2:
                // fist
                var st0 = get_st0();
                if(isNaN(st0) || st0 > 0x7FFFFFFF || st0 < -0x80000000)
                {
                    invalid_arithmatic();
                    safe_write32(addr, 0x80000000);
                }
                else
                {
                    // TODO: Invalid operation
                    safe_write32(addr, integer_round(st0));
                }
                break;
            case 3:
                // fistp
                var st0 = get_st0();
                if(isNaN(st0) || st0 > 0x7FFFFFFF || st0 < -0x80000000)
                {
                    invalid_arithmatic();
                    safe_write32(addr, 0x80000000);
                }
                else
                {
                    safe_write32(addr, integer_round(st0));
                }
                pop();
                break;
            case 5:
                // fld
                push(load_m80(addr));
                break;
            case 7:
                // fstp
                store_m80(addr, 0);
                pop();
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DC_reg = function(imm8)
    {
        dbg_log_fpu_op(0xDC, imm8);
        var mod = imm8 >> 3 & 7,
            low = imm8 & 7,
            low_ptr = stack_ptr + low & 7,
            sti = get_sti(low),
            st0 = get_st0();
        switch(mod)
        {
            case 0:
                // fadd
                st[low_ptr] = sti + st0;
                break;
            case 1:
                // fmul
                st[low_ptr] = sti * st0;
                break;
            case 2:
                // fcom
                fcom(sti);
                break;
            case 3:
                // fcomp
                fcom(sti);
                pop();
                break;
            case 4:
                // fsubr
                st[low_ptr] = st0 - sti;
                break;
            case 5:
                // fsub
                st[low_ptr] = sti - st0;
                break;
            case 6:
                // fdivr
                st[low_ptr] = st0 / sti;
                break;
            case 7:
                // fdiv
                st[low_ptr] = sti / st0;
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DC_mem = function(imm8, addr)
    {
        dbg_log_fpu_op(0xDC, imm8);
        var
            mod = imm8 >> 3 & 7,
            m64 = load_m64(addr);
        var st0 = get_st0();
        switch(mod)
        {
            case 0:
                // fadd
                st[stack_ptr] = st0 + m64;
                break;
            case 1:
                // fmul
                st[stack_ptr] = st0 * m64;
                break;
            case 2:
                // fcom
                fcom(m64);
                break;
            case 3:
                // fcomp
                fcom(m64);
                pop();
                break;
            case 4:
                // fsub
                st[stack_ptr] = st0 - m64;
                break;
            case 5:
                // fsubr
                st[stack_ptr] = m64 - st0;
                break;
            case 6:
                // fdiv
                st[stack_ptr] = st0 / m64;
                break;
            case 7:
                // fdivr
                st[stack_ptr] = m64 / st0;
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DD_reg = function(imm8)
    {
        dbg_log_fpu_op(0xDD, imm8);
        var mod = imm8 >> 3 & 7,
            low = imm8 & 7;
        switch(mod)
        {
            case 0:
                // ffree
                stack_empty |= 1 << (stack_ptr + low & 7);
                break;
            case 2:
                // fst
                st[stack_ptr + low & 7] = get_st0();
                break;
            case 3:
                // fstp
                if(low === 0)
                {
                    pop();
                }
                else
                {
                    st[stack_ptr + low & 7] = get_st0();
                    pop();
                }
                break;
            case 4:
                fucom(get_sti(low));
                break;
            case 5:
                // fucomp
                fucom(get_sti(low));
                pop();
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DD_mem = function(imm8, addr)
    {
        dbg_log_fpu_op(0xDD, imm8);
        var mod = imm8 >> 3 & 7;
        switch(mod)
        {
            case 0:
                // fld
                var data = load_m64(addr);
                push(data);
                break;
            case 2:
                // fst
                store_m64(addr, 0);
                break;
            case 3:
                // fstp
                store_m64(addr, 0);
                pop();
                break;
            case 4:
                frstor(addr);
                break;
            case 6:
                // fsave
                fsave(addr);
                break;
            case 7:
                // fnstsw / store status word
                safe_write16(addr, load_status_word());
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DE_reg = function(imm8)
    {
        dbg_log_fpu_op(0xDE, imm8);
        var mod = imm8 >> 3 & 7,
            low = imm8 & 7,
            low_ptr = stack_ptr + low & 7,
            sti = get_sti(low),
            st0 = get_st0();
        switch(mod)
        {
            case 0:
                // faddp
                st[low_ptr] = sti + st0;
                break;
            case 1:
                // fmulp
                st[low_ptr] = sti * st0;
                break;
            case 2:
                // fcomp
                fcom(sti);
                break;
            case 3:
                // fcompp
                if(low === 1)
                {
                    fcom(st[low_ptr]);
                    pop();
                }
                else
                {
                    // not a valid encoding
                    dbg_log(mod);
                    fpu_unimpl();
                }
                break;
            case 4:
                // fsubrp
                st[low_ptr] = st0 - sti;
                break;
            case 5:
                // fsubp
                st[low_ptr] = sti - st0;
                break;
            case 6:
                // fdivrp
                st[low_ptr] = st0 / sti;
                break;
            case 7:
                // fdivp
                st[low_ptr] = sti / st0;
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
        pop();
    };
    this.op_DE_mem = function(imm8, addr)
    {
        dbg_log_fpu_op(0xDE, imm8);
        var mod = imm8 >> 3 & 7,
            m16 = (safe_read16(addr) << 16 >> 16);
        var st0 = get_st0();
        switch(mod)
        {
            case 0:
                // fadd
                st[stack_ptr] = st0 + m16;
                break;
            case 1:
                // fmul
                st[stack_ptr] = st0 * m16;
                break;
            case 2:
                // fcom
                fcom(m16);
                break;
            case 3:
                // fcomp
                fcom(m16);
                pop();
                break;
            case 4:
                // fsub
                st[stack_ptr] = st0 - m16;
                break;
            case 5:
                // fsubr
                st[stack_ptr] = m16 - st0;
                break;
            case 6:
                // fdiv
                st[stack_ptr] = st0 / m16;
                break;
            case 7:
                // fdivr
                st[stack_ptr] = m16 / st0;
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DF_reg = function(imm8)
    {
        dbg_log_fpu_op(0xDF, imm8);
        var mod = imm8 >> 3 & 7,
            low = imm8 & 7;
        switch(mod)
        {
            case 4:
                if(imm8 === 0xE0)
                {
                    // fnstsw
                    reg16[reg_ax] = load_status_word();
                }
                else
                {
                    dbg_log(imm8);
                    fpu_unimpl();
                }
                break;
            case 5:
                // fucomip
                fucomi(get_sti(low));
                pop();
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
    this.op_DF_mem = function(imm8, addr)
    {
        dbg_log_fpu_op(0xDF, imm8);
        var mod = imm8 >> 3 & 7;
        switch(mod)
        {
            case 0:
                var m16 = (safe_read16(addr) << 16 >> 16);
                push(m16);
                break;
            case 2:
                // fist
                var st0 = get_st0();
                if(isNaN(st0) || st0 > 0x7FFF || st0 < -0x8000)
                {
                    invalid_arithmatic();
                    safe_write16(addr, 0x8000);
                }
                else
                {
                    safe_write16(addr, integer_round(st0));
                }
                break;
            case 3:
                // fistp
                var st0 = get_st0();
                if(isNaN(st0) || st0 > 0x7FFF || st0 < -0x8000)
                {
                    invalid_arithmatic();
                    safe_write16(addr, 0x8000);
                }
                else
                {
                    safe_write16(addr, integer_round(st0));
                }
                pop();
                break;
            case 5:
                // fild
                var low = (safe_read32s(addr) >>> 0);
                var high = (safe_read32s(addr + 4) >>> 0);
                var m64 = low + 0x100000000 * high;
                if(high >> 31)
                {
                    m64 -= 0x10000000000000000;
                }
                push(m64);
                break;
            case 7:
                // fistp
                var st0 = integer_round(get_st0());
                if(isNaN(st0) || st0 > 0x7FFFFFFFFFFFFFFF || st0 < -0x8000000000000000)
                {
                    st0 = 0x8000000000000000;
                    invalid_arithmatic();
                }
                pop();
                safe_write32(addr, st0);
                st0 /= 0x100000000;
                if(st0 < 0 && st0 > -1)
                    st0 = -1;
                safe_write32(addr + 4, st0);
                break;
            default:
                dbg_log(mod);
                fpu_unimpl();
        }
    };
}
"use strict";
var table16 = [],
    table32 = [],
    table0F_16 = [],
    table0F_32 = [];
// no cmp, because it uses different arguments
// very special, should be somewhere else?
// equivalent to switch(modrm_byte >> 3 & 7)
//#define sub_op(i0, i1, i2, i3, i4, i5, i6, i7) //    if(modrm_byte & 0x20) { sub_op1(i4, i5, i6, i7) }//    else { sub_op1(i0, i1, i2, i3) }
//
//#define sub_op1(i0, i1, i2, i3)//    if(modrm_byte & 0x10) { sub_op2(i2, i3) }//    else { sub_op2(i0, i1) }
//
//#define sub_op2(i0, i1)//    if(modrm_byte & 0x08) { i1 }//    else { i0 }
// use modrm_byte to write a value to memory or register 
// (without reading it beforehand)
// use modrm_byte to write a value to memory or register,
// using the previous data from memory or register.
// op is a function call that needs to return the result
// opcode with modrm byte
// opcode that has a 16 and a 32 bit version
// instructions start here
table16[0x00] = table32[0x00] = function() { var modrm_byte = read_imm8(); { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, add8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1])); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = add8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } } }; table16[0x00 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, add16(data, reg16[modrm_byte >> 2 & 14])); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, add16(data, reg16[modrm_byte >> 2 & 14])); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = add16(data, reg16[modrm_byte >> 2 & 14]); } } }; table32[0x00 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, add32(data, reg32[modrm_byte >> 3 & 7])); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, add32(data, reg32[modrm_byte >> 3 & 7])); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = add32(data, reg32[modrm_byte >> 3 & 7]); } } }; table16[0x00 | 2] = table32[0x00 | 2] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1] = add8(reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1], data); } }; table16[0x00 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = add16(reg16[modrm_byte >> 2 & 14], data); } }; table32[0x00 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = add32(reg32[modrm_byte >> 3 & 7], data); } }; table16[0x00 | 4] = table32[0x00 | 4] = function() { { reg8[reg_al] = add8(reg8[reg_al], read_imm8()); } }; table16[0x00 | 5] = function() { { reg16[reg_ax] = add16(reg16[reg_ax], read_imm16()); } }; table32[0x00 | 5] = function() { { reg32[reg_eax] = add32(reg32[reg_eax], (read_imm32s() >>> 0)); } };;
table16[0x06] = function() { { push16(sreg[reg_es]); } }; table32[0x06] = function() { { push32(sreg[reg_es]); } };;
table16[0x07] = function() { { switch_seg(reg_es, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 2; } }; table32[0x07] = function() { { switch_seg(reg_es, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 4; } };;;
//op2(0x07, 
//    { safe_pop16(sreg[reg_es]); switch_seg(reg_es, memory.read16(get_esp_read(0))); }, 
//    { safe_pop32s(sreg[reg_es]); switch_seg(reg_es); });
table16[0x08] = table32[0x08] = function() { var modrm_byte = read_imm8(); { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, or8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1])); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = or8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } } }; table16[0x08 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, or16(data, reg16[modrm_byte >> 2 & 14])); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, or16(data, reg16[modrm_byte >> 2 & 14])); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = or16(data, reg16[modrm_byte >> 2 & 14]); } } }; table32[0x08 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high); virt_boundary_write32(phys_addr, phys_addr_high, or32(data, reg32s[modrm_byte >> 3 & 7])); } else { data = memory.read32s(phys_addr); memory.write32(phys_addr, or32(data, reg32s[modrm_byte >> 3 & 7])); } } else { data = reg32s[modrm_byte & 7]; reg32s[modrm_byte & 7] = or32(data, reg32s[modrm_byte >> 3 & 7]); } } }; table16[0x08 | 2] = table32[0x08 | 2] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1] = or8(reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1], data); } }; table16[0x08 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = or16(reg16[modrm_byte >> 2 & 14], data); } }; table32[0x08 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = or32(reg32s[modrm_byte >> 3 & 7], data); } }; table16[0x08 | 4] = table32[0x08 | 4] = function() { { reg8[reg_al] = or8(reg8[reg_al], read_imm8()); } }; table16[0x08 | 5] = function() { { reg16[reg_ax] = or16(reg16[reg_ax], read_imm16()); } }; table32[0x08 | 5] = function() { { reg32[reg_eax] = or32(reg32s[reg_eax], read_imm32s()); } };;
table16[0x0E] = function() { { push16(sreg[reg_cs]); } }; table32[0x0E] = function() { { push32(sreg[reg_cs]); } };;
table16[0x0F] = table32[0x0F] = function() { { table0F[read_imm8()](); } };;
table16[0x10] = table32[0x10] = function() { var modrm_byte = read_imm8(); { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, adc8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1])); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = adc8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } } }; table16[0x10 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, adc16(data, reg16[modrm_byte >> 2 & 14])); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, adc16(data, reg16[modrm_byte >> 2 & 14])); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = adc16(data, reg16[modrm_byte >> 2 & 14]); } } }; table32[0x10 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, adc32(data, reg32[modrm_byte >> 3 & 7])); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, adc32(data, reg32[modrm_byte >> 3 & 7])); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = adc32(data, reg32[modrm_byte >> 3 & 7]); } } }; table16[0x10 | 2] = table32[0x10 | 2] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1] = adc8(reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1], data); } }; table16[0x10 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = adc16(reg16[modrm_byte >> 2 & 14], data); } }; table32[0x10 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = adc32(reg32[modrm_byte >> 3 & 7], data); } }; table16[0x10 | 4] = table32[0x10 | 4] = function() { { reg8[reg_al] = adc8(reg8[reg_al], read_imm8()); } }; table16[0x10 | 5] = function() { { reg16[reg_ax] = adc16(reg16[reg_ax], read_imm16()); } }; table32[0x10 | 5] = function() { { reg32[reg_eax] = adc32(reg32[reg_eax], (read_imm32s() >>> 0)); } };;
table16[0x16] = function() { { push16(sreg[reg_ss]); } }; table32[0x16] = function() { { push32(sreg[reg_ss]); } };;
table16[0x17] = function() { { switch_seg(reg_ss, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 2; } }; table32[0x17] = function() { { switch_seg(reg_ss, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 4; } };;;
//op2(0x17, 
//    { safe_pop16(sreg[reg_ss]); switch_seg(reg_ss); }, 
//    { safe_pop32s(sreg[reg_ss]); switch_seg(reg_ss); });
table16[0x18] = table32[0x18] = function() { var modrm_byte = read_imm8(); { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, sbb8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1])); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = sbb8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } } }; table16[0x18 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, sbb16(data, reg16[modrm_byte >> 2 & 14])); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, sbb16(data, reg16[modrm_byte >> 2 & 14])); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = sbb16(data, reg16[modrm_byte >> 2 & 14]); } } }; table32[0x18 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, sbb32(data, reg32[modrm_byte >> 3 & 7])); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, sbb32(data, reg32[modrm_byte >> 3 & 7])); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = sbb32(data, reg32[modrm_byte >> 3 & 7]); } } }; table16[0x18 | 2] = table32[0x18 | 2] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1] = sbb8(reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1], data); } }; table16[0x18 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = sbb16(reg16[modrm_byte >> 2 & 14], data); } }; table32[0x18 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = sbb32(reg32[modrm_byte >> 3 & 7], data); } }; table16[0x18 | 4] = table32[0x18 | 4] = function() { { reg8[reg_al] = sbb8(reg8[reg_al], read_imm8()); } }; table16[0x18 | 5] = function() { { reg16[reg_ax] = sbb16(reg16[reg_ax], read_imm16()); } }; table32[0x18 | 5] = function() { { reg32[reg_eax] = sbb32(reg32[reg_eax], (read_imm32s() >>> 0)); } };;
table16[0x1E] = function() { { push16(sreg[reg_ds]); } }; table32[0x1E] = function() { { push32(sreg[reg_ds]); } };;
table16[0x1F] = function() { { switch_seg(reg_ds, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 2; } }; table32[0x1F] = function() { { switch_seg(reg_ds, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 4; } };;;
//op2(0x1F, 
//    { safe_pop16(sreg[reg_ds]); switch_seg(reg_ds); }, 
//    { safe_pop32s(sreg[reg_ds]); switch_seg(reg_ds); });
table16[0x20] = table32[0x20] = function() { var modrm_byte = read_imm8(); { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, and8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1])); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = and8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } } }; table16[0x20 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, and16(data, reg16[modrm_byte >> 2 & 14])); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, and16(data, reg16[modrm_byte >> 2 & 14])); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = and16(data, reg16[modrm_byte >> 2 & 14]); } } }; table32[0x20 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high); virt_boundary_write32(phys_addr, phys_addr_high, and32(data, reg32s[modrm_byte >> 3 & 7])); } else { data = memory.read32s(phys_addr); memory.write32(phys_addr, and32(data, reg32s[modrm_byte >> 3 & 7])); } } else { data = reg32s[modrm_byte & 7]; reg32s[modrm_byte & 7] = and32(data, reg32s[modrm_byte >> 3 & 7]); } } }; table16[0x20 | 2] = table32[0x20 | 2] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1] = and8(reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1], data); } }; table16[0x20 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = and16(reg16[modrm_byte >> 2 & 14], data); } }; table32[0x20 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = and32(reg32s[modrm_byte >> 3 & 7], data); } }; table16[0x20 | 4] = table32[0x20 | 4] = function() { { reg8[reg_al] = and8(reg8[reg_al], read_imm8()); } }; table16[0x20 | 5] = function() { { reg16[reg_ax] = and16(reg16[reg_ax], read_imm16()); } }; table32[0x20 | 5] = function() { { reg32[reg_eax] = and32(reg32s[reg_eax], read_imm32s()); } };;
table16[0x26] = table32[0x26] = function() { { seg_prefix(reg_es); } };;
table16[0x27] = table32[0x27] = function() { { bcd_daa(); } };;
table16[0x28] = table32[0x28] = function() { var modrm_byte = read_imm8(); { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, sub8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1])); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = sub8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } } }; table16[0x28 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, sub16(data, reg16[modrm_byte >> 2 & 14])); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, sub16(data, reg16[modrm_byte >> 2 & 14])); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = sub16(data, reg16[modrm_byte >> 2 & 14]); } } }; table32[0x28 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, sub32(data, reg32[modrm_byte >> 3 & 7])); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, sub32(data, reg32[modrm_byte >> 3 & 7])); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = sub32(data, reg32[modrm_byte >> 3 & 7]); } } }; table16[0x28 | 2] = table32[0x28 | 2] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1] = sub8(reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1], data); } }; table16[0x28 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = sub16(reg16[modrm_byte >> 2 & 14], data); } }; table32[0x28 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = sub32(reg32[modrm_byte >> 3 & 7], data); } }; table16[0x28 | 4] = table32[0x28 | 4] = function() { { reg8[reg_al] = sub8(reg8[reg_al], read_imm8()); } }; table16[0x28 | 5] = function() { { reg16[reg_ax] = sub16(reg16[reg_ax], read_imm16()); } }; table32[0x28 | 5] = function() { { reg32[reg_eax] = sub32(reg32[reg_eax], (read_imm32s() >>> 0)); } };;
table16[0x2E] = table32[0x2E] = function() { { seg_prefix(reg_cs); } };;
table16[0x2F] = table32[0x2F] = function() { { bcd_das(); } };;
table16[0x30] = table32[0x30] = function() { var modrm_byte = read_imm8(); { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, xor8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1])); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = xor8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } } }; table16[0x30 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, xor16(data, reg16[modrm_byte >> 2 & 14])); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, xor16(data, reg16[modrm_byte >> 2 & 14])); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = xor16(data, reg16[modrm_byte >> 2 & 14]); } } }; table32[0x30 | 1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high); virt_boundary_write32(phys_addr, phys_addr_high, xor32(data, reg32s[modrm_byte >> 3 & 7])); } else { data = memory.read32s(phys_addr); memory.write32(phys_addr, xor32(data, reg32s[modrm_byte >> 3 & 7])); } } else { data = reg32s[modrm_byte & 7]; reg32s[modrm_byte & 7] = xor32(data, reg32s[modrm_byte >> 3 & 7]); } } }; table16[0x30 | 2] = table32[0x30 | 2] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1] = xor8(reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1], data); } }; table16[0x30 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = xor16(reg16[modrm_byte >> 2 & 14], data); } }; table32[0x30 | 3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = xor32(reg32s[modrm_byte >> 3 & 7], data); } }; table16[0x30 | 4] = table32[0x30 | 4] = function() { { reg8[reg_al] = xor8(reg8[reg_al], read_imm8()); } }; table16[0x30 | 5] = function() { { reg16[reg_ax] = xor16(reg16[reg_ax], read_imm16()); } }; table32[0x30 | 5] = function() { { reg32[reg_eax] = xor32(reg32s[reg_eax], read_imm32s()); } };;
table16[0x36] = table32[0x36] = function() { { seg_prefix(reg_ss); } };;
table16[0x37] = table32[0x37] = function() { { bcd_aaa(); } };;
table16[0x38] = table32[0x38] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; cmp8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } };
table16[0x39] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; cmp16(data, reg16[modrm_byte >> 2 & 14]); } }; table32[0x39] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; cmp32(data, reg32[modrm_byte >> 3 & 7]); } };
table16[0x3A] = table32[0x3A] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; cmp8(reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1], data); } };
table16[0x3B] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; cmp16(reg16[modrm_byte >> 2 & 14], data); } }; table32[0x3B] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; cmp32(reg32[modrm_byte >> 3 & 7], data); } };
table16[0x3C] = table32[0x3C] = function() { { cmp8(reg8[reg_al], read_imm8()); } };
table16[0x3D] = function() { { cmp16(reg16[reg_ax], read_imm16()); } }; table32[0x3D] = function() { { cmp32(reg32[reg_eax], (read_imm32s() >>> 0)); } };
table16[0x3E] = table32[0x3E] = function() { { seg_prefix(reg_ds); } };;
table16[0x3F] = table32[0x3F] = function() { { bcd_aas(); } };;
table16[0x40 | 0] = function() { { reg16[reg_ax] = inc16(reg16[reg_ax]); } }; table32[0x40 | 0] = function() { { reg32[reg_eax] = inc32(reg32[reg_eax]); } };; table16[0x40 | 1] = function() { { reg16[reg_cx] = inc16(reg16[reg_cx]); } }; table32[0x40 | 1] = function() { { reg32[reg_ecx] = inc32(reg32[reg_ecx]); } };; table16[0x40 | 2] = function() { { reg16[reg_dx] = inc16(reg16[reg_dx]); } }; table32[0x40 | 2] = function() { { reg32[reg_edx] = inc32(reg32[reg_edx]); } };; table16[0x40 | 3] = function() { { reg16[reg_bx] = inc16(reg16[reg_bx]); } }; table32[0x40 | 3] = function() { { reg32[reg_ebx] = inc32(reg32[reg_ebx]); } };; table16[0x40 | 4] = function() { { reg16[reg_sp] = inc16(reg16[reg_sp]); } }; table32[0x40 | 4] = function() { { reg32[reg_esp] = inc32(reg32[reg_esp]); } };; table16[0x40 | 5] = function() { { reg16[reg_bp] = inc16(reg16[reg_bp]); } }; table32[0x40 | 5] = function() { { reg32[reg_ebp] = inc32(reg32[reg_ebp]); } };; table16[0x40 | 6] = function() { { reg16[reg_si] = inc16(reg16[reg_si]); } }; table32[0x40 | 6] = function() { { reg32[reg_esi] = inc32(reg32[reg_esi]); } };; table16[0x40 | 7] = function() { { reg16[reg_di] = inc16(reg16[reg_di]); } }; table32[0x40 | 7] = function() { { reg32[reg_edi] = inc32(reg32[reg_edi]); } };;;
table16[0x48 | 0] = function() { { reg16[reg_ax] = dec16(reg16[reg_ax]); } }; table32[0x48 | 0] = function() { { reg32[reg_eax] = dec32(reg32[reg_eax]); } };; table16[0x48 | 1] = function() { { reg16[reg_cx] = dec16(reg16[reg_cx]); } }; table32[0x48 | 1] = function() { { reg32[reg_ecx] = dec32(reg32[reg_ecx]); } };; table16[0x48 | 2] = function() { { reg16[reg_dx] = dec16(reg16[reg_dx]); } }; table32[0x48 | 2] = function() { { reg32[reg_edx] = dec32(reg32[reg_edx]); } };; table16[0x48 | 3] = function() { { reg16[reg_bx] = dec16(reg16[reg_bx]); } }; table32[0x48 | 3] = function() { { reg32[reg_ebx] = dec32(reg32[reg_ebx]); } };; table16[0x48 | 4] = function() { { reg16[reg_sp] = dec16(reg16[reg_sp]); } }; table32[0x48 | 4] = function() { { reg32[reg_esp] = dec32(reg32[reg_esp]); } };; table16[0x48 | 5] = function() { { reg16[reg_bp] = dec16(reg16[reg_bp]); } }; table32[0x48 | 5] = function() { { reg32[reg_ebp] = dec32(reg32[reg_ebp]); } };; table16[0x48 | 6] = function() { { reg16[reg_si] = dec16(reg16[reg_si]); } }; table32[0x48 | 6] = function() { { reg32[reg_esi] = dec32(reg32[reg_esi]); } };; table16[0x48 | 7] = function() { { reg16[reg_di] = dec16(reg16[reg_di]); } }; table32[0x48 | 7] = function() { { reg32[reg_edi] = dec32(reg32[reg_edi]); } };;;
table16[0x50 | 0] = function() { { push16(reg16[reg_ax]); } }; table32[0x50 | 0] = function() { { push32(reg32s[reg_eax]); } }; table16[0x50 | 1] = function() { { push16(reg16[reg_cx]); } }; table32[0x50 | 1] = function() { { push32(reg32s[reg_ecx]); } }; table16[0x50 | 2] = function() { { push16(reg16[reg_dx]); } }; table32[0x50 | 2] = function() { { push32(reg32s[reg_edx]); } }; table16[0x50 | 3] = function() { { push16(reg16[reg_bx]); } }; table32[0x50 | 3] = function() { { push32(reg32s[reg_ebx]); } }; table16[0x50 | 4] = function() { { push16(reg16[reg_sp]); } }; table32[0x50 | 4] = function() { { push32(reg32s[reg_esp]); } }; table16[0x50 | 5] = function() { { push16(reg16[reg_bp]); } }; table32[0x50 | 5] = function() { { push32(reg32s[reg_ebp]); } }; table16[0x50 | 6] = function() { { push16(reg16[reg_si]); } }; table32[0x50 | 6] = function() { { push32(reg32s[reg_esi]); } }; table16[0x50 | 7] = function() { { push16(reg16[reg_di]); } }; table32[0x50 | 7] = function() { { push32(reg32s[reg_edi]); } };;
table16[0x58 | 0] = function() { { reg16[reg_ax] = pop16();; } }; table32[0x58 | 0] = function() { { reg32[reg_eax] = pop32s();; } }; table16[0x58 | 1] = function() { { reg16[reg_cx] = pop16();; } }; table32[0x58 | 1] = function() { { reg32[reg_ecx] = pop32s();; } }; table16[0x58 | 2] = function() { { reg16[reg_dx] = pop16();; } }; table32[0x58 | 2] = function() { { reg32[reg_edx] = pop32s();; } }; table16[0x58 | 3] = function() { { reg16[reg_bx] = pop16();; } }; table32[0x58 | 3] = function() { { reg32[reg_ebx] = pop32s();; } }; table16[0x58 | 4] = function() { { reg16[reg_sp] = pop16();; } }; table32[0x58 | 4] = function() { { reg32[reg_esp] = pop32s();; } }; table16[0x58 | 5] = function() { { reg16[reg_bp] = pop16();; } }; table32[0x58 | 5] = function() { { reg32[reg_ebp] = pop32s();; } }; table16[0x58 | 6] = function() { { reg16[reg_si] = pop16();; } }; table32[0x58 | 6] = function() { { reg32[reg_esi] = pop32s();; } }; table16[0x58 | 7] = function() { { reg16[reg_di] = pop16();; } }; table32[0x58 | 7] = function() { { reg32[reg_edi] = pop32s();; } };;
table16[0x60] = function() { { pusha16(); } }; table32[0x60] = function() { { pusha32(); } };;
table16[0x61] = function() { { popa16(); } }; table32[0x61] = function() { { popa32(); } };;
table16[0x62] = table32[0x62] = function() { { throw unimpl("bound instruction"); } };;
table16[0x63] = table32[0x63] = function() { var modrm_byte = read_imm8(); { /* arpl*/ var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, arpl(data, modrm_byte >> 2 & 14)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, arpl(data, modrm_byte >> 2 & 14)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = arpl(data, modrm_byte >> 2 & 14); }; } };;
table16[0x64] = table32[0x64] = function() { { seg_prefix(reg_fs); } };;
table16[0x65] = table32[0x65] = function() { { seg_prefix(reg_gs); } };;
table16[0x66] = table32[0x66] = function() { { /* Operand-size override prefix*/ dbg_assert(operand_size_32 === is_32); operand_size_32 = !is_32; update_operand_size(); table[read_imm8()](); operand_size_32 = is_32; update_operand_size(); } };;
table16[0x67] = table32[0x67] = function() { { /* Address-size override prefix*/ dbg_assert(address_size_32 === is_32); address_size_32 = !is_32; update_address_size(); table[read_imm8()](); address_size_32 = is_32; update_address_size(); } };;
table16[0x68] = function() { { push16(read_imm16()); } }; table32[0x68] = function() { { push32(read_imm32s()); } };;
table16[0x69] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = (safe_read16(modrm_resolve(modrm_byte)) << 16 >> 16); } else { data = reg16s[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = imul_reg16((read_imm16() << 16 >> 16), data); } }; table32[0x69] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32[modrm_byte >> 3 & 7] = imul_reg32(read_imm32s(), data); } };;
table16[0x6A] = function() { { push16(read_imm8s()); } }; table32[0x6A] = function() { { push32(read_imm8s()); } };;
table16[0x6B] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = (safe_read16(modrm_resolve(modrm_byte)) << 16 >> 16); } else { data = reg16s[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = imul_reg16(read_imm8s(), data); } }; table32[0x6B] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32[modrm_byte >> 3 & 7] = imul_reg32(read_imm8s(), data); } };;
table16[0x6C] = table32[0x6C] = function() { { insb(); } };;
table16[0x6D] = function() { { insw(); } }; table32[0x6D] = function() { { insd(); } };;
table16[0x6E] = table32[0x6E] = function() { { outsb(); } };;
table16[0x6F] = function() { { outsw(); } }; table32[0x6F] = function() { { outsd(); } };;
table16[0x70 | 0x0] = table32[0x70 | 0x0] = function() { { if((test_o())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0x1] = table32[0x70 | 0x1] = function() { { if((!test_o())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0x2] = table32[0x70 | 0x2] = function() { { if((test_b())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0x3] = table32[0x70 | 0x3] = function() { { if((!test_b())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0x4] = table32[0x70 | 0x4] = function() { { if((test_z())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0x5] = table32[0x70 | 0x5] = function() { { if((!test_z())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0x6] = table32[0x70 | 0x6] = function() { { if((test_be())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0x7] = table32[0x70 | 0x7] = function() { { if((!test_be())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0x8] = table32[0x70 | 0x8] = function() { { if((test_s())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0x9] = table32[0x70 | 0x9] = function() { { if((!test_s())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0xA] = table32[0x70 | 0xA] = function() { { if((test_p())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0xB] = table32[0x70 | 0xB] = function() { { if((!test_p())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0xC] = table32[0x70 | 0xC] = function() { { if((test_l())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0xD] = table32[0x70 | 0xD] = function() { { if((!test_l())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0xE] = table32[0x70 | 0xE] = function() { { if((test_le())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;; table16[0x70 | 0xF] = table32[0x70 | 0xF] = function() { { if((!test_le())) { instruction_pointer = instruction_pointer + read_imm8s() | 0; } instruction_pointer++; } };;;;
table16[0x80] = table32[0x80] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, add8(data, read_imm8())); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = add8(data, read_imm8()); }; }; break; case 1: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, or8(data, read_imm8())); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = or8(data, read_imm8()); }; }; break; case 2: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, adc8(data, read_imm8())); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = adc8(data, read_imm8()); }; }; break; case 3: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, sbb8(data, read_imm8())); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = sbb8(data, read_imm8()); }; }; break; case 4: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, and8(data, read_imm8())); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = and8(data, read_imm8()); }; }; break; case 5: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, sub8(data, read_imm8())); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = sub8(data, read_imm8()); }; }; break; case 6: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, xor8(data, read_imm8())); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = xor8(data, read_imm8()); }; }; break; case 7: { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; cmp8(data, read_imm8()); }; break; } } };;
table16[0x81] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, add16(data, read_imm16())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, add16(data, read_imm16())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = add16(data, read_imm16()); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, or16(data, read_imm16())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, or16(data, read_imm16())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = or16(data, read_imm16()); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, adc16(data, read_imm16())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, adc16(data, read_imm16())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = adc16(data, read_imm16()); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, sbb16(data, read_imm16())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, sbb16(data, read_imm16())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = sbb16(data, read_imm16()); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, and16(data, read_imm16())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, and16(data, read_imm16())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = and16(data, read_imm16()); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, sub16(data, read_imm16())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, sub16(data, read_imm16())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = sub16(data, read_imm16()); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, xor16(data, read_imm16())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, xor16(data, read_imm16())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = xor16(data, read_imm16()); }; }; break; case 7: { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; cmp16(data, read_imm16()); }; break; } } }; table32[0x81] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, add32(data, (read_imm32s() >>> 0))); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, add32(data, (read_imm32s() >>> 0))); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = add32(data, (read_imm32s() >>> 0)); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high); virt_boundary_write32(phys_addr, phys_addr_high, or32(data, read_imm32s())); } else { data = memory.read32s(phys_addr); memory.write32(phys_addr, or32(data, read_imm32s())); } } else { data = reg32s[modrm_byte & 7]; reg32s[modrm_byte & 7] = or32(data, read_imm32s()); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, adc32(data, (read_imm32s() >>> 0))); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, adc32(data, (read_imm32s() >>> 0))); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = adc32(data, (read_imm32s() >>> 0)); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, sbb32(data, (read_imm32s() >>> 0))); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, sbb32(data, (read_imm32s() >>> 0))); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = sbb32(data, (read_imm32s() >>> 0)); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high); virt_boundary_write32(phys_addr, phys_addr_high, and32(data, read_imm32s())); } else { data = memory.read32s(phys_addr); memory.write32(phys_addr, and32(data, read_imm32s())); } } else { data = reg32s[modrm_byte & 7]; reg32s[modrm_byte & 7] = and32(data, read_imm32s()); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, sub32(data, (read_imm32s() >>> 0))); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, sub32(data, (read_imm32s() >>> 0))); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = sub32(data, (read_imm32s() >>> 0)); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high); virt_boundary_write32(phys_addr, phys_addr_high, xor32(data, read_imm32s())); } else { data = memory.read32s(phys_addr); memory.write32(phys_addr, xor32(data, read_imm32s())); } } else { data = reg32s[modrm_byte & 7]; reg32s[modrm_byte & 7] = xor32(data, read_imm32s()); }; }; break; case 7: { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; cmp32(data, (read_imm32s() >>> 0)); }; break; } } };;
table16[0x82] = table32[0x82] = function() { { table[0x80](); /* alias*/ } };;
table16[0x83] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, add16(data, read_imm8s() & 0xFFFF)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, add16(data, read_imm8s() & 0xFFFF)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = add16(data, read_imm8s() & 0xFFFF); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, or16(data, read_imm8s())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, or16(data, read_imm8s())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = or16(data, read_imm8s()); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, adc16(data, read_imm8s() & 0xFFFF)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, adc16(data, read_imm8s() & 0xFFFF)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = adc16(data, read_imm8s() & 0xFFFF); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, sbb16(data, read_imm8s() & 0xFFFF)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, sbb16(data, read_imm8s() & 0xFFFF)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = sbb16(data, read_imm8s() & 0xFFFF); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, and16(data, read_imm8s())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, and16(data, read_imm8s())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = and16(data, read_imm8s()); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, sub16(data, read_imm8s() & 0xFFFF)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, sub16(data, read_imm8s() & 0xFFFF)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = sub16(data, read_imm8s() & 0xFFFF); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, xor16(data, read_imm8s())); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, xor16(data, read_imm8s())); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = xor16(data, read_imm8s()); }; }; break; case 7: { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; cmp16(data, read_imm8s() & 0xFFFF); }; break; } } }; table32[0x83] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, add32(data, read_imm8s() >>> 0)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, add32(data, read_imm8s() >>> 0)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = add32(data, read_imm8s() >>> 0); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high); virt_boundary_write32(phys_addr, phys_addr_high, or32(data, read_imm8s())); } else { data = memory.read32s(phys_addr); memory.write32(phys_addr, or32(data, read_imm8s())); } } else { data = reg32s[modrm_byte & 7]; reg32s[modrm_byte & 7] = or32(data, read_imm8s()); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, adc32(data, read_imm8s() >>> 0)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, adc32(data, read_imm8s() >>> 0)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = adc32(data, read_imm8s() >>> 0); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, sbb32(data, read_imm8s() >>> 0)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, sbb32(data, read_imm8s() >>> 0)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = sbb32(data, read_imm8s() >>> 0); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high); virt_boundary_write32(phys_addr, phys_addr_high, and32(data, read_imm8s())); } else { data = memory.read32s(phys_addr); memory.write32(phys_addr, and32(data, read_imm8s())); } } else { data = reg32s[modrm_byte & 7]; reg32s[modrm_byte & 7] = and32(data, read_imm8s()); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, sub32(data, read_imm8s() >>> 0)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, sub32(data, read_imm8s() >>> 0)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = sub32(data, read_imm8s() >>> 0); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high); virt_boundary_write32(phys_addr, phys_addr_high, xor32(data, read_imm8s())); } else { data = memory.read32s(phys_addr); memory.write32(phys_addr, xor32(data, read_imm8s())); } } else { data = reg32s[modrm_byte & 7]; reg32s[modrm_byte & 7] = xor32(data, read_imm8s()); }; }; break; case 7: { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; cmp32(data, read_imm8s() >>> 0); }; break; } } };;
table16[0x84] = table32[0x84] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; test8(data, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } };
table16[0x85] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; test16(data, reg16[modrm_byte >> 2 & 14]); } }; table32[0x85] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; test32(data, reg32s[modrm_byte >> 3 & 7]); } };
table16[0x86] = table32[0x86] = function() { var modrm_byte = read_imm8(); { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, xchg8(data, modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = xchg8(data, modrm_byte); }; } };;
table16[0x87] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, xchg16(data, modrm_byte)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, xchg16(data, modrm_byte)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = xchg16(data, modrm_byte); }; } }; table32[0x87] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, xchg32(data, modrm_byte)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, xchg32(data, modrm_byte)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = xchg32(data, modrm_byte); }; } };;
table16[0x88] = table32[0x88] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]; }; } };
table16[0x89] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write16(modrm_resolve(modrm_byte), reg16[modrm_byte >> 2 & 14]); } else { reg16[modrm_byte << 1 & 14] = reg16[modrm_byte >> 2 & 14]; }; } }; table32[0x89] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write32(modrm_resolve(modrm_byte), reg32s[modrm_byte >> 3 & 7]); } else { reg32[modrm_byte & 7] = reg32s[modrm_byte >> 3 & 7]; }; } };
table16[0x8A] = table32[0x8A] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1] = data; } };;
table16[0x8B] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } }; table32[0x8B] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } };;
table16[0x8C] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write16(modrm_resolve(modrm_byte), sreg[modrm_byte >> 3 & 7]); } else { reg16[modrm_byte << 1 & 14] = sreg[modrm_byte >> 3 & 7]; }; } }; table32[0x8C] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write32(modrm_resolve(modrm_byte), sreg[modrm_byte >> 3 & 7]); } else { reg32[modrm_byte & 7] = sreg[modrm_byte >> 3 & 7]; }; } };
table16[0x8D] = function() { { lea16(); } }; table32[0x8D] = function() { { lea32(); } };;
table16[0x8E] = table32[0x8E] = function() { var modrm_byte = read_imm8(); { var mod = modrm_byte >> 3 & 7; if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; switch_seg(mod, data); if(mod === reg_ss) { /* TODO*/ /* run next instruction, so no irqs are handled*/ } } };;
table16[0x8F] = table32[0x8F] = function() { var modrm_byte = read_imm8(); { /* pop*/ if(operand_size_32) { /* change esp first, then resolve modrm address*/ var sp = get_esp_read(0); /* TODO unsafe*/ stack_reg[reg_vsp] += 4; if(modrm_byte < 0xC0) { safe_write32(modrm_resolve(modrm_byte), memory.read32s(sp)); } else { reg32[modrm_byte & 7] = memory.read32s(sp); }; } else { var sp = get_esp_read(0); stack_reg[reg_vsp] += 2; if(modrm_byte < 0xC0) { safe_write16(modrm_resolve(modrm_byte), memory.read16(sp)); } else { reg16[modrm_byte << 1 & 14] = memory.read16(sp); }; } } };;
table16[0x90 | 0] = function() { { xchg16r(reg_ax) } }; table32[0x90 | 0] = function() { { xchg32r(reg_eax) } }; table16[0x90 | 1] = function() { { xchg16r(reg_cx) } }; table32[0x90 | 1] = function() { { xchg32r(reg_ecx) } }; table16[0x90 | 2] = function() { { xchg16r(reg_dx) } }; table32[0x90 | 2] = function() { { xchg32r(reg_edx) } }; table16[0x90 | 3] = function() { { xchg16r(reg_bx) } }; table32[0x90 | 3] = function() { { xchg32r(reg_ebx) } }; table16[0x90 | 4] = function() { { xchg16r(reg_sp) } }; table32[0x90 | 4] = function() { { xchg32r(reg_esp) } }; table16[0x90 | 5] = function() { { xchg16r(reg_bp) } }; table32[0x90 | 5] = function() { { xchg32r(reg_ebp) } }; table16[0x90 | 6] = function() { { xchg16r(reg_si) } }; table32[0x90 | 6] = function() { { xchg32r(reg_esi) } }; table16[0x90 | 7] = function() { { xchg16r(reg_di) } }; table32[0x90 | 7] = function() { { xchg32r(reg_edi) } };
table16[0x90] = table32[0x90] = function() { /* nop */ };;
table16[0x98] = function() { { /* cbw */ reg16[reg_ax] = reg8s[reg_al]; } }; table32[0x98] = function() { { /* cwde */ reg32[reg_eax] = reg16s[reg_ax]; } };;
table16[0x99] = function() { { /* cwd */ reg16[reg_dx] = reg16s[reg_ax] >> 15; } }; table32[0x99] = function() { { /* cdq */ reg32[reg_edx] = reg32s[reg_eax] >> 31; } };;
table16[0x9A] = function() { { /* callf*/ if(protected_mode) { throw unimpl("16 bit callf in protected mode"); } else { var new_ip = read_imm16(); var new_cs = read_imm16(); push16(sreg[reg_cs]); push16(get_real_ip()); switch_seg(reg_cs, new_cs); instruction_pointer = get_seg(reg_cs) + new_ip | 0; } } }; table32[0x9A] = function() { { if(protected_mode) { throw unimpl("callf"); } else { var new_ip = read_imm32s(); var new_cs = read_imm16(); push32(sreg[reg_cs]); push32(get_real_ip()); switch_seg(reg_cs, new_cs); instruction_pointer = get_seg(reg_cs) + new_ip | 0; } } };;
table16[0x9B] = table32[0x9B] = function() { { /* fwait: check for pending fpu exceptions*/ fpu.fwait(); } };;
table16[0x9C] = function() { { /* pushf*/ load_flags(); push16(flags); } }; table32[0x9C] = function() { { /* pushf*/ load_flags(); push32(flags); } };;
table16[0x9D] = function() { { /* popf*/ var tmp; tmp = pop16();; update_flags(tmp); handle_irqs(); } }; table32[0x9D] = function() { { /* popf*/ update_flags(pop32s()); handle_irqs(); } };;
table16[0x9E] = table32[0x9E] = function() { { /* sahf*/ flags = (flags & ~0xFF) | reg8[reg_ah]; flags = (flags & flags_mask) | flags_default; flags_changed = 0; } };;
table16[0x9F] = table32[0x9F] = function() { { /* lahf*/ load_flags(); reg8[reg_ah] = flags; } };;
table16[0xA0] = table32[0xA0] = function() { { /* mov*/ var data = safe_read8(read_moffs()); reg8[reg_al] = data; } };;
table16[0xA1] = function() { { /* mov*/ var data = safe_read16(read_moffs()); reg16[reg_ax] = data; } }; table32[0xA1] = function() { { var data = safe_read32s(read_moffs()); reg32[reg_eax] = data; } };;
table16[0xA2] = table32[0xA2] = function() { { /* mov*/ safe_write8(read_moffs(), reg8[reg_al]); } };;
table16[0xA3] = function() { { /* mov*/ safe_write16(read_moffs(), reg16[reg_ax]); } }; table32[0xA3] = function() { { safe_write32(read_moffs(), reg32s[reg_eax]); } };;
table16[0xA4] = table32[0xA4] = function() { { movsb(); } };;
table16[0xA5] = function() { { movsw(); } }; table32[0xA5] = function() { { movsd(); } };;
table16[0xA6] = table32[0xA6] = function() { { cmpsb(); } };;
table16[0xA7] = function() { { cmpsw(); } }; table32[0xA7] = function() { { cmpsd(); } };;
table16[0xA8] = table32[0xA8] = function() { { test8(reg8[reg_al], read_imm8()); } };;
table16[0xA9] = function() { { test16(reg16[reg_ax], read_imm16()); } }; table32[0xA9] = function() { { test32(reg32s[reg_eax], read_imm32s()); } };;
table16[0xAA] = table32[0xAA] = function() { { stosb(); } };;
table16[0xAB] = function() { { stosw(); } }; table32[0xAB] = function() { { stosd(); } };;
table16[0xAC] = table32[0xAC] = function() { { lodsb(); } };;
table16[0xAD] = function() { { lodsw(); } }; table32[0xAD] = function() { { lodsd(); } };;
table16[0xAE] = table32[0xAE] = function() { { scasb(); } };;
table16[0xAF] = function() { { scasw(); } }; table32[0xAF] = function() { { scasd(); } };;
table16[0xB0 | 0] = table32[0xB0 | 0] = function() { { reg8[reg_al] = read_imm8(); } };; table16[0xB0 | 1] = table32[0xB0 | 1] = function() { { reg8[reg_cl] = read_imm8(); } };; table16[0xB0 | 2] = table32[0xB0 | 2] = function() { { reg8[reg_dl] = read_imm8(); } };; table16[0xB0 | 3] = table32[0xB0 | 3] = function() { { reg8[reg_bl] = read_imm8(); } };; table16[0xB0 | 4] = table32[0xB0 | 4] = function() { { reg8[reg_ah] = read_imm8(); } };; table16[0xB0 | 5] = table32[0xB0 | 5] = function() { { reg8[reg_ch] = read_imm8(); } };; table16[0xB0 | 6] = table32[0xB0 | 6] = function() { { reg8[reg_dh] = read_imm8(); } };; table16[0xB0 | 7] = table32[0xB0 | 7] = function() { { reg8[reg_bh] = read_imm8(); } };;;
table16[0xB8 | 0] = function() { { reg16[reg_ax] = read_imm16(); } }; table32[0xB8 | 0] = function() { { reg32s[reg_eax] = read_imm32s(); } };; table16[0xB8 | 1] = function() { { reg16[reg_cx] = read_imm16(); } }; table32[0xB8 | 1] = function() { { reg32s[reg_ecx] = read_imm32s(); } };; table16[0xB8 | 2] = function() { { reg16[reg_dx] = read_imm16(); } }; table32[0xB8 | 2] = function() { { reg32s[reg_edx] = read_imm32s(); } };; table16[0xB8 | 3] = function() { { reg16[reg_bx] = read_imm16(); } }; table32[0xB8 | 3] = function() { { reg32s[reg_ebx] = read_imm32s(); } };; table16[0xB8 | 4] = function() { { reg16[reg_sp] = read_imm16(); } }; table32[0xB8 | 4] = function() { { reg32s[reg_esp] = read_imm32s(); } };; table16[0xB8 | 5] = function() { { reg16[reg_bp] = read_imm16(); } }; table32[0xB8 | 5] = function() { { reg32s[reg_ebp] = read_imm32s(); } };; table16[0xB8 | 6] = function() { { reg16[reg_si] = read_imm16(); } }; table32[0xB8 | 6] = function() { { reg32s[reg_esi] = read_imm32s(); } };; table16[0xB8 | 7] = function() { { reg16[reg_di] = read_imm16(); } }; table32[0xB8 | 7] = function() { { reg32s[reg_edi] = read_imm32s(); } };;;
table16[0xC0] = table32[0xC0] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, rol8(data, read_imm8() & 31)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = rol8(data, read_imm8() & 31); }; }; break; case 1: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, ror8(data, read_imm8() & 31)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = ror8(data, read_imm8() & 31); }; }; break; case 2: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, rcl8(data, read_imm8() & 31)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = rcl8(data, read_imm8() & 31); }; }; break; case 3: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, rcr8(data, read_imm8() & 31)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = rcr8(data, read_imm8() & 31); }; }; break; case 4: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, shl8(data, read_imm8() & 31)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = shl8(data, read_imm8() & 31); }; }; break; case 5: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, shr8(data, read_imm8() & 31)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = shr8(data, read_imm8() & 31); }; }; break; case 6: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, shl8(data, read_imm8() & 31)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = shl8(data, read_imm8() & 31); }; }; break; case 7: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, sar8(data, read_imm8() & 31)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = sar8(data, read_imm8() & 31); }; }; break; } } };;
table16[0xC1] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, rol16(data, read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, rol16(data, read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = rol16(data, read_imm8() & 31); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, ror16(data, read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, ror16(data, read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = ror16(data, read_imm8() & 31); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, rcl16(data, read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, rcl16(data, read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = rcl16(data, read_imm8() & 31); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, rcr16(data, read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, rcr16(data, read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = rcr16(data, read_imm8() & 31); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shl16(data, read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shl16(data, read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shl16(data, read_imm8() & 31); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shr16(data, read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shr16(data, read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shr16(data, read_imm8() & 31); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shl16(data, read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shl16(data, read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shl16(data, read_imm8() & 31); }; }; break; case 7: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, sar16(data, read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, sar16(data, read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = sar16(data, read_imm8() & 31); }; }; break; } } }; table32[0xC1] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, rol32(data, read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, rol32(data, read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = rol32(data, read_imm8() & 31); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, ror32(data, read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, ror32(data, read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = ror32(data, read_imm8() & 31); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, rcl32(data, read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, rcl32(data, read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = rcl32(data, read_imm8() & 31); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, rcr32(data, read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, rcr32(data, read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = rcr32(data, read_imm8() & 31); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shl32(data, read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shl32(data, read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shl32(data, read_imm8() & 31); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shr32(data, read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shr32(data, read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shr32(data, read_imm8() & 31); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shl32(data, read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shl32(data, read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shl32(data, read_imm8() & 31); }; }; break; case 7: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, sar32(data, read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, sar32(data, read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = sar32(data, read_imm8() & 31); }; }; break; } } };;
table16[0xC2] = function() { { /* retn*/ var imm16 = read_imm16(); instruction_pointer = get_seg(reg_cs) + pop16() | 0; /* TODO regv*/ reg32[reg_esp] += imm16; } }; table32[0xC2] = function() { { /* retn*/ var imm16 = read_imm16(); instruction_pointer = get_seg(reg_cs) + pop32s() | 0; reg32[reg_esp] += imm16; } };;
table16[0xC3] = function() { { /* retn*/ instruction_pointer = get_seg(reg_cs) + pop16() | 0;; } }; table32[0xC3] = function() { { /* retn*/ instruction_pointer = get_seg(reg_cs) + pop32s() | 0;; } };;
table16[0xC4] = table32[0xC4] = function() { var modrm_byte = read_imm8(); { if(modrm_byte >= 0xC0) { raise_exception(6); return; } if(operand_size_32) { lss32(reg_es, modrm_resolve(modrm_byte), modrm_byte >> 3 & 7); } else { lss16(reg_es, modrm_resolve(modrm_byte), modrm_byte >> 2 & 14); }; } };;
table16[0xC5] = table32[0xC5] = function() { var modrm_byte = read_imm8(); { if(modrm_byte >= 0xC0) { raise_exception(6); return; } if(operand_size_32) { lss32(reg_ds, modrm_resolve(modrm_byte), modrm_byte >> 3 & 7); } else { lss16(reg_ds, modrm_resolve(modrm_byte), modrm_byte >> 2 & 14); }; } };;
table16[0xC6] = table32[0xC6] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), read_imm8()); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = read_imm8(); }; } };
table16[0xC7] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write16(modrm_resolve(modrm_byte), read_imm16()); } else { reg16[modrm_byte << 1 & 14] = read_imm16(); }; } }; table32[0xC7] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write32(modrm_resolve(modrm_byte), read_imm32s()); } else { reg32[modrm_byte & 7] = read_imm32s(); }; } };
table16[0xC8] = function() { { enter16(); } }; table32[0xC8] = function() { { enter32(); } };;
table16[0xC9] = function() { { /* leave*/ stack_reg[reg_vsp] = stack_reg[reg_vbp]; reg16[reg_bp] = pop16(); } }; table32[0xC9] = function() { { stack_reg[reg_vsp] = stack_reg[reg_vbp]; reg32[reg_ebp] = pop32s(); } };;
table16[0xCA] = function() { { /* retf*/ if(protected_mode) { throw unimpl("16 bit retf in protected mode"); } var imm16 = read_imm16(); var ip = pop16(); switch_seg(reg_cs, pop16()); instruction_pointer = get_seg(reg_cs) + ip | 0; reg16[reg_sp] += imm16; } }; table32[0xCA] = function() { { /* retf */ var imm16 = read_imm16(); if(protected_mode) { /*dbg_log("retf");*/ var ip = pop32s(); switch_seg(reg_cs, pop32s() & 0xFFFF); instruction_pointer = get_seg(reg_cs) + ip | 0; stack_reg[reg_vsp] += imm16; } else { throw unimpl("32 bit retf in real mode"); } } };;
table16[0xCB] = function() { { /* retf*/ if(protected_mode) { throw unimpl("16 bit retf in protected mode"); } else { var ip = pop16(); switch_seg(reg_cs, pop16()); instruction_pointer = get_seg(reg_cs) + ip | 0; } } }; table32[0xCB] = function() { { /* retf */ if(protected_mode) { var ip = pop32s(); switch_seg(reg_cs, pop32s() & 0xFFFF); instruction_pointer = get_seg(reg_cs) + ip | 0; } else { var ip = pop32s(); switch_seg(reg_cs, pop32s() & 0xFFFF); instruction_pointer = get_seg(reg_cs) + ip | 0; } } };;
table16[0xCC] = table32[0xCC] = function() { { /* INT3*/ call_interrupt_vector(3, true, false); } };;
table16[0xCD] = table32[0xCD] = function() { { /* INT */ var imm8 = read_imm8(); call_interrupt_vector(imm8, true, false); } };;
table16[0xCE] = table32[0xCE] = function() { { /* INTO*/ if(getof()) { call_interrupt_vector(4, true, false); } } };;
table16[0xCF] = function() { { /* iret*/ if(protected_mode) { throw unimpl("16 bit iret in protected mode"); } var ip = pop16(); switch_seg(reg_cs, pop16()); var new_flags = pop16(); instruction_pointer = ip + get_seg(reg_cs) | 0; flags = new_flags; flags_changed = 0; handle_irqs(); } }; table32[0xCF] = function() { { /* iret*/ if(!protected_mode) { throw unimpl("32 bit iret in real mode"); } else { if(flags & flag_nt) { if(DEBUG) throw "unimplemented nt"; } if(flags & flag_vm) { if(DEBUG) throw "unimplemented vm"; } } /*dbg_log("pop eip from " + h(reg32[reg_esp], 8));*/ instruction_pointer = pop32s(); /*dbg_log("IRET | from " + h(previous_ip) + " to " + h(instruction_pointer));*/ sreg[reg_cs] = pop32s(); /*instruction_pointer += get_seg(reg_cs);*/ var new_flags = pop32s(); if(new_flags & flag_vm) { if(DEBUG) throw "unimplemented"; } /* protected mode return*/ var info = lookup_segment_selector(sreg[reg_cs]); if(info.is_null) { throw unimpl("is null"); } if(!info.is_present) { throw unimpl("not present"); } if(!info.is_executable) { throw unimpl("not exec"); } if(info.rpl < cpl) { throw unimpl("rpl < cpl"); } if(info.dc_bit && info.dpl > info.rpl) { throw unimpl("conforming and dpl > rpl"); } if(info.rpl > cpl) { /* outer privilege return*/ var temp_esp = pop32s(); var temp_ss = pop32s(); reg32[reg_esp] = temp_esp; update_flags(new_flags); cpl = info.rpl; switch_seg(reg_ss, temp_ss & 0xFFFF); /*dbg_log("iret cpl=" + cpl + " to " + h(instruction_pointer) + */ /*        " cs:eip=" + h(sreg[reg_cs],4) + ":" + h(get_real_ip(), 8) +*/ /*        " ss:esp=" + h(temp_ss & 0xFFFF, 2) + ":" + h(temp_esp, 8), LOG_CPU);*/ cpl_changed(); } else { update_flags(new_flags); /* same privilege return*/ /*dbg_log(h(new_flags) + " " + h(flags));*/ /*dbg_log("iret to " + h(instruction_pointer));*/ } /*dbg_log("iret if=" + (flags & flag_interrupt) + " cpl=" + cpl);*/ dbg_assert(!page_fault); handle_irqs(); } };;
table16[0xD0] = table32[0xD0] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, rol8(data, 1)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = rol8(data, 1); }; }; break; case 1: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, ror8(data, 1)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = ror8(data, 1); }; }; break; case 2: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, rcl8(data, 1)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = rcl8(data, 1); }; }; break; case 3: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, rcr8(data, 1)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = rcr8(data, 1); }; }; break; case 4: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, shl8(data, 1)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = shl8(data, 1); }; }; break; case 5: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, shr8(data, 1)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = shr8(data, 1); }; }; break; case 6: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, shl8(data, 1)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = shl8(data, 1); }; }; break; case 7: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, sar8(data, 1)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = sar8(data, 1); }; }; break; } } };;
table16[0xD1] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, rol16(data, 1)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, rol16(data, 1)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = rol16(data, 1); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, ror16(data, 1)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, ror16(data, 1)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = ror16(data, 1); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, rcl16(data, 1)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, rcl16(data, 1)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = rcl16(data, 1); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, rcr16(data, 1)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, rcr16(data, 1)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = rcr16(data, 1); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shl16(data, 1)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shl16(data, 1)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shl16(data, 1); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shr16(data, 1)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shr16(data, 1)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shr16(data, 1); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shl16(data, 1)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shl16(data, 1)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shl16(data, 1); }; }; break; case 7: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, sar16(data, 1)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, sar16(data, 1)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = sar16(data, 1); }; }; break; } } }; table32[0xD1] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, rol32(data, 1)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, rol32(data, 1)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = rol32(data, 1); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, ror32(data, 1)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, ror32(data, 1)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = ror32(data, 1); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, rcl32(data, 1)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, rcl32(data, 1)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = rcl32(data, 1); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, rcr32(data, 1)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, rcr32(data, 1)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = rcr32(data, 1); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shl32(data, 1)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shl32(data, 1)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shl32(data, 1); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shr32(data, 1)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shr32(data, 1)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shr32(data, 1); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shl32(data, 1)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shl32(data, 1)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shl32(data, 1); }; }; break; case 7: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, sar32(data, 1)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, sar32(data, 1)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = sar32(data, 1); }; }; break; } } };;
table16[0xD2] = table32[0xD2] = function() { var modrm_byte = read_imm8(); { var shift = reg8[reg_cl] & 31; switch(modrm_byte >> 3 & 7) { case 0: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, rol8(data, shift)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = rol8(data, shift); }; }; break; case 1: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, ror8(data, shift)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = ror8(data, shift); }; }; break; case 2: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, rcl8(data, shift)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = rcl8(data, shift); }; }; break; case 3: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, rcr8(data, shift)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = rcr8(data, shift); }; }; break; case 4: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, shl8(data, shift)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = shl8(data, shift); }; }; break; case 5: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, shr8(data, shift)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = shr8(data, shift); }; }; break; case 6: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, shl8(data, shift)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = shl8(data, shift); }; }; break; case 7: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, sar8(data, shift)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = sar8(data, shift); }; }; break; } } };;
table16[0xD3] = function() { var modrm_byte = read_imm8(); { var shift = reg8[reg_cl] & 31; switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, rol16(data, shift)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, rol16(data, shift)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = rol16(data, shift); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, ror16(data, shift)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, ror16(data, shift)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = ror16(data, shift); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, rcl16(data, shift)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, rcl16(data, shift)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = rcl16(data, shift); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, rcr16(data, shift)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, rcr16(data, shift)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = rcr16(data, shift); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shl16(data, shift)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shl16(data, shift)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shl16(data, shift); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shr16(data, shift)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shr16(data, shift)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shr16(data, shift); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shl16(data, shift)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shl16(data, shift)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shl16(data, shift); }; }; break; case 7: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, sar16(data, shift)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, sar16(data, shift)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = sar16(data, shift); }; }; break; } } }; table32[0xD3] = function() { var modrm_byte = read_imm8(); { var shift = reg8[reg_cl] & 31; switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, rol32(data, shift)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, rol32(data, shift)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = rol32(data, shift); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, ror32(data, shift)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, ror32(data, shift)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = ror32(data, shift); }; }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, rcl32(data, shift)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, rcl32(data, shift)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = rcl32(data, shift); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, rcr32(data, shift)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, rcr32(data, shift)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = rcr32(data, shift); }; }; break; case 4: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shl32(data, shift)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shl32(data, shift)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shl32(data, shift); }; }; break; case 5: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shr32(data, shift)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shr32(data, shift)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shr32(data, shift); }; }; break; case 6: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shl32(data, shift)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shl32(data, shift)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shl32(data, shift); }; }; break; case 7: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, sar32(data, shift)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, sar32(data, shift)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = sar32(data, shift); }; }; break; } } };;
table16[0xD4] = table32[0xD4] = function() { { bcd_aam(); } };;
table16[0xD5] = table32[0xD5] = function() { { bcd_aad(); } };;
table16[0xD6] = table32[0xD6] = function() { { /* salc*/ throw unimpl("salc instruction"); } };;
table16[0xD7] = table32[0xD7] = function() { { /* xlat*/ if(address_size_32) { reg8[reg_al] = safe_read8(get_seg_prefix(reg_ds) + reg32s[reg_ebx] + reg8[reg_al]); } else { reg8[reg_al] = safe_read8(get_seg_prefix(reg_ds) + reg16[reg_bx] + reg8[reg_al]); } } };;
// fpu instructions
table16[0xD8] = table32[0xD8] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) fpu.op_D8_mem(modrm_byte, modrm_resolve(modrm_byte)); else fpu.op_D8_reg(modrm_byte); } };;
table16[0xD9] = table32[0xD9] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) fpu.op_D9_mem(modrm_byte, modrm_resolve(modrm_byte)); else fpu.op_D9_reg(modrm_byte); } };;
table16[0xDA] = table32[0xDA] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) fpu.op_DA_mem(modrm_byte, modrm_resolve(modrm_byte)); else fpu.op_DA_reg(modrm_byte); } };;
table16[0xDB] = table32[0xDB] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) fpu.op_DB_mem(modrm_byte, modrm_resolve(modrm_byte)); else fpu.op_DB_reg(modrm_byte); } };;
table16[0xDC] = table32[0xDC] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) fpu.op_DC_mem(modrm_byte, modrm_resolve(modrm_byte)); else fpu.op_DC_reg(modrm_byte); } };;
table16[0xDD] = table32[0xDD] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) fpu.op_DD_mem(modrm_byte, modrm_resolve(modrm_byte)); else fpu.op_DD_reg(modrm_byte); } };;
table16[0xDE] = table32[0xDE] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) fpu.op_DE_mem(modrm_byte, modrm_resolve(modrm_byte)); else fpu.op_DE_reg(modrm_byte); } };;
table16[0xDF] = table32[0xDF] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) fpu.op_DF_mem(modrm_byte, modrm_resolve(modrm_byte)); else fpu.op_DF_reg(modrm_byte); } };;
table16[0xE0] = table32[0xE0] = function() { { loopne(); } };;
table16[0xE1] = table32[0xE1] = function() { { loope(); } };;
table16[0xE2] = table32[0xE2] = function() { { loop(); } };;
table16[0xE3] = table32[0xE3] = function() { { jcxz(); } };;
table16[0xE4] = table32[0xE4] = function() { { reg8[reg_al] = in8(read_imm8()); } };;
table16[0xE5] = function() { { reg16[reg_ax] = in16(read_imm8()); } }; table32[0xE5] = function() { { reg32[reg_eax] = in32(read_imm8()); } };;
table16[0xE6] = table32[0xE6] = function() { { out8(read_imm8(), reg8[reg_al]); } };;
table16[0xE7] = function() { { out16(read_imm8(), reg16[reg_ax]); } }; table32[0xE7] = function() { { out32(read_imm8(), reg32s[reg_eax]); } };;
table16[0xE8] = function() { { /* call*/ var imm16s = (read_imm16() << 16 >> 16); push16(get_real_ip()); jmp_rel16(imm16s); } }; table32[0xE8] = function() { { /* call*/ var imm32s = read_imm32s(); push32(get_real_ip()); instruction_pointer = instruction_pointer + imm32s | 0; } };;
table16[0xE9] = function() { { /* jmp*/ var imm16s = (read_imm16() << 16 >> 16); jmp_rel16(imm16s); } }; table32[0xE9] = function() { { /* jmp*/ var imm32s = read_imm32s(); instruction_pointer = instruction_pointer + imm32s | 0; } };;
table16[0xEA] = function() { { /* jmpf*/ var ip = read_imm16(); switch_seg(reg_cs, read_imm16()); instruction_pointer = ip + get_seg(reg_cs) | 0; } }; table32[0xEA] = function() { { /* jmpf*/ var ip = read_imm32s(); switch_seg(reg_cs, read_imm16()); instruction_pointer = ip + get_seg(reg_cs) | 0; } };;
table16[0xEB] = table32[0xEB] = function() { { /* jmp near*/ var imm8 = read_imm8s(); instruction_pointer = instruction_pointer + imm8 | 0; } };;
table16[0xEC] = table32[0xEC] = function() { { reg8[reg_al] = in8(reg16[reg_dx]); } };;
table16[0xED] = function() { { reg16[reg_ax] = in16(reg16[reg_dx]); } }; table32[0xED] = function() { { reg32[reg_eax] = in32(reg16[reg_dx]); } };;
table16[0xEE] = table32[0xEE] = function() { { out8(reg16[reg_dx], reg8[reg_al]); } };;
table16[0xEF] = function() { { out16(reg16[reg_dx], reg16[reg_ax]); } }; table32[0xEF] = function() { { out32(reg16[reg_dx], reg32s[reg_eax]); } };;
table16[0xF0] = table32[0xF0] = function() { { /* lock*/ /* TODO*/ /* This triggers UD when used with*/ /* some instructions that don't write to memory*/ } };;
table16[0xF1] = table32[0xF1] = function() { { /* INT1*/ /* https://code.google.com/p/corkami/wiki/x86oddities#IceBP*/ throw unimpl("int1 instruction"); } };;
table16[0xF2] = table32[0xF2] = function() { { /* repnz*/ dbg_assert(!repeat_string_prefix); repeat_string_prefix = true; repeat_string_type = false; table[read_imm8()](); repeat_string_prefix = false; } };;
table16[0xF3] = table32[0xF3] = function() { { /* repz*/ dbg_assert(!repeat_string_prefix); repeat_string_prefix = true; repeat_string_type = true; table[read_imm8()](); repeat_string_prefix = false; } };;
table16[0xF4] = table32[0xF4] = function() { { if(cpl) { trigger_gp(0); } /* hlt*/ if((flags & flag_interrupt) === 0) { log("cpu halted"); stopped = true; if(DEBUG) dump_regs(); throw "HALT"; } else { /* infinite loop until an irq happens*/ /* this is handled in call_interrupt_vector*/ instruction_pointer--; in_hlt = true; } } };;
table16[0xF5] = table32[0xF5] = function() { { /* cmc*/ flags = (flags | 1) ^ getcf(); flags_changed &= ~1; } };;
table16[0xF6] = table32[0xF6] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; test8(data, read_imm8()); }; break; case 1: { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; test8(data, read_imm8()); }; break; case 2: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, not8(data)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = not8(data); }; }; break; case 3: { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, neg8(data)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = neg8(data); }; }; break; case 4: { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; mul8(data); }; break; case 5: { if(modrm_byte < 0xC0) { var data = safe_read8s(modrm_resolve(modrm_byte)); } else { data = reg8s[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; imul8(data); }; break; case 6: { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; div8(data); }; break; case 7: { if(modrm_byte < 0xC0) { var data = safe_read8s(modrm_resolve(modrm_byte)); } else { data = reg8s[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; idiv8(data); }; break; } } };;
table16[0xF7] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; test16(data, read_imm16()); }; break; case 1: { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; test16(data, read_imm16()); }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, not16(data)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, not16(data)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = not16(data); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, neg16(data)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, neg16(data)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = neg16(data); }; }; break; case 4: { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; mul16(data); }; break; case 5: { if(modrm_byte < 0xC0) { var data = (safe_read16(modrm_resolve(modrm_byte)) << 16 >> 16); } else { data = reg16s[modrm_byte << 1 & 14]; }; imul16(data); }; break; case 6: { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; div16(data); }; break; case 7: { if(modrm_byte < 0xC0) { var data = (safe_read16(modrm_resolve(modrm_byte)) << 16 >> 16); } else { data = reg16s[modrm_byte << 1 & 14]; }; idiv16(data); }; break; } } }; table32[0xF7] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; test32(data, read_imm32s()); }; break; case 1: { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; test32(data, read_imm32s()); }; break; case 2: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, not32(data)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, not32(data)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = not32(data); }; }; break; case 3: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, neg32(data)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, neg32(data)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = neg32(data); }; }; break; case 4: { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; mul32(data); }; break; case 5: { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; imul32(data); }; break; case 6: { if(modrm_byte < 0xC0) { var data = (safe_read32s(modrm_resolve(modrm_byte)) >>> 0); } else { data = reg32[modrm_byte & 7]; }; div32(data); }; break; case 7: { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; idiv32(data); }; break; } } };;
table16[0xF8] = table32[0xF8] = function() { { /* clc*/ flags &= ~flag_carry; flags_changed &= ~1; } };;
table16[0xF9] = table32[0xF9] = function() { { /* stc*/ flags |= flag_carry; flags_changed &= ~1; } };;
table16[0xFA] = table32[0xFA] = function() { { /* cli*/ /*dbg_log("interrupts off");*/ if(!privileges_for_io()) { trigger_gp(0); } else { flags &= ~flag_interrupt; } } };;
table16[0xFB] = table32[0xFB] = function() { { /* sti*/ /*dbg_log("interrupts on");*/ if(!privileges_for_io()) { trigger_gp(0); } else { flags |= flag_interrupt; handle_irqs(); } } };;
table16[0xFC] = table32[0xFC] = function() { { /* cld*/ flags &= ~flag_direction; } };;
table16[0xFD] = table32[0xFD] = function() { { /* std*/ flags |= flag_direction; } };;
table16[0xFE] = table32[0xFE] = function() { var modrm_byte = read_imm8(); { var mod = modrm_byte & 56; if(mod === 0) { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, inc8(data)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = inc8(data); }; } else if(mod === 8) { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, dec8(data)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = dec8(data); }; } else { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; } } };;
table16[0xFF] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, inc16(data)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, inc16(data)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = inc16(data); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, dec16(data)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, dec16(data)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = dec16(data); }; }; break; case 2: { /* 2, call near*/ if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; push16(get_real_ip()); instruction_pointer = get_seg(reg_cs) + data | 0; }; break; case 3: { /* 3, callf*/ if(modrm_byte >= 0xC0) { raise_exception(6); dbg_assert(false); } var virt_addr = modrm_resolve(modrm_byte); push16(sreg[reg_cs]); push16(get_real_ip()); switch_seg(reg_cs, safe_read16(virt_addr + 2)); instruction_pointer = get_seg(reg_cs) + safe_read16(virt_addr) | 0; dbg_assert(!page_fault); }; break; case 4: { /* 4, jmp near*/ if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; instruction_pointer = get_seg(reg_cs) + data | 0; }; break; case 5: { /* 5, jmpf*/ if(modrm_byte >= 0xC0) { raise_exception(6); dbg_assert(false); } var virt_addr = modrm_resolve(modrm_byte); switch_seg(reg_cs, safe_read16(virt_addr + 2)); instruction_pointer = get_seg(reg_cs) + safe_read16(virt_addr) | 0; /* TODO safe read*/ }; break; case 6: { /* 6, push*/ if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; push16(data); }; break; case 7: { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; }; break; } } }; table32[0xFF] = function() { var modrm_byte = read_imm8(); { switch(modrm_byte >> 3 & 7) { case 0: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, inc32(data)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, inc32(data)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = inc32(data); }; }; break; case 1: { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, dec32(data)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, dec32(data)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = dec32(data); }; }; break; case 2: { /* 2, call near*/ if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; push32(get_real_ip()); instruction_pointer = get_seg(reg_cs) + data | 0; }; break; case 3: { /* 3, callf*/ if(modrm_byte >= 0xC0) { raise_exception(6); dbg_assert(false); } var virt_addr = modrm_resolve(modrm_byte); var new_cs = safe_read16(virt_addr + 4); var new_ip = safe_read32s(virt_addr); push32(sreg[reg_cs]); push32(get_real_ip()); switch_seg(reg_cs, new_cs); instruction_pointer = get_seg(reg_cs) + new_ip | 0; }; break; case 4: { /* 4, jmp near*/ if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; instruction_pointer = get_seg(reg_cs) + data | 0; }; break; case 5: { /* 5, jmpf*/ if(modrm_byte >= 0xC0) { raise_exception(6); dbg_assert(false); } var virt_addr = modrm_resolve(modrm_byte); var new_cs = safe_read16(virt_addr + 4); var new_ip = safe_read32s(virt_addr); switch_seg(reg_cs, new_cs); instruction_pointer = get_seg(reg_cs) + new_ip | 0; }; break; case 6: { /* push*/ if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; push32(data); }; break; case 7: { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; }; break; } } };;
// 0F ops start here
table0F_16[0x00] = table0F_32[0x00] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; if(!protected_mode) { /* No GP, UD is correct*/ trigger_ud(); } if(cpl) { trigger_gp(0); } switch(modrm_byte >> 3 & 7) { case 2: load_ldt(data); break; case 3: load_tr(data); break; default: dbg_log(modrm_byte >> 3 & 7, LOG_CPU); if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; } } };;
table0F_16[0x01] = table0F_32[0x01] = function() { var modrm_byte = read_imm8(); { if(cpl) { trigger_gp(0); } var mod = modrm_byte >> 3 & 7; if(mod === 4) { /* smsw*/ if(modrm_byte < 0xC0) { safe_write16(modrm_resolve(modrm_byte), cr0); } else { reg16[modrm_byte << 1 & 14] = cr0; }; return; } else if(mod === 6) { /* lmsw*/ if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; cr0 = (cr0 & ~0xF) | (data & 0xF); cr0_changed(); return; } if(modrm_byte >= 0xC0) { /* only memory*/ raise_exception(6); dbg_assert(false); } if((mod === 2 || mod === 3) && protected_mode) { /* override prefix, so modrm_resolve does not return the segment part*/ /* only lgdt and lidt and only in protected mode*/ segment_prefix = reg_noseg; } var addr = modrm_resolve(modrm_byte); segment_prefix = -1; switch(mod) { case 0: /* sgdt*/ safe_write16(addr, gdtr_size); safe_write32(addr + 2, gdtr_offset); break; case 1: /* sidt*/ safe_write16(addr, idtr_size); safe_write32(addr + 2, idtr_offset); break; case 2: /* lgdt*/ var size = safe_read16(addr); var offset = safe_read32s(addr + 2); gdtr_size = size; gdtr_offset = offset; if(!operand_size_32) { gdtr_offset &= 0xFFFFFF; } dbg_log("eax " + h(reg32[reg_eax]), LOG_CPU); dbg_log("gdt loaded from " + h(addr), LOG_CPU); dbg_log("gdt at " + h(gdtr_offset) + ", " + gdtr_size + " bytes", LOG_CPU); /*dump_gdt_ldt();*/ break; case 3: /* lidt*/ var size = safe_read16(addr); var offset = safe_read32s(addr + 2); idtr_size = size; idtr_offset = offset; if(!operand_size_32) { idtr_offset &= 0xFFFFFF; } /*dbg_log("[" + h(instruction_pointer) + "] idt at " + */ /*        h(idtr_offset) + ", " + idtr_size + " bytes " + h(addr), LOG_CPU);*/ break; case 7: /* flush translation lookaside buffer*/ invlpg(addr); break; default: dbg_log(mod); if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; } } };;
table0F_16[0x02] = table0F_32[0x02] = function() { var modrm_byte = read_imm8(); { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; /* lar*/ } };;
table0F_16[0x03] = table0F_32[0x03] = function() { var modrm_byte = read_imm8(); { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; /* lsl*/ } };;
table0F_16[0x04] = table0F_32[0x04] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x05] = table0F_32[0x05] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x06] = table0F_32[0x06] = function() { { /* clts*/ if(cpl) { trigger_gp(0); } else { /*dbg_log("clts", LOG_CPU);*/ cr0 &= ~8; /* do something here ?*/ } } };;
table0F_16[0x07] = table0F_32[0x07] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
// invd
table0F_16[0x08] = table0F_32[0x08] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
table0F_16[0x09] = table0F_32[0x09] = function() { { if(cpl) { trigger_gp(0); } /* wbinvd*/ } };;
table0F_16[0x0A] = table0F_32[0x0A] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x0B] = table0F_32[0x0B] = function() { { trigger_ud(); } };;
table0F_16[0x0C] = table0F_32[0x0C] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x0D] = table0F_32[0x0D] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
table0F_16[0x0E] = table0F_32[0x0E] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x0F] = table0F_32[0x0F] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x10] = table0F_32[0x10] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x11] = table0F_32[0x11] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x12] = table0F_32[0x12] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x13] = table0F_32[0x13] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x14] = table0F_32[0x14] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x15] = table0F_32[0x15] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x16] = table0F_32[0x16] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x17] = table0F_32[0x17] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x18] = table0F_32[0x18] = function() { var modrm_byte = read_imm8(); { /* prefetch*/ /* nop for us */ if(operand_size_32) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; } else { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; } } };;
table0F_16[0x19] = table0F_32[0x19] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x1A] = table0F_32[0x1A] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x1B] = table0F_32[0x1B] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x1C] = table0F_32[0x1C] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x1D] = table0F_32[0x1D] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x1E] = table0F_32[0x1E] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x1F] = table0F_32[0x1F] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x20] = table0F_32[0x20] = function() { var modrm_byte = read_imm8(); { if(cpl) { trigger_gp(0); } /*dbg_log("cr" + mod + " read", LOG_CPU);*/ /* mov addr, cr*/ /* mod = which control register*/ switch(modrm_byte >> 3 & 7) { case 0: reg32[modrm_byte & 7] = cr0; break; case 2: reg32[modrm_byte & 7] = cr2; break; case 3: /*dbg_log("read cr3 (" + h(cr3, 8) + ")", LOG_CPU);*/ reg32[modrm_byte & 7] = cr3; break; case 4: reg32[modrm_byte & 7] = cr4; break; default: dbg_log(modrm_byte >> 3 & 7); if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; } } };;
table0F_16[0x21] = table0F_32[0x21] = function() { var modrm_byte = read_imm8(); { if(cpl) { trigger_gp(0); } /* TODO: mov from debug register*/ dbg_assert(modrm_byte >= 0xC0); } };;
table0F_16[0x22] = table0F_32[0x22] = function() { var modrm_byte = read_imm8(); { if(cpl) { trigger_gp(0); } var data = reg32[modrm_byte & 7]; /*dbg_log("cr" + mod + " written: " + h(reg32[reg]), LOG_CPU);*/ /* mov cr, addr*/ /* mod = which control register*/ switch(modrm_byte >> 3 & 7) { case 0: if((data & 0x80000001) === (0x80000000 | 0)) { /* cannot load PG without PE*/ throw unimpl("#GP handler"); } if((cr0 & 0x80000000) && !(data & 0x80000000)) { full_clear_tlb(); } cr0 = data; cr0_changed(); /*dbg_log("cr1 = " + bits(memory.read32s(addr)), LOG_CPU);*/ break; case 3: cr3 = data; dbg_assert((cr3 & 0xFFF) === 0); clear_tlb(); /*dump_page_directory();*/ /*dbg_log("page directory loaded at " + h(cr3, 8), LOG_CPU);*/ break; case 4: if((cr4 ^ data) & 128) { full_clear_tlb(); } cr4 = data; page_size_extensions = (cr4 & 16) ? PSE_ENABLED : 0; dbg_log("cr4 set to " + h(cr4), LOG_CPU); break; default: dbg_log(modrm_byte >> 3 & 7); if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; } } };;
table0F_16[0x23] = table0F_32[0x23] = function() { var modrm_byte = read_imm8(); { if(cpl) { trigger_gp(0); } /* TODO: mov to debug register*/ dbg_assert(modrm_byte >= 0xC0); } };;
table0F_16[0x24] = table0F_32[0x24] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x25] = table0F_32[0x25] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x26] = table0F_32[0x26] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x27] = table0F_32[0x27] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0x28] = table0F_32[0x28] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x29] = table0F_32[0x29] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x2A] = table0F_32[0x2A] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x2B] = table0F_32[0x2B] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x2C] = table0F_32[0x2C] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x2D] = table0F_32[0x2D] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x2E] = table0F_32[0x2E] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x2F] = table0F_32[0x2F] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
// wrmsr
table0F_16[0x30] = table0F_32[0x30] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
table0F_16[0x31] = table0F_32[0x31] = function() { { /* rdtsc - read timestamp counter*/ /*var cycles = (Date.now() - emulation_start) / 1000 * 3000000;*/ /*reg32[reg_eax] = cycles;*/ /*reg32[reg_edx] = cycles / 0x100000000;*/ reg32[reg_eax] = cpu_timestamp_counter; reg32[reg_edx] = cpu_timestamp_counter / 0x100000000; } };;
// rdmsr
table0F_16[0x32] = table0F_32[0x32] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
// rdpmc
table0F_16[0x33] = table0F_32[0x33] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
// sysenter
table0F_16[0x34] = table0F_32[0x34] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
// sysexit
table0F_16[0x35] = table0F_32[0x35] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
table0F_16[0x36] = table0F_32[0x36] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
// getsec
table0F_16[0x37] = table0F_32[0x37] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
table0F_16[0x38] = table0F_32[0x38] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x39] = table0F_32[0x39] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x3A] = table0F_32[0x3A] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x3B] = table0F_32[0x3B] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x3C] = table0F_32[0x3C] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x3D] = table0F_32[0x3D] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x3E] = table0F_32[0x3E] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x3F] = table0F_32[0x3F] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x40 | 0x0] = function() { var modrm_byte = read_imm8(); { if((test_o())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x0] = function() { var modrm_byte = read_imm8(); { if((test_o())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0x1] = function() { var modrm_byte = read_imm8(); { if((!test_o())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x1] = function() { var modrm_byte = read_imm8(); { if((!test_o())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0x2] = function() { var modrm_byte = read_imm8(); { if((test_b())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x2] = function() { var modrm_byte = read_imm8(); { if((test_b())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0x3] = function() { var modrm_byte = read_imm8(); { if((!test_b())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x3] = function() { var modrm_byte = read_imm8(); { if((!test_b())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0x4] = function() { var modrm_byte = read_imm8(); { if((test_z())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x4] = function() { var modrm_byte = read_imm8(); { if((test_z())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0x5] = function() { var modrm_byte = read_imm8(); { if((!test_z())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x5] = function() { var modrm_byte = read_imm8(); { if((!test_z())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0x6] = function() { var modrm_byte = read_imm8(); { if((test_be())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x6] = function() { var modrm_byte = read_imm8(); { if((test_be())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0x7] = function() { var modrm_byte = read_imm8(); { if((!test_be())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x7] = function() { var modrm_byte = read_imm8(); { if((!test_be())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0x8] = function() { var modrm_byte = read_imm8(); { if((test_s())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x8] = function() { var modrm_byte = read_imm8(); { if((test_s())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0x9] = function() { var modrm_byte = read_imm8(); { if((!test_s())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0x9] = function() { var modrm_byte = read_imm8(); { if((!test_s())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0xA] = function() { var modrm_byte = read_imm8(); { if((test_p())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0xA] = function() { var modrm_byte = read_imm8(); { if((test_p())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0xB] = function() { var modrm_byte = read_imm8(); { if((!test_p())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0xB] = function() { var modrm_byte = read_imm8(); { if((!test_p())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0xC] = function() { var modrm_byte = read_imm8(); { if((test_l())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0xC] = function() { var modrm_byte = read_imm8(); { if((test_l())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0xD] = function() { var modrm_byte = read_imm8(); { if((!test_l())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0xD] = function() { var modrm_byte = read_imm8(); { if((!test_l())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0xE] = function() { var modrm_byte = read_imm8(); { if((test_le())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0xE] = function() { var modrm_byte = read_imm8(); { if((test_le())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;; table0F_16[0x40 | 0xF] = function() { var modrm_byte = read_imm8(); { if((!test_le())) { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } }; table0F_32[0x40 | 0xF] = function() { var modrm_byte = read_imm8(); { if((!test_le())) { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32s[modrm_byte >> 3 & 7] = data; } else if(modrm_byte < 0xC0) modrm_resolve(modrm_byte) } };;;;
table0F_16[0x50] = table0F_32[0x50] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x51] = table0F_32[0x51] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x52] = table0F_32[0x52] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x53] = table0F_32[0x53] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x54] = table0F_32[0x54] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x55] = table0F_32[0x55] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x56] = table0F_32[0x56] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x57] = table0F_32[0x57] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x58] = table0F_32[0x58] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x59] = table0F_32[0x59] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x5A] = table0F_32[0x5A] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x5B] = table0F_32[0x5B] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x5C] = table0F_32[0x5C] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x5D] = table0F_32[0x5D] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x5E] = table0F_32[0x5E] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x5F] = table0F_32[0x5F] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x60] = table0F_32[0x60] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x61] = table0F_32[0x61] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x62] = table0F_32[0x62] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x63] = table0F_32[0x63] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x64] = table0F_32[0x64] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x65] = table0F_32[0x65] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x66] = table0F_32[0x66] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x67] = table0F_32[0x67] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x68] = table0F_32[0x68] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x69] = table0F_32[0x69] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x6A] = table0F_32[0x6A] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x6B] = table0F_32[0x6B] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x6C] = table0F_32[0x6C] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x6D] = table0F_32[0x6D] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x6E] = table0F_32[0x6E] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x6F] = table0F_32[0x6F] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x70] = table0F_32[0x70] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x71] = table0F_32[0x71] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x72] = table0F_32[0x72] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x73] = table0F_32[0x73] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x74] = table0F_32[0x74] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x75] = table0F_32[0x75] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x76] = table0F_32[0x76] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x77] = table0F_32[0x77] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x78] = table0F_32[0x78] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x79] = table0F_32[0x79] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x7A] = table0F_32[0x7A] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x7B] = table0F_32[0x7B] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x7C] = table0F_32[0x7C] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x7D] = table0F_32[0x7D] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x7E] = table0F_32[0x7E] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x7F] = table0F_32[0x7F] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0x80 | 0x0] = function() { { jmpcc16((test_o())); } }; table0F_32[0x80 | 0x0] = function() { { jmpcc32((test_o())); } };; table0F_16[0x80 | 0x1] = function() { { jmpcc16((!test_o())); } }; table0F_32[0x80 | 0x1] = function() { { jmpcc32((!test_o())); } };; table0F_16[0x80 | 0x2] = function() { { jmpcc16((test_b())); } }; table0F_32[0x80 | 0x2] = function() { { jmpcc32((test_b())); } };; table0F_16[0x80 | 0x3] = function() { { jmpcc16((!test_b())); } }; table0F_32[0x80 | 0x3] = function() { { jmpcc32((!test_b())); } };; table0F_16[0x80 | 0x4] = function() { { jmpcc16((test_z())); } }; table0F_32[0x80 | 0x4] = function() { { jmpcc32((test_z())); } };; table0F_16[0x80 | 0x5] = function() { { jmpcc16((!test_z())); } }; table0F_32[0x80 | 0x5] = function() { { jmpcc32((!test_z())); } };; table0F_16[0x80 | 0x6] = function() { { jmpcc16((test_be())); } }; table0F_32[0x80 | 0x6] = function() { { jmpcc32((test_be())); } };; table0F_16[0x80 | 0x7] = function() { { jmpcc16((!test_be())); } }; table0F_32[0x80 | 0x7] = function() { { jmpcc32((!test_be())); } };; table0F_16[0x80 | 0x8] = function() { { jmpcc16((test_s())); } }; table0F_32[0x80 | 0x8] = function() { { jmpcc32((test_s())); } };; table0F_16[0x80 | 0x9] = function() { { jmpcc16((!test_s())); } }; table0F_32[0x80 | 0x9] = function() { { jmpcc32((!test_s())); } };; table0F_16[0x80 | 0xA] = function() { { jmpcc16((test_p())); } }; table0F_32[0x80 | 0xA] = function() { { jmpcc32((test_p())); } };; table0F_16[0x80 | 0xB] = function() { { jmpcc16((!test_p())); } }; table0F_32[0x80 | 0xB] = function() { { jmpcc32((!test_p())); } };; table0F_16[0x80 | 0xC] = function() { { jmpcc16((test_l())); } }; table0F_32[0x80 | 0xC] = function() { { jmpcc32((test_l())); } };; table0F_16[0x80 | 0xD] = function() { { jmpcc16((!test_l())); } }; table0F_32[0x80 | 0xD] = function() { { jmpcc32((!test_l())); } };; table0F_16[0x80 | 0xE] = function() { { jmpcc16((test_le())); } }; table0F_32[0x80 | 0xE] = function() { { jmpcc32((test_le())); } };; table0F_16[0x80 | 0xF] = function() { { jmpcc16((!test_le())); } }; table0F_32[0x80 | 0xF] = function() { { jmpcc32((!test_le())); } };;
table0F_16[0x90 | 0x0] = table0F_32[0x90 | 0x0] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(test_o()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(test_o()) ^ 1; }; } };;; table0F_16[0x90 | 0x1] = table0F_32[0x90 | 0x1] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(!test_o()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(!test_o()) ^ 1; }; } };;; table0F_16[0x90 | 0x2] = table0F_32[0x90 | 0x2] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(test_b()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(test_b()) ^ 1; }; } };;; table0F_16[0x90 | 0x3] = table0F_32[0x90 | 0x3] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(!test_b()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(!test_b()) ^ 1; }; } };;; table0F_16[0x90 | 0x4] = table0F_32[0x90 | 0x4] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(test_z()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(test_z()) ^ 1; }; } };;; table0F_16[0x90 | 0x5] = table0F_32[0x90 | 0x5] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(!test_z()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(!test_z()) ^ 1; }; } };;; table0F_16[0x90 | 0x6] = table0F_32[0x90 | 0x6] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(test_be()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(test_be()) ^ 1; }; } };;; table0F_16[0x90 | 0x7] = table0F_32[0x90 | 0x7] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(!test_be()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(!test_be()) ^ 1; }; } };;; table0F_16[0x90 | 0x8] = table0F_32[0x90 | 0x8] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(test_s()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(test_s()) ^ 1; }; } };;; table0F_16[0x90 | 0x9] = table0F_32[0x90 | 0x9] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(!test_s()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(!test_s()) ^ 1; }; } };;; table0F_16[0x90 | 0xA] = table0F_32[0x90 | 0xA] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(test_p()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(test_p()) ^ 1; }; } };;; table0F_16[0x90 | 0xB] = table0F_32[0x90 | 0xB] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(!test_p()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(!test_p()) ^ 1; }; } };;; table0F_16[0x90 | 0xC] = table0F_32[0x90 | 0xC] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(test_l()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(test_l()) ^ 1; }; } };;; table0F_16[0x90 | 0xD] = table0F_32[0x90 | 0xD] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(!test_l()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(!test_l()) ^ 1; }; } };;; table0F_16[0x90 | 0xE] = table0F_32[0x90 | 0xE] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(test_le()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(test_le()) ^ 1; }; } };;; table0F_16[0x90 | 0xF] = table0F_32[0x90 | 0xF] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { safe_write8(modrm_resolve(modrm_byte), !(!test_le()) ^ 1); } else { reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = !(!test_le()) ^ 1; }; } };;;;
table0F_16[0xA0] = function() { { push16(sreg[reg_fs]); } }; table0F_32[0xA0] = function() { { push32(sreg[reg_fs]); } };;
table0F_16[0xA1] = function() { { switch_seg(reg_fs, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 2; } }; table0F_32[0xA1] = function() { { switch_seg(reg_fs, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 4; } };;;
//op2(0xA1, 
//    { safe_pop16(sreg[reg_fs]); switch_seg(reg_fs); }, 
//    { safe_pop32s(sreg[reg_fs]); switch_seg(reg_fs); });
table0F_16[0xA2] = table0F_32[0xA2] = function() { { cpuid(); } };;
table0F_16[0xA3] = table0F_32[0xA3] = function() { var modrm_byte = read_imm8(); { if(operand_size_32) { if(modrm_byte < 0xC0) { bt_mem(modrm_resolve(modrm_byte), reg32s[modrm_byte >> 3 & 7]); } else { bt_reg(reg32[modrm_byte & 7], reg32[modrm_byte >> 3 & 7] & 31); } } else { if(modrm_byte < 0xC0) { bt_mem(modrm_resolve(modrm_byte), reg16s[modrm_byte >> 2 & 14]); } else { bt_reg(reg16[modrm_byte << 1 & 14], reg16[modrm_byte >> 2 & 14] & 15); } } } };;
table0F_16[0xA4] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shld16(data, reg16[modrm_byte >> 2 & 14], read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shld16(data, reg16[modrm_byte >> 2 & 14], read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shld16(data, reg16[modrm_byte >> 2 & 14], read_imm8() & 31); }; } }; table0F_32[0xA4] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shld32(data, reg32[modrm_byte >> 3 & 7], read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shld32(data, reg32[modrm_byte >> 3 & 7], read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shld32(data, reg32[modrm_byte >> 3 & 7], read_imm8() & 31); }; } };;
table0F_16[0xA5] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shld16(data, reg16[modrm_byte >> 2 & 14], reg8[reg_cl] & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shld16(data, reg16[modrm_byte >> 2 & 14], reg8[reg_cl] & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shld16(data, reg16[modrm_byte >> 2 & 14], reg8[reg_cl] & 31); }; } }; table0F_32[0xA5] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shld32(data, reg32[modrm_byte >> 3 & 7], reg8[reg_cl] & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shld32(data, reg32[modrm_byte >> 3 & 7], reg8[reg_cl] & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shld32(data, reg32[modrm_byte >> 3 & 7], reg8[reg_cl] & 31); }; } };;
table0F_16[0xA6] = table0F_32[0xA6] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0xA7] = table0F_32[0xA7] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
table0F_16[0xA8] = function() { { push16(sreg[reg_gs]); } }; table0F_32[0xA8] = function() { { push32(sreg[reg_gs]); } };;
table0F_16[0xA9] = function() { { switch_seg(reg_gs, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 2; } }; table0F_32[0xA9] = function() { { switch_seg(reg_gs, memory.read16(get_esp_read(0))); stack_reg[reg_vsp] += 4; } };;;
//op2(0xA9, 
//    { safe_pop16(sreg[reg_gs]); switch_seg(reg_gs); }, 
//    { safe_pop32s(sreg[reg_gs]); switch_seg(reg_gs); });
// rsm
table0F_16[0xAA] = table0F_32[0xAA] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
table0F_16[0xAB] = table0F_32[0xAB] = function() { var modrm_byte = read_imm8(); { if(operand_size_32) { if(modrm_byte < 0xC0) { bts_mem(modrm_resolve(modrm_byte), reg32s[modrm_byte >> 3 & 7]); } else { reg32[modrm_byte & 7] = bts_reg(reg32s[modrm_byte & 7], reg32s[modrm_byte >> 3 & 7] & 31); } } else { if(modrm_byte < 0xC0) { bts_mem(modrm_resolve(modrm_byte), reg16s[modrm_byte >> 2 & 14]); } else { reg16[modrm_byte << 1 & 14] = bts_reg(reg16[modrm_byte << 1 & 14], reg16s[modrm_byte >> 2 & 14] & 15); } }; } };;
table0F_16[0xAC] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shrd16(data, reg16[modrm_byte >> 2 & 14], read_imm8() & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shrd16(data, reg16[modrm_byte >> 2 & 14], read_imm8() & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shrd16(data, reg16[modrm_byte >> 2 & 14], read_imm8() & 31); }; } }; table0F_32[0xAC] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shrd32(data, reg32[modrm_byte >> 3 & 7], read_imm8() & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shrd32(data, reg32[modrm_byte >> 3 & 7], read_imm8() & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shrd32(data, reg32[modrm_byte >> 3 & 7], read_imm8() & 31); }; } };;
table0F_16[0xAD] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, shrd16(data, reg16[modrm_byte >> 2 & 14], reg8[reg_cl] & 31)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, shrd16(data, reg16[modrm_byte >> 2 & 14], reg8[reg_cl] & 31)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = shrd16(data, reg16[modrm_byte >> 2 & 14], reg8[reg_cl] & 31); }; } }; table0F_32[0xAD] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, shrd32(data, reg32[modrm_byte >> 3 & 7], reg8[reg_cl] & 31)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, shrd32(data, reg32[modrm_byte >> 3 & 7], reg8[reg_cl] & 31)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = shrd32(data, reg32[modrm_byte >> 3 & 7], reg8[reg_cl] & 31); }; } };;
table0F_16[0xAE] = table0F_32[0xAE] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
table0F_16[0xAF] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = (safe_read16(modrm_resolve(modrm_byte)) << 16 >> 16); } else { data = reg16s[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = imul_reg16(reg16s[modrm_byte >> 2 & 14], data); } }; table0F_32[0xAF] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32[modrm_byte >> 3 & 7] = imul_reg32(reg32s[modrm_byte >> 3 & 7], data); } };;
table0F_16[0xB0] = table0F_32[0xB0] = function() { var modrm_byte = read_imm8(); { /* cmpxchg8*/ if(modrm_byte < 0xC0) { var virt_addr = modrm_resolve(modrm_byte); var data = safe_read8(virt_addr); } else data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; cmp8(data, reg8[reg_al]); if(getzf()) { if(modrm_byte < 0xC0) safe_write8(virt_addr, reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]); else reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = reg8[modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1]; } else { reg8[reg_al] = data; } } };;
table0F_16[0xB1] = table0F_32[0xB1] = function() { var modrm_byte = read_imm8(); { /* cmpxchg16/32*/ if(operand_size_32) { if(modrm_byte < 0xC0) { var virt_addr = modrm_resolve(modrm_byte); var data = (safe_read32s(virt_addr) >>> 0); } else data = reg32[modrm_byte & 7]; cmp32(data, reg32[reg_eax]); if(getzf()) { if(modrm_byte < 0xC0) safe_write32(virt_addr, reg32[modrm_byte >> 3 & 7]); else reg32[modrm_byte & 7] = reg32[modrm_byte >> 3 & 7]; } else { reg32[reg_eax] = data; } } else { if(modrm_byte < 0xC0) { var virt_addr = modrm_resolve(modrm_byte); var data = safe_read16(virt_addr); } else data = reg16[modrm_byte << 1 & 14]; cmp16(data, reg16[reg_ax]); if(getzf()) { if(modrm_byte < 0xC0) safe_write16(virt_addr, reg16[modrm_byte >> 2 & 14]); else reg16[modrm_byte << 1 & 14] = reg16[modrm_byte >> 2 & 14]; } else { reg16[reg_ax] = data; } } } };;
// lss
table0F_16[0xB2] = table0F_32[0xB2] = function() { var modrm_byte = read_imm8(); { if(modrm_byte >= 0xC0) { raise_exception(6); return; } if(operand_size_32) { lss32(reg_ss, modrm_resolve(modrm_byte), modrm_byte >> 3 & 7); } else { lss16(reg_ss, modrm_resolve(modrm_byte), modrm_byte >> 2 & 14); }; } };;
table0F_16[0xB3] = table0F_32[0xB3] = function() { var modrm_byte = read_imm8(); { if(operand_size_32) { if(modrm_byte < 0xC0) { btr_mem(modrm_resolve(modrm_byte), reg32s[modrm_byte >> 3 & 7]); } else { reg32[modrm_byte & 7] = btr_reg(reg32s[modrm_byte & 7], reg32s[modrm_byte >> 3 & 7] & 31); } } else { if(modrm_byte < 0xC0) { btr_mem(modrm_resolve(modrm_byte), reg16s[modrm_byte >> 2 & 14]); } else { reg16[modrm_byte << 1 & 14] = btr_reg(reg16[modrm_byte << 1 & 14], reg16s[modrm_byte >> 2 & 14] & 15); } }; } };;
// lfs, lgs
table0F_16[0xB4] = table0F_32[0xB4] = function() { var modrm_byte = read_imm8(); { if(modrm_byte >= 0xC0) { raise_exception(6); return; } if(operand_size_32) { lss32(reg_fs, modrm_resolve(modrm_byte), modrm_byte >> 3 & 7); } else { lss16(reg_fs, modrm_resolve(modrm_byte), modrm_byte >> 2 & 14); }; } };;
table0F_16[0xB5] = table0F_32[0xB5] = function() { var modrm_byte = read_imm8(); { if(modrm_byte >= 0xC0) { raise_exception(6); return; } if(operand_size_32) { lss32(reg_gs, modrm_resolve(modrm_byte), modrm_byte >> 3 & 7); } else { lss16(reg_gs, modrm_resolve(modrm_byte), modrm_byte >> 2 & 14); }; } };;
table0F_16[0xB6] = function() { var modrm_byte = read_imm8(); { /* movzx*/ if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg16[modrm_byte >> 2 & 14] = data; } }; table0F_32[0xB6] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8(modrm_resolve(modrm_byte)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg32[modrm_byte >> 3 & 7] = data; } };;
table0F_16[0xB7] = table0F_32[0xB7] = function() { var modrm_byte = read_imm8(); { /* movzx*/ if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg32[modrm_byte >> 3 & 7] = data; } };;
// popcnt
table0F_16[0xB8] = table0F_32[0xB8] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
// UD
table0F_16[0xB9] = table0F_32[0xB9] = function() { { if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();;} };;
table0F_16[0xBA] = table0F_32[0xBA] = function() { var modrm_byte = read_imm8(); { /*dbg_log("BA " + mod + " " + imm8);*/ switch(modrm_byte >> 3 & 7) { case 4: if(operand_size_32) { if(modrm_byte < 0xC0) { bt_mem(modrm_resolve(modrm_byte), read_imm8() & 31); } else { bt_reg(reg32[modrm_byte & 7], read_imm8() & 31); } } else { if(modrm_byte < 0xC0) { bt_mem(modrm_resolve(modrm_byte), read_imm8() & 31); } else { bt_reg(reg16[modrm_byte << 1 & 14], read_imm8() & 15); } } break; case 5: if(operand_size_32) { if(modrm_byte < 0xC0) { bts_mem(modrm_resolve(modrm_byte), read_imm8() & 31); } else { reg32[modrm_byte & 7] = bts_reg(reg32s[modrm_byte & 7], read_imm8() & 31 & 31); } } else { if(modrm_byte < 0xC0) { bts_mem(modrm_resolve(modrm_byte), read_imm8() & 31); } else { reg16[modrm_byte << 1 & 14] = bts_reg(reg16[modrm_byte << 1 & 14], read_imm8() & 31 & 15); } }; break; case 6: if(operand_size_32) { if(modrm_byte < 0xC0) { btr_mem(modrm_resolve(modrm_byte), read_imm8() & 31); } else { reg32[modrm_byte & 7] = btr_reg(reg32s[modrm_byte & 7], read_imm8() & 31 & 31); } } else { if(modrm_byte < 0xC0) { btr_mem(modrm_resolve(modrm_byte), read_imm8() & 31); } else { reg16[modrm_byte << 1 & 14] = btr_reg(reg16[modrm_byte << 1 & 14], read_imm8() & 31 & 15); } }; break; case 7: if(operand_size_32) { if(modrm_byte < 0xC0) { btc_mem(modrm_resolve(modrm_byte), read_imm8() & 31); } else { reg32[modrm_byte & 7] = btc_reg(reg32s[modrm_byte & 7], read_imm8() & 31 & 31); } } else { if(modrm_byte < 0xC0) { btc_mem(modrm_resolve(modrm_byte), read_imm8() & 31); } else { reg16[modrm_byte << 1 & 14] = btc_reg(reg16[modrm_byte << 1 & 14], read_imm8() & 31 & 15); } }; break; default: dbg_log(modrm_byte >> 3 & 7); if(DEBUG) { dbg_trace(); throw "TODO"; } trigger_ud();; } } };;
table0F_16[0xBB] = table0F_32[0xBB] = function() { var modrm_byte = read_imm8(); { if(operand_size_32) { if(modrm_byte < 0xC0) { btc_mem(modrm_resolve(modrm_byte), reg32s[modrm_byte >> 3 & 7]); } else { reg32[modrm_byte & 7] = btc_reg(reg32s[modrm_byte & 7], reg32s[modrm_byte >> 3 & 7] & 31); } } else { if(modrm_byte < 0xC0) { btc_mem(modrm_resolve(modrm_byte), reg16s[modrm_byte >> 2 & 14]); } else { reg16[modrm_byte << 1 & 14] = btc_reg(reg16[modrm_byte << 1 & 14], reg16s[modrm_byte >> 2 & 14] & 15); } }; } };;
table0F_16[0xBC] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = bsf16(reg16[modrm_byte >> 2 & 14], data); } }; table0F_32[0xBC] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32[modrm_byte >> 3 & 7] = bsf32(reg32[modrm_byte >> 3 & 7], data); } };;
table0F_16[0xBD] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read16(modrm_resolve(modrm_byte)); } else { data = reg16[modrm_byte << 1 & 14]; }; reg16[modrm_byte >> 2 & 14] = bsr16(reg16[modrm_byte >> 2 & 14], data); } }; table0F_32[0xBD] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read32s(modrm_resolve(modrm_byte)); } else { data = reg32s[modrm_byte & 7]; }; reg32[modrm_byte >> 3 & 7] = bsr32(reg32[modrm_byte >> 3 & 7], data); } };;
table0F_16[0xBE] = function() { var modrm_byte = read_imm8(); { /* movsx*/ if(modrm_byte < 0xC0) { var data = safe_read8s(modrm_resolve(modrm_byte)); } else { data = reg8s[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg16[modrm_byte >> 2 & 14] = data; } }; table0F_32[0xBE] = function() { var modrm_byte = read_imm8(); { if(modrm_byte < 0xC0) { var data = safe_read8s(modrm_resolve(modrm_byte)); } else { data = reg8s[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; }; reg32s[modrm_byte >> 3 & 7] = data; } };;
table0F_16[0xBF] = table0F_32[0xBF] = function() { var modrm_byte = read_imm8(); { /* movsx*/ if(modrm_byte < 0xC0) { var data = (safe_read16(modrm_resolve(modrm_byte)) << 16 >> 16); } else { data = reg16s[modrm_byte << 1 & 14]; }; reg32s[modrm_byte >> 3 & 7] = data; } };;
table0F_16[0xC0] = table0F_32[0xC0] = function() { var modrm_byte = read_imm8(); { var data; var addr; if(modrm_byte < 0xC0) { addr = translate_address_write(modrm_resolve(modrm_byte)); data = memory.read8(addr); memory.write8(addr, xadd8(data, modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1)); } else { data = reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1]; reg8[modrm_byte << 2 & 0xC | modrm_byte >> 2 & 1] = xadd8(data, modrm_byte >> 1 & 0xC | modrm_byte >> 5 & 1); }; } };;
table0F_16[0xC1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) === 0xFFF) { phys_addr_high = translate_address_write(virt_addr + 1); data = virt_boundary_read16(phys_addr, phys_addr_high); virt_boundary_write16(phys_addr, phys_addr_high, xadd16(data, modrm_byte >> 2 & 14)); } else { data = memory.read16(phys_addr); memory.write16(phys_addr, xadd16(data, modrm_byte >> 2 & 14)); } } else { data = reg16[modrm_byte << 1 & 14]; reg16[modrm_byte << 1 & 14] = xadd16(data, modrm_byte >> 2 & 14); }; } }; table0F_32[0xC1] = function() { var modrm_byte = read_imm8(); { var data; var virt_addr; var phys_addr; var phys_addr_high; if(modrm_byte < 0xC0) { virt_addr = modrm_resolve(modrm_byte); phys_addr = translate_address_write(virt_addr); if(paging && (virt_addr & 0xFFF) >= 0xFFD) { phys_addr_high = translate_address_write(virt_addr + 3); data = virt_boundary_read32s(phys_addr, phys_addr_high) >>> 0; virt_boundary_write32(phys_addr, phys_addr_high, xadd32(data, modrm_byte >> 3 & 7)); } else { data = memory.read32s(phys_addr) >>> 0; memory.write32(phys_addr, xadd32(data, modrm_byte >> 3 & 7)); } } else { data = reg32[modrm_byte & 7]; reg32s[modrm_byte & 7] = xadd32(data, modrm_byte >> 3 & 7); }; } };;
table0F_16[0xC2] = table0F_32[0xC2] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xC3] = table0F_32[0xC3] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xC4] = table0F_32[0xC4] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xC5] = table0F_32[0xC5] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xC6] = table0F_32[0xC6] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xC7] = table0F_32[0xC7] = function() { var modrm_byte = read_imm8(); { /* cmpxchg8b*/ var addr = modrm_resolve(modrm_byte); var m64_low = (safe_read32s(addr) >>> 0); var m64_high = (safe_read32s(addr + 4) >>> 0); if(reg32[reg_eax] === m64_low && reg32[reg_edx] === m64_high) { flags |= flag_zero; safe_write32(addr, reg32[reg_ebx]); safe_write32(addr + 4, reg32[reg_ecx]); } else { flags &= ~flag_zero; reg32[reg_eax] = m64_low; reg32[reg_edx] = m64_high; } flags_changed &= ~flag_zero; } };;
table0F_16[0xC8 | 0] = table0F_32[0xC8 | 0] = function() { { bswap(reg_eax); } };; table0F_16[0xC8 | 1] = table0F_32[0xC8 | 1] = function() { { bswap(reg_ecx); } };; table0F_16[0xC8 | 2] = table0F_32[0xC8 | 2] = function() { { bswap(reg_edx); } };; table0F_16[0xC8 | 3] = table0F_32[0xC8 | 3] = function() { { bswap(reg_ebx); } };; table0F_16[0xC8 | 4] = table0F_32[0xC8 | 4] = function() { { bswap(reg_esp); } };; table0F_16[0xC8 | 5] = table0F_32[0xC8 | 5] = function() { { bswap(reg_ebp); } };; table0F_16[0xC8 | 6] = table0F_32[0xC8 | 6] = function() { { bswap(reg_esi); } };; table0F_16[0xC8 | 7] = table0F_32[0xC8 | 7] = function() { { bswap(reg_edi); } };;
table0F_16[0xD0] = table0F_32[0xD0] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xD1] = table0F_32[0xD1] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xD2] = table0F_32[0xD2] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xD3] = table0F_32[0xD3] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xD4] = table0F_32[0xD4] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xD5] = table0F_32[0xD5] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xD6] = table0F_32[0xD6] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xD7] = table0F_32[0xD7] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xD8] = table0F_32[0xD8] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xD9] = table0F_32[0xD9] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xDA] = table0F_32[0xDA] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xDB] = table0F_32[0xDB] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xDC] = table0F_32[0xDC] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xDD] = table0F_32[0xDD] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xDE] = table0F_32[0xDE] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xDF] = table0F_32[0xDF] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE0] = table0F_32[0xE0] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE1] = table0F_32[0xE1] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE2] = table0F_32[0xE2] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE3] = table0F_32[0xE3] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE4] = table0F_32[0xE4] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE5] = table0F_32[0xE5] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE6] = table0F_32[0xE6] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE7] = table0F_32[0xE7] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE8] = table0F_32[0xE8] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xE9] = table0F_32[0xE9] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xEA] = table0F_32[0xEA] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xEB] = table0F_32[0xEB] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xEC] = table0F_32[0xEC] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xED] = table0F_32[0xED] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xEE] = table0F_32[0xEE] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xEF] = table0F_32[0xEF] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF0] = table0F_32[0xF0] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF1] = table0F_32[0xF1] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF2] = table0F_32[0xF2] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF3] = table0F_32[0xF3] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF4] = table0F_32[0xF4] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF5] = table0F_32[0xF5] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF6] = table0F_32[0xF6] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF7] = table0F_32[0xF7] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF8] = table0F_32[0xF8] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xF9] = table0F_32[0xF9] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xFA] = table0F_32[0xFA] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xFB] = table0F_32[0xFB] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xFC] = table0F_32[0xFC] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xFD] = table0F_32[0xFD] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
table0F_16[0xFE] = table0F_32[0xFE] = function() { { dbg_log("No SSE", LOG_CPU); trigger_ud();} };;
// NSA backdoor instruction
table0F_16[0xFF] = table0F_32[0xFF] = function() { { if(DEBUG) throw "Possible fault: undefined instruction"; trigger_ud();} };;
}

//main.js
'use strict';

Object.fromList = function (xs) {
  var result = {};

  for (var i = 0; i < xs.length; i++) {
    result[xs[i][0]] = xs[i][1];
  }

  return result;
};

var dbg_names = Object.fromList([
  [1, ''],
  [LOG_CPU, 'CPU'],
  [LOG_DISK, 'DISK'],
  [LOG_FPU, 'FPU'],
  [LOG_MEM, 'MEM'],
  [LOG_DMA, 'DMA'],
  [LOG_IO, 'IO'],
  [LOG_PS2, 'PS2'],
  [LOG_PIC, 'PIC'],
  [LOG_VGA, 'VGA'],
  [LOG_PIT, 'PIT'],
  [LOG_MOUSE, 'MOUS'],
  [LOG_PCI, 'PCI'],
  [LOG_BIOS, 'BIOS'],
  [LOG_CD, 'CD'],
  [LOG_SERIAL, 'SERI'],
  [LOG_RTC, 'RTC'],
]);

/**
 * @param {number=} level
 */
function dbg_log(stuff, level) {
  if (!DEBUG) return;

  level = level || 1;

  if (level & LOG_LEVEL) {
    var level_name = dbg_names[level] || '';

    console.log('[' + String.pads(level_name, 4) + '] ' + stuff);
  }
}

function dbg_trace() {
  if (!DEBUG) return;

  dbg_log(Error().stack);
}

/**
 * console.assert is fucking slow
 * @param {string=} msg
 */
function dbg_assert(cond, msg) {
  if (!DEBUG) return;

  if (!cond) {
    //dump_regs();
    console.log(Error().stack);
    console.trace();
    if (msg) {
      throw 'Assert failed: ' + msg;
    } else {
      throw 'Assert failed';
    }
  }
}

Object.extend = function (target, src) {
  var keys = Object.keys(src);

  for (var i = 0; i < keys.length; i++) {
    target[keys[i]] = src[keys[i]];
  }
};

// pad string with spaces on the right
String.pads = function (str, len) {
  str = str ? str + '' : '';

  while (str.length < len) {
    str = str + ' ';
  }

  return str;
};

// pad string with zeros on the left
String.pad0 = function (str, len) {
  str = str ? str + '' : '';

  while (str.length < len) {
    str = '0' + str;
  }

  return str;
};

Array.range = function (n) {
  var a = [];

  for (var i = 0; i < n; i++) {
    a[i] = i;
  }

  return a;
};

/**
 * number to hex
 * @param {number=} len
 */
function h(n, len) {
  //dbg_assert(typeof n === "number");

  if (!n) return String.pad0('', len || 1);

  if (len) {
    return String.pad0(n.toString(16).toUpperCase(), len);
  } else {
    return n.toString(16).toUpperCase();
  }
}

Number.bits = function (n) {
  var result = [];

  for (var bit = 31; bit > -1; bit--) {
    if (n & (1 << bit)) {
      result.push(bit);
    }
  }

  return result.join(', ');
};

String.chr_repeat = function (chr, count) {
  var result = '';

  while (count--) {
    result += chr;
  }

  return result;
};

Math.bcd_pack = function (n) {
  var i = 0,
    result = 0,
    digit;

  while (n) {
    digit = n % 10;

    result |= digit << (4 * i);
    i++;
    n = (n - digit) / 10;
  }

  return result;
};

/**
 * @param {string=} msg
 * */
function unimpl(msg) {
  var s = 'Unimplemented' + (msg ? ': ' + msg : '');

  log(s);

  if (DEBUG) {
    console.trace();
    return s;
  } else {
    log('Execution stopped');
    return s;
  }
  //this.name = "Unimplemented";
}

/**
 * Synchronous access to ArrayBuffer
 * @constructor
 */
function SyncBuffer(buffer) {
  this.byteLength = buffer.byteLength;

  // warning: fn may be called synchronously or asynchronously
  this.get = function (start, len, fn) {
    fn(new Uint8Array(buffer, start, len));
  };

  this.set = function (start, slice, fn) {
    new Uint8Array(buffer, start, slice.byteLength).set(slice);
    fn();
  };

  this.get_buffer = function (fn) {
    fn(buffer);
  };
}

/**
 * Simple circular queue for logs
 *
 * @param {number} size
 * @param {?=} Proto
 * @constructor
 */
function CircularQueue(size, Proto) {
  var data, index;

  this.add = function (item) {
    data[index] = item;

    index = (index + 1) % size;
  };

  this.toArray = function () {
    return [].slice.call(data, index).concat([].slice.call(data, 0, index));
  };

  this.clear = function () {
    if (Proto) {
      data = new Proto(size);
    } else {
      data = [];
    }

    index = 0;
  };

  this.set = function (new_data) {
    data = new_data;
    index = 0;
  };

  this.clear();
}

// switch number to big endian
Math.to_be32 = function (dword) {
  return (
    (dword >>> 24) |
    ((dword >> 8) & 0xff00) |
    ((dword << 8) & 0xff0000) |
    (dword << 24)
  );
};

Math.to_be16 = function (word) {
  return ((word >>> 8) & 0xff) | ((word << 8) & 0xff00);
};

// used in several places
// the first entry is -1
//   http://jsperf.com/integer-log2/2
var log2_table = (function () {
  var t = new Int8Array(256);

  for (var i = 0, b = -2; i < 256; i++) {
    if (!(i & (i - 1))) b++;

    t[i] = b;
  }

  return t;
})();

// round away from zero, opposite of truncation
Math.roundInfinity = function (x) {
  return x > 0 ? Math.ceil(x) : Math.floor(x);
};

//disk.js
"use strict";


var 
    /** @const */
    CDROM_SECTOR_SIZE = 2048,
    /** @const */
    HD_SECTOR_SIZE = 512;


/** @constructor */
function CDRom(dev, cd_buffer)
{
    this.io = dev.io;
    this.memory = dev.memory;
    this.pic = dev.pic;
    this.pci = dev.pci;

    this.vendor_id = 0x1002;
    this.class_revision = 0x106 << 16 | 0x01 << 8;
    this.irq = 14;
    this.iobase = 0xFFF10000;
    this.sector_size = CDROM_SECTOR_SIZE;
    this.buffer = cd_buffer;
    this.atapi = true;
    this.pci_id = 8;

    this.init();
}
CDRom.prototype = new AHCIDevice();

/** @constructor */
function HDD(dev, disk_buffer, nr)
{
    var port = nr === 0 ? 0x1F0 : 0x170,
        irq = nr === 0 ? 14 : 15;

    var pic = dev.pic;

    this.io = dev.io;
    this.memory = dev.memory;
    this.pic = dev.pic;
    this.pci = dev.pci;

    this.vendor_id = 0x1002;
    this.class_revision = 0x106 << 16 | 0x01 << 8;
    this.irq = irq;
    this.iobase = 0xFFF00000;
    this.sector_size = HD_SECTOR_SIZE;
    this.sector_count = disk_buffer.byteLength / this.sector_size;
    this.buffer = disk_buffer;
    this.atapi = false;
    this.pci_id = 0x10;

    this.head_count = 16;
    this.sectors_per_track = 63;

    this.cylinder_count = disk_buffer.byteLength / 
        this.head_count / (this.sectors_per_track + 1) / this.sector_size;

    dbg_assert(this.cylinder_count === (this.cylinder_count | 0));
    dbg_assert(this.cylinder_count <= 16383);

    var me = this;

    // status
    this.io.register_read(port | 7, read_status);

    // alternate status, starting at 3f6/376
    this.io.register_read(port | 0x206, read_status);

    function read_status()
    {
        dbg_log("ATA read status", LOG_DISK);

        var status = 0x50;

        if(data_pointer < pio_data.length)
            status |= 8;

        return status;
    }

    var last_drive = 0xFF,
        data_pointer = 0,
        pio_data = [],
        drq = false,
        is_lba = 0,
        slave = 0,
        bytecount = 0,
        sector = 0,
        cylinder = 0,
        head = 0;


    function push_irq()
    {
        pic.push_irq(me.irq);
    }

    this.io.register_write(port | 6, function(data)
    {
        dbg_log("1F6 write " + h(data), LOG_DISK);

        var slave = data & 0x10,
            mode = data & 0xE0,
            low = data & 0xF;


        if(slave)
        {
            //drq = false;
            return;
        }

        is_lba = data >> 6 & 1;
        head = data & 0xF;
        last_drive = data;
    });

    this.io.register_write(port | 2, function(data)
    {
        dbg_log("1F2 write: " + data, LOG_DISK);
        if(data)
        {
            bytecount = data << 9;
        }
        else
        {
            bytecount = 256 << 9;
        }
        //bytecount = 1 << 9;
    });
    this.io.register_write(port | 3, function(data)
    {
        sector = data;
    });
    this.io.register_write(port | 4, function(data)
    {
        cylinder = cylinder & 0xFF00 | data;
    });
    this.io.register_write(port | 5, function(data)
    {
        cylinder = cylinder & 0xFF | data << 8;
    });

    this.io.register_write(port | 7, function(cmd)
    {
        if(cmd === 0xEC)
        {
            dbg_log("ATA identify device", LOG_DISK);
            // identify device
            // http://bochs.sourceforge.net/cgi-bin/lxr/source/iodev/harddrv.cc#L2821

            data_pointer = 0;

            pio_data = new Uint8Array([
                0x40, 0, 
                // 1 cylinders
                me.cylinder_count, me.cylinder_count >> 8, 
                0, 0, 
        
                // 3 heads
                me.head_count, me.head_count >> 8, 
                0, 0,
                // 5
                0, 0, 
                // sectors per track
                me.sectors_per_track, 0, 
                0, 0, 0, 0, 0, 0,
                // 10-19 serial number
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                // 15
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                // 20
                3, 0, 0, 2, 4, 0, 
                // 23-26 firmware revision
                0, 0, 0, 0, 0, 0, 0, 0, 

                // 27 model number
                32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 
                32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,

                // 47
                0, 0, 
                1, 0, 
                0, 3,  // capabilities
                // 50
                0, 0, 
                0, 2, 
                0, 2, 
                7, 0, 

                // 54 cylinders
                me.cylinder_count, me.cylinder_count >> 8, 
                // 55 heads
                me.head_count, me.head_count >> 8, 
                // 56 sectors per track
                me.sectors_per_track, 0, 
                // capacity in sectors
                this.sector_count & 0xFF, this.sector_count >> 8 & 0xFF, 
                this.sector_count >> 16 & 0xFF, this.sector_count >> 24 & 0xFF, 
                
                0, 0,
                // 60
                this.sector_count & 0xFF, this.sector_count >> 8 & 0xFF, 
                this.sector_count >> 16 & 0xFF, this.sector_count >> 24 & 0xFF, 
                
                0, 0, 0, 0, 0, 0,
                // 65
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                // 70
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                // 75
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                // 80
                0x7E, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                // 85
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                // 90
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                // 95
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                // 100
                this.sector_count & 0xFF, this.sector_count >> 8 & 0xFF, 
                this.sector_count >> 16 & 0xFF, this.sector_count >> 24 & 0xFF, 
                

            ]);

            push_irq();
        }
        else if(cmd === 0x91)
        {
            dbg_log("ATA cmd 91", LOG_DISK);
            push_irq();
        }
        else if(cmd === 0x10)
        {
            // obsolete
            dbg_log("ATA cmd 10", LOG_DISK);
            push_irq();
        }
        else if(cmd = 0x27)
        {
            // READ NATIVE MAX ADDRESS EXT - read the actual size of the HD
            // https://en.wikipedia.org/wiki/Host_protected_area
            dbg_log("ATA cmd 27", LOG_DISK);
            push_irq();
            pio_data = [
                0, 0, // error
                0, 0, // count

                // result
                disk_buffer.byteLength & 0xff,
                disk_buffer.byteLength >> 8 & 0xff,
                disk_buffer.byteLength >> 16 & 0xff,
                disk_buffer.byteLength >> 24 & 0xff,
                0, 0,

                0, 0, //
            ];
        }
        else if(cmd === 0x20)
        {
            if(DEBUG && is_lba)
                throw "unimplemented";

            var lba = (cylinder * me.head_count + head) * me.sectors_per_track + sector - 1;
            dbg_log("ATA read: from=" + h(lba * me.sector_size) + " chs=" + cylinder + "/" + head + "/" + sector + " length=" + h(bytecount), LOG_DISK);

            me.buffer.get(lba * me.sector_size, bytecount, function(data)
            {
                data_pointer = 0;
                pio_data = data;

                push_irq();
            });
        }
        else
        {
            dbg_log("New ATA cmd on 1F7: " + h(cmd), LOG_DISK);
        }
    });

    this.io.register_read(port | 0, function()
    {
        if(data_pointer < pio_data.length)
        {
            dbg_log("Read 1F0: " + h(pio_data[data_pointer], 2), LOG_DISK);

            if((data_pointer & 511)  === 0)
                push_irq();

            return pio_data[data_pointer++] & 0xFF;
        }
        else
        {
            dbg_log("Read 1F0: empty", LOG_DISK);
            return 0;
        }
    });


    this.io.register_read(port | 1, function()
    {
        dbg_log("Read 1F1", LOG_DISK);
        return 0xFF;
    });

    this.io.register_read(port | 2, function()
    {
        dbg_log("Read 1F2", LOG_DISK);
        return 0xFF;
    });


    this.io.register_read(port | 3, function()
    {
        dbg_log("Read 1F3", LOG_DISK);
        return 0xFF;
    });

    this.io.register_read(port | 6, function()
    {
        dbg_log("Read 1F6", LOG_DISK);
        return last_drive;
    });

    this.init();
}
HDD.prototype = new AHCIDevice();


/** @constructor */
function AHCIDevice()
{
    var me,
        memory;

    this.init = function()
    {
        me = this;
        memory = this.memory;

        this.pci.register_device(this, this.pci_id);

        this.memory.mmap_register(this.iobase, 0x4000, true, mmio_read, mmio_write);

    };

    var host_ctl = 0,
        host_caps = 1,
        host_ports_impl = 1,
        host_intbits = 1,
        port_lst_addr,
        port_fis_addr;

    function atapi_command_read(atapi, dest, byte_len)
    {
        var lba = Math.to_be32(memory.read32s(atapi + 2)),
            count = Math.to_be16(memory.read16(atapi + 7)),
            flags = memory.read8(atapi + 1),

            //bytecount = Math.min(count * me.sector_size, byte_len + 1);
            bytecount = count * me.sector_size;

        dbg_log("CD read lba=" + h(lba) + 
                " lbacount=" + h(count) +
                " bytelen=" + h(byte_len) +
                " copycount=" + h(bytecount) +
                " flags=" + h(flags) +
                " buf=" + h(dest, 8), LOG_CD);

        me.buffer.get(lba * me.sector_size, bytecount, function(data)
        {
            memory.write_blob(data, dest);
        });

        //pic.push_irq(me.irq);
    }

    function ata_command_rw(cmd_fis, dest, is_read)
    {
        var lba = memory.read32s(cmd_fis + 4) & 0xFFFFFF,
            count = memory.read16(cmd_fis + 12),
            bytecount = count * me.sector_size;

        dbg_log("ahci " + (is_read ? "read" : "write") + ": lba=" + h(lba, 8) +
                " count=" + h(count, 4) +
                " dest=" + h(dest, 8));

        if(is_read)
        {
            this.buffer.get(lba * me.sector_size, bytecount, function(data)
            {
                memory.write_blob(data, dest);
            });
        }
        else
        {
            this.buffer.set(lba * me.sector_size, 
                new Uint8Array(memory.buffer, dest, bytecount), 
                function()
                {
                });
        }
    }


    function mmio_read(addr)
    {
        switch(addr)
        {
            case 0: 
                return host_caps;

            case 4: 
                return host_ctl;

            case 0xC:
                return host_ports_impl;

            case 0x128:
                return 0x03;

            case 0x110:
                return host_intbits;

            default: 
                dbg_log("New PCI mmio read from " + h(addr, 8), LOG_CD);
        }
    }

    function mmio_write(addr, value)
    {
        switch(addr)
        {
            case 0x100:
                port_lst_addr = value;
                dbg_log("lst at " + h(value, 8), LOG_CD);
                break;
            case 0x108:
                port_fis_addr = value;
                dbg_log("fis at " + h(value, 8), LOG_CD);
                break;

            case 0x118:
                dbg_log("port cmd: " + h(value, 8), LOG_CD);
                break;

            case 0x138:
                var 
                    
                    ctba_addr = memory.read32s(port_lst_addr + 8),

                    first_prdt_start = ctba_addr + 0x80,
                    flags = memory.read16(port_lst_addr),
                    prdt_addr = memory.read32s(first_prdt_start) + 0x100000000 * memory.read32s(first_prdt_start + 4),
                    prdt_len = memory.read32s(ctba_addr + 0x80 + 0xC) & 0xFFF,
                    atapi_command = memory.read8(ctba_addr + 0x40),
                    fis_command = memory.read8(ctba_addr + 2),

                    dma_fis_start = port_fis_addr + 0,
                    pio_fis_start = port_fis_addr + 0x20,
                    d2h_fis_start = port_fis_addr + 0x40,
                    ufis_start = port_fis_addr + 0x60,

                    command_fis_start = ctba_addr + 0,
                    atapi_command_start = ctba_addr + 0x40;

                if((fis_command === 0xA0 || fis_command === 0xA1) &&
                        !me.atapi)
                {
                    return;
                }

                // status success
                memory.write8(d2h_fis_start + 2, 0x40);

                dbg_log("ctba at " + h(ctba_addr), LOG_CD);
                dbg_log("prdt at " + h(prdt_addr), LOG_CD);
                dbg_log("flags: " + h(flags, 2), LOG_CD);
                dbg_log("cmd fis command: " + h(fis_command, 2), LOG_CD);

                dbg_log("fis LBA=" + h(memory.read32s(command_fis_start + 4) & 0xffffff), LOG_CD);

                dbg_log("Prdts count: " + h(memory.read16(port_lst_addr + 2)), LOG_CD);
                dbg_log("PRD byte count: " + h(memory.read32s(port_lst_addr + 4)), LOG_CD);

                dbg_log("First prdt byte count: " + h(memory.read32s(ctba_addr + 0x80 + 0xC)), LOG_CD);

                if(fis_command === 0xC8 || fis_command === 0xCA)
                {
                    ata_command_rw(command_fis_start, prdt_addr, fis_command === 0xC8);
                }
                else if(fis_command === 0xEC)
                {
                    // ATA_CMD_IDENTIFY_DEVICE

                    // number of sectors
                    memory.write32(prdt_addr + 120, me.buffer.byteLength / me.sector_size);
                }
                else if(fis_command === 0xA1)
                {
                    // ATA_CMD_IDENTIFY_PACKET_DEVICE

                    // is CD
                    memory.write32(prdt_addr, 0x0500);
                }
                else if(fis_command === 0xA0)
                {
                    // ATA_CMD_PACKET
                    if(atapi_command === 0x28)
                    {
                        atapi_command_read(ctba_addr + 0x40, prdt_addr, prdt_len);
                    }
                    else if(atapi_command === 0x2a)
                    {
                        // write
                        dbg_log("atapi - unimplemented write", LOG_CD);
                    }
                    else if(atapi_command === 0x25)
                    {
                        // read capacity
                        dbg_log("atapi - unimplemented read cap", LOG_CD);
                    }
                    else
                    {
                        dbg_log("atapi - unimplemented " + h(atapi_command, 2), LOG_CD);
                    }
                }
                else 
                {
                    dbg_log("unimplemented fis command: " + h(fis_command, 2));
                }

                break;

            default: 
                dbg_log("PCI mmio write addr=" + h(addr, 8) + " value=" + h(value, 8), LOG_CD);
        }
    }
}


//pci.js
"use strict";

var 
/** @const */  PCI_VENDOR_ID =		0x00	/* 16 bits */
/** @const */ ,PCI_DEVICE_ID =		0x02	/* 16 bits */
/** @const */ ,PCI_COMMAND =		0x04	/* 16 bits */
/** @const */ ,PCI_BASE_ADDRESS_0 =	0x10	/* 32 bits */
/** @const */ ,PCI_BASE_ADDRESS_1 =	0x14	/* 32 bits [htype 0,1 only] */
/** @const */ ,PCI_BASE_ADDRESS_2 =	0x18	/* 32 bits [htype 0 only] */
/** @const */ ,PCI_BASE_ADDRESS_3 =	0x1c	/* 32 bits */
/** @const */ ,PCI_BASE_ADDRESS_4 =	0x20	/* 32 bits */
/** @const */ ,PCI_BASE_ADDRESS_5 =	0x24	/* 32 bits */
/** @const */ ,PCI_INTERRUPT_LINE =	0x3c	/* 8 bits */
/** @const */ ,PCI_CLASS_REVISION =	0x08;	/* High 24 bits are class, low 8 revision */

/** @constructor */
function PCI(dev)
{
    var
        io = dev.io,
        pci_data = 0,
        pci_counter = 0,
        pci_response = -1,
        pci_status = -1,
        self = this;

    // TODO: Change the format of this
    this.devices = {};

    /*
    io.register_write(0xCF9, function(value)
    {
        dbg_log("PCI reboot: " + h(value, 2), LOG_PCI);

        // PCI reboot
        if(value & 6)
        {
            cpu_restart();
        }
    });*/

    io.register_read(0xCFC, function()
    {
        return pci_response & 0xFF;
    });

    io.register_read(0xCFD, function()
    {
        return pci_response >> 8 & 0xFF;
    });
    io.register_read(0xCFE, function()
    {
        return pci_response >> 16 & 0xFF;
    });
    io.register_read(0xCFF, function()
    {
        return pci_response >> 24 & 0xFF;
    });

    io.register_read(0xCF8, function()
    {
        return pci_status & 0xFF;
    });
    io.register_read(0xCF9, function()
    {
        return pci_status >> 8 & 0xFF;
    });
    io.register_read(0xCFA, function()
    {
        return pci_status >> 16 & 0xFF;
    });
    io.register_read(0xCFB, function()
    {
        return pci_status >> 24 & 0xFF;
    });

    io.register_write(0xCF8, function(out_byte)
    {
        pci_data = pci_data & ~0xFF | out_byte;
    });
    io.register_write(0xCF9, function(out_byte)
    {
        pci_data = pci_data & ~0xFF00 | out_byte << 8;
    });
    io.register_write(0xCFA, function(out_byte)
    {
        pci_data = pci_data & ~0xFF0000 | out_byte << 16;
    });
    io.register_write(0xCFB, function(out_byte)
    {
        pci_data = pci_data & 0xFFFFFF | out_byte << 24;
        pci_query(pci_data);
    });

    function pci_query(dword)
    {
        var dbg_line = "PCI: ";
        
        // Bit | .31                     .0
        // Fmt | EBBBBBBBBDDDDDFFFRRRRRR00

        var bdf = (dword & 0x7FFFFFFF) >> 8,
            addr = dword & 0xFC,
            devfn = bdf & 0xFF,
            bus = bdf >> 8,
            dev = bdf >> 3 & 0x1F,
            fn = bdf & 7,
            enabled = dword >> 31 & 1;

        dbg_line += " enabled=" + (enabled);
        dbg_line += " bdf=" + h(bdf);
        dbg_line += " addr=" + h(addr);

        dbg_log(dbg_line + " " + h(dword >>> 0, 8), LOG_PCI);

        if(dword === (0x80000000 | 0))
        {
            pci_status = 0x80000000;
        }
        else if(self.devices[bdf])
        {
            var device = self.devices[bdf];

            pci_status = 0x80000000;

            if(addr === PCI_VENDOR_ID)
            {
                pci_response = device.vendor_id;
            }
            else if(addr === PCI_CLASS_REVISION)
            {
                pci_response = device.class_revision;
            }
            else if(addr === PCI_BASE_ADDRESS_5)
            {
                pci_response = device.iobase;
            }
            else if(addr === PCI_INTERRUPT_LINE)
            {
                pci_response = device.irq;
            }
            else
            {
                dbg_log("unimplemented addr " + h(addr) + " for device " + h(bdf), LOG_PCI);
                pci_response = 0;
            }
        }
        else
        {
            pci_response = 0;
            pci_status = 0;
        }
    }

    this.register_device = function(device, device_id)
    {
        dbg_assert(!this.devices[device_id]);
        this.devices[device_id] = device;
    };

    // ~% lspci -x   
    // 00:00.0 Host bridge: Intel Corporation 4 Series Chipset DRAM Controller (rev 02)
    // 00: 86 80 20 2e 06 00 90 20 02 00 00 06 00 00 00 00
    // 10: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
    // 20: 00 00 00 00 00 00 00 00 00 00 00 00 43 10 d3 82
    // 30: 00 00 00 00 e0 00 00 00 00 00 00 00 00 00 00 00
    this.register_device({
        irq: 0,
        iobase: 0,
        vendor_id: 0x8680202e,
        class_revision: 0x06009020,
    }, 0);
}

//floppy.js
"use strict";

/** @constructor */
function FloppyController(dev, floppy_image)
{
    var 
        io = dev.io,
        pic = dev.pic,
        dma = dev.dma,

        bytes_expecting = 0,
        receiving_command = new Uint8Array(10),
        receiving_index = 0,
        next_command,

        response_data = new Uint8Array(10),
        response_index = 0,
        response_length = 0,

        /** @const */
        byte_per_sector = 512,

        /** @const */
        number_of_heads = 2;

    this.buffer = floppy_image;

    if(!floppy_image)
    {
        this.type = 0;
        return;
    }

    var number_of_cylinders,
        number_of_sectors,
        sectors_per_track;

    if(floppy_image.byteLength === 1024 * 360)
    {
        this.type = 1;
        number_of_cylinders = 40;
        number_of_sectors = 2880;
        sectors_per_track = 9;
    }
    if(floppy_image.byteLength === 1024 * 1200)
    {
        this.type = 2;
        number_of_cylinders = 80;
        number_of_sectors = 2400;
        sectors_per_track = 15;
    }
    else if(floppy_image.byteLength === 1024 * 720)
    {
        this.type = 3;
        number_of_cylinders = 80;
        number_of_sectors = 2880;
        sectors_per_track = 9;
    }
    else if(floppy_image.byteLength === 1024 * 1440)
    {
        this.type = 4;
        number_of_cylinders = 80;
        number_of_sectors = 2880;
        sectors_per_track = 18;
    }
    else if(floppy_image.byteLength === 1024 * 2880)
    {
        this.type = 5;
        number_of_cylinders = 80;
        number_of_sectors = 5760;
        sectors_per_track = 36;
    }
    else if(floppy_image.byteLength === 1024 * 1722)
    {
        // type is wrong, but only this works for seabios
        this.type = 5;
        number_of_cylinders = 82;
        number_of_sectors = 3444;
        sectors_per_track = 21;
    }
    else
    {
        throw unimpl("Unknown floppy size: " + h(floppy_image.byteLength));
    }

    var status_reg0 = 0,
        status_reg1 = 0,
        status_reg2 = 0,
        drive = 0;

    var last_cylinder = 0,
        last_head = 0,
        last_sector = 1;

    io.register_read(0x3F0, port3F0_read);
    io.register_read(0x3F4, port3F4_read);
    io.register_read(0x3F5, port3F5_read);
    io.register_read(0x3F7, port3F7_read);

    io.register_write(0x3F5, port3F5_write);

    function port3F0_read()
    {
        dbg_log("3F0 read", LOG_DISK);

        return 0;
    };


    function port3F4_read()
    {
        dbg_log("3F4 read", LOG_DISK);

        var return_byte = 0x80;

        if(response_index < response_length)
        {
            return_byte |= 0x40 | 0x10;
        }

        if((dor & 8) === 0)
        {
            return_byte |= 0x20;
        }

        return return_byte;
    };

    function port3F7_read()
    {
        dbg_log("3F7 read", LOG_DISK);
        return 0x00;
    }

    function port3F5_read()
    {
        if(response_index < response_length)
        {
            dbg_log("3F5 read: " + response_data[response_index], LOG_DISK);
            return response_data[response_index++];
        }
        else
        {
            dbg_log("3F5 read, empty", LOG_DISK);
            return 0xFF;
        }
    };

    function port3F5_write(reg_byte)
    {
        dbg_log("3F5 write " + h(reg_byte), LOG_DISK);

        if(bytes_expecting > 0)
        {
            receiving_command[receiving_index++] = reg_byte;

            bytes_expecting--;

            if(bytes_expecting === 0)
            {
                if(DEBUG)
                {
                    var log = "3F5 command received: ";
                    for(var i = 0; i < receiving_index; i++) 
                        log += h(receiving_command[i]) + " ";
                    dbg_log(log, LOG_DISK);
                }

                next_command(receiving_command);
            }
        }
        else
        {
            switch(reg_byte)
            {
                // TODO
                //case 2:
                    //next_command = read_complete_track;
                    //bytes_expecting = 8;
                    //break;
                case 0x03:
                    next_command = fix_drive_data;
                    bytes_expecting = 2;
                    break;
                case 0x04:
                    next_command = check_drive_status;
                    bytes_expecting = 1;
                    break;
                case 0x05:
                case 0xC5:
                    next_command = function(args) { do_sector(true, args); };
                    bytes_expecting = 8;
                    break;
                case 0xE6:
                    next_command = function(args) { do_sector(false, args); };
                    bytes_expecting = 8;
                    break;
                case 0x07:
                    next_command = calibrate;
                    bytes_expecting = 1;
                    break;
                case 0x08:
                    check_interrupt_status();
                    break;
                case 0x4A:
                    next_command = read_sector_id;
                    bytes_expecting = 1;
                    break;
                case 0x0F:
                    bytes_expecting = 2;
                    next_command = seek;
                    break;
                case 0x0E:
                    // dump regs 
                    dbg_log("dump registers", LOG_DISK);
                    response_data[0] = 0x80;
                    response_index = 0;
                    response_length = 1;

                    bytes_expecting = 0;
                    break;
                default:
                    if(DEBUG) throw "unimpl floppy command call " + h(reg_byte);
            }

            receiving_index = 0;
        }
    };


    // this should actually be write-only ... but people read it anyway
    var dor = 0;

    function port3F2_read()
    {
        dbg_log("read 3F2: DOR", LOG_DISK);
        return dor;
    }
    io.register_read(0x3F2, port3F2_read);

    function port3F2_write(value)
    {
        if((value & 4) === 4 && (dor & 4) === 0)
        {
            // reset
            pic.push_irq(6);
        }

        dbg_log("start motors: " + h(value >> 4), LOG_DISK);
        dbg_log("enable dma: " + !!(value & 8), LOG_DISK);
        dbg_log("reset fdc: " + !!(value & 4), LOG_DISK);
        dbg_log("drive select: " + (value & 3), LOG_DISK);
        dbg_log("DOR = " + h(value), LOG_DISK);

        dor = value;

    }
    io.register_write(0x3F2, port3F2_write);

    function check_drive_status(args)
    {
        dbg_log("check drive status", LOG_DISK);

        response_index = 0;
        response_length = 1;
        response_data[0] = 1 << 5;
    }

    function seek(args)
    {
        dbg_log("seek", LOG_DISK);

        last_cylinder = args[1];
        last_head = args[0] >> 2 & 1;
        
        if(dor & 8)
        {
            pic.push_irq(6);
        }
    }

    function calibrate(args)
    {
        dbg_log("floppy calibrate", LOG_DISK);

        if(dor & 8)
        {
            pic.push_irq(6);
        }
    }

    function check_interrupt_status()
    {
        // do not trigger an interrupt here
        dbg_log("floppy check interrupt status", LOG_DISK);

        response_index = 0;
        response_length = 2;

        response_data[0] = 1 << 5;
        response_data[1] = last_cylinder;
    }

    function do_sector(is_write, args)
    {
        var head = args[2],
            cylinder = args[1],
            sector = args[3],
            sector_size = 128 * (1 << args[4]),
            read_count = args[5] - args[3] + 1,

            read_offset = ((head + number_of_heads * cylinder) * sectors_per_track + sector - 1) * sector_size;
        
        dbg_log("Floppy Read", LOG_DISK);
        dbg_log("from " + h(read_offset) + " length " + h(read_count * sector_size), LOG_DISK);
        dbg_log(cylinder + " / " + head + " / " + sector, LOG_DISK);

        if(!args[4])
        {
            dbg_log("FDC: sector count is zero, use data length instead", LOG_DISK);
        }

        if(is_write)
        {
            dma.do_write(floppy_image, read_offset, read_count * sector_size, 2, done);
        }
        else
        {
            dma.do_read(floppy_image, read_offset, read_count * sector_size, 2, done);
        }

        function done()
        {
            sector++;

            if(sector > sectors_per_track)
            {
                sector = 1;
                head++;

                if(head > 1)
                {
                    head = 0;
                    cylinder++;
                }
            }

            last_cylinder = cylinder;
            last_head = head;
            last_sector = sector;

            response_index = 0;
            response_length = 7;

            response_data[0] = head << 2 | 0x20; 
            response_data[1] = 0; 
            response_data[2] = 0; 
            response_data[3] = cylinder; 
            response_data[4] = head; 
            response_data[5] = sector; 
            response_data[6] = args[4];

            if(dor & 8)
            {
                pic.push_irq(6);
            }
        }
    }
    
    function fix_drive_data(args)
    {
        dbg_log("floppy fix drive data " + args, LOG_DISK);
    }

    function read_sector_id(args)
    {
        dbg_log("floppy read sector id " + args, LOG_DISK);

        response_index = 0;
        response_length = 7;

        response_data[0] = 0;
        response_data[1] = 0;
        response_data[2] = 0;
        response_data[3] = 0;
        response_data[4] = 0;
        response_data[5] = 0;
        response_data[6] = 0;

        if(dor & 8)
        {
            pic.push_irq(6);
        }
    }
}


//memory.js
'use strict';

/**
 * @constructor
 */
function Memory(buffer, memory_size) {
  var int8array = new Uint8Array(buffer),
    int16array = new Uint16Array(buffer),
    int8sarray = new Int8Array(buffer),
    int32sarray = new Int32Array(buffer);

  this.mem8 = int8array;
  this.mem8s = int8sarray;
  this.mem32s = int32sarray;

  this.buffer = buffer;

  // debug function called by all memory reads and writes

  function debug_write(addr, size, value) {
    if (!DEBUG) {
      return;
    }

    //dbg_assert(typeof value === "number" && !isNaN(value));
    debug_read(addr, size, true);
  }

  /** @param {boolean=} is_write */
  function debug_read(addr, size, is_write) {
    if (!DEBUG) {
      return;
    }

    dbg_assert(typeof addr === 'number');
    dbg_assert(!isNaN(addr));

    if (
      (addr >= memory_size || addr < 0) &&
      !memory_map_registered[addr >>> MMAP_BLOCK_SIZE]
    ) {
      dbg_log(
        'Read from unmapped memory space, addr=' +
          h(addr, 8) /*+ " at " + h(instruction_pointer, 8)*/,
        LOG_IO
      );
    }

    //dbg_assert(memory_map_registered[addr >>> MMAP_BLOCK_SIZE]);
  }

  this.dump_all = function (start, end) {
    start = start || 0;
    end = end || 0x100000;

    // save as method:
    dump_file(buffer.slice(start, end), 'memory.bin');
  };

  this.dump = function (addr, length) {
    length = length || 4 * 0x10;
    var line, byt;

    for (var i = 0; i < length >> 4; i++) {
      line = h(addr + (i << 4), 5) + '   ';

      for (var j = 0; j < 0x10; j++) {
        byt = this.read8(addr + (i << 4) + j);
        line += h(byt, 2) + ' ';
      }

      line += '  ';

      for (j = 0; j < 0x10; j++) {
        byt = this.read8(addr + (i << 4) + j);
        line += byt < 33 || byt > 126 ? '.' : String.fromCharCode(byt);
      }

      dbg_log(line);
    }
  };

  this.print_memory_map = function () {
    var width = 0x80,
      height = 0x10,
      block_size = (memory_size / width / height) | 0,
      row;

    for (var i = 0; i < height; i++) {
      row = '0x' + h(i * width * block_size, 8) + ' | ';

      for (var j = 0; j < width; j++) {
        var used = this.mem32s[(i * width + j) * block_size] > 0;

        row += used ? 'X' : ' ';
      }

      dbg_log(row);
    }
  };

  var /**
     * Arbritary value, the minimum number of bytes that can be mapped
     * by one device. This might be spec'd somewhere ...
     *
     * Written as a power of 2.
     *
     * @const
     */
    MMAP_BLOCK_SIZE = 14,
    /** @const */
    MMAP_BYTEWISE = 1,
    MMAP_DWORDWISE = 4,
    // this only supports a 32 bit address space
    memory_map_registered = new Int8Array(1 << (32 - MMAP_BLOCK_SIZE)),
    memory_map_read = [],
    memory_map_write = [];

  for (var i = 0; i < 1 << (32 - MMAP_BLOCK_SIZE); i++) {
    // avoid sparse arrays
    memory_map_read[i] = memory_map_write[i] = undefined;
  }

  /**
   * @param addr {number}
   * @param size {number}
   * @param is_dword {boolean} true if the memory is addressed in dwords, otherwise byte
   *
   */
  this.mmap_register = function (addr, size, is_dword, read_func, write_func) {
    dbg_log('mmap_register32 ' + h(addr, 8) + ': ' + h(size, 8), LOG_IO);
    dbg_assert((addr & ((1 << MMAP_BLOCK_SIZE) - 1)) === 0);
    dbg_assert(
      size >= 1 << MMAP_BLOCK_SIZE &&
        (size & ((1 << MMAP_BLOCK_SIZE) - 1)) === 0
    );

    var aligned_addr = addr >>> MMAP_BLOCK_SIZE,
      unit_size = is_dword ? MMAP_DWORDWISE : MMAP_BYTEWISE;

    for (; size > 0; aligned_addr++) {
      memory_map_registered[aligned_addr] = unit_size;

      memory_map_read[aligned_addr] = function (read_addr) {
        return read_func((read_addr - addr) | 0);
      };
      memory_map_write[aligned_addr] = function (write_addr, value) {
        write_func((write_addr - addr) | 0, value);
      };

      size -= 1 << MMAP_BLOCK_SIZE;
    }
  };

  function mmap_read8(addr) {
    var aligned_addr = addr >>> MMAP_BLOCK_SIZE,
      registered = memory_map_read[aligned_addr];

    //dbg_log("mmap_read8 " + h(addr, 8), LOG_IO);

    if (memory_map_registered[aligned_addr] === MMAP_BYTEWISE) {
      return registered(addr);
    } else {
      return (mmap_read32(addr & ~3) >> (8 * (addr & 3))) & 0xff;
    }
  }

  function mmap_write8(addr, value) {
    var aligned_addr = addr >>> MMAP_BLOCK_SIZE,
      registered = memory_map_write[addr >>> MMAP_BLOCK_SIZE];

    //dbg_log("mmap_write8 " + h(addr, 8) + ": " + h(value, 2), LOG_IO);

    if (memory_map_registered[aligned_addr] === MMAP_BYTEWISE) {
      registered(addr, value);
    } else {
      // impossible without reading. Maybe this should do nothing
      dbg_assert(false);
    }
  }

  function mmap_read32(addr) {
    var registered = memory_map_read[addr >>> MMAP_BLOCK_SIZE];

    //dbg_log("mmap_read32 " + h(addr, 8), LOG_IO);
    //dbg_assert((addr & 3) === 0);
    dbg_assert(registered);

    if (
      (addr & 3) === 0 &&
      memory_map_registered[addr >>> MMAP_BLOCK_SIZE] === MMAP_DWORDWISE
    ) {
      return registered(addr);
    } else {
      return (
        mmap_read8(addr) |
        (mmap_read8(addr + 1) << 8) |
        (mmap_read8(addr + 2) << 16) |
        (mmap_read8(addr + 3) << 24)
      );
    }
  }

  function mmap_write32(addr, value) {
    var registered = memory_map_write[addr >>> MMAP_BLOCK_SIZE];

    //dbg_log("mmap_write32 " + h(addr, 8) + ": " + h(value, 8), LOG_IO);
    //dbg_assert((addr & 3) === 0);
    dbg_assert(registered);

    if (
      (addr & 3) === 0 &&
      memory_map_registered[addr >>> MMAP_BLOCK_SIZE] === MMAP_DWORDWISE
    ) {
      registered(addr, value);
    } else {
      mmap_write8(addr, value & 0xff);
      mmap_write8(addr + 1, (value >> 8) & 0xff);
      mmap_write8(addr + 2, (value >> 16) & 0xff);
      mmap_write8(addr + 3, (value >> 24) & 0xff);
    }
  }

  /**
   * @param addr {number}
   */
  this.read8s = function (addr) {
    debug_read(addr, 1);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      return (mmap_read8(addr) << 24) >> 24;
    } else {
      return int8sarray[addr];
    }
  };

  /**
   * @param addr {number}
   */
  this.read8 = function (addr) {
    debug_read(addr, 1);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      return mmap_read8(addr);
    } else {
      return int8array[addr];
    }
  };

  /**
   * @param addr {number}
   */
  this.read16 = function (addr) {
    debug_read(addr, 2);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      return mmap_read8(addr) | (mmap_read8(addr + 1) << 8);
    } else {
      return int8array[addr] | (int8array[addr + 1] << 8);
    }
  };

  /**
   * @param addr {number}
   */
  this.read_aligned16 = function (addr) {
    debug_read(addr, 2);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      return mmap_read8(addr) | (mmap_read8(addr + 1) << 8);
    } else {
      return int16array[addr >> 1];
    }
  };

  /**
   * @param addr {number}
   */
  this.read32s = function (addr) {
    debug_read(addr, 4);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      return mmap_read32(addr) | 0;
    } else {
      return (
        int8array[addr] |
        (int8array[addr + 1] << 8) |
        (int8array[addr + 2] << 16) |
        (int8array[addr + 3] << 24)
      );
    }
  };

  /**
   * @param addr {number}
   */
  this.read_aligned32 = function (addr) {
    debug_read(addr, 4);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      return mmap_read32(addr) | 0;
    } else {
      return int32sarray[addr >> 2];
    }
  };

  /**
   * @param addr {number}
   * @param value {number}
   */
  this.write8 = function (addr, value) {
    debug_write(addr, 1, value);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      mmap_write8(addr, value);
    } else {
      int8array[addr] = value;
    }
  };

  /**
   * @param addr {number}
   * @param value {number}
   */
  this.write16 = function (addr, value) {
    debug_write(addr, 2, value);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      mmap_write8(addr, value & 0xff);
      mmap_write8(addr + 1, (value >> 8) & 0xff);
    } else {
      int8array[addr] = value;
      int8array[addr + 1] = value >> 8;
    }
  };

  /**
   * @param addr {number}
   * @param value {number}
   */
  this.write_aligned16 = function (addr, value) {
    debug_write(addr, 2, value);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      mmap_write8(addr, value & 0xff);
      mmap_write8(addr + 1, (value >> 8) & 0xff);
    } else {
      int16array[addr >> 1] = value;
    }
  };

  /**
   * @param addr {number}
   * @param value {number}
   */
  this.write32 = function (addr, value) {
    debug_write(addr, 4, value);

    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      mmap_write32(addr, value);
    } else {
      int8array[addr] = value;
      int8array[addr + 1] = value >> 8;
      int8array[addr + 2] = value >> 16;
      int8array[addr + 3] = value >> 24;
    }
  };

  this.write_aligned32 = function (addr, value) {
    if (memory_map_registered[addr >>> MMAP_BLOCK_SIZE]) {
      mmap_write32(addr, value);
    } else {
      int32sarray[addr >> 2] = value;
    }
  };

  /**
   * @param offset {number}
   * @param blob {Array.<number>}
   */
  this.write_blob = function (blob, offset) {
    dbg_assert(blob && blob.length);
    int8array.set(blob, offset);
  };

  /**
   * zero byte terminated string
   */
  this.read_string = function (addr) {
    var str = '',
      data_byte;

    while ((data_byte = this.read8(addr))) {
      str += String.fromCharCode(data_byte);
      addr++;
    }

    return str;
  };

  this.write_string = function (str, addr) {
    for (var i = 0; i < str.length; i++) {
      this.write8(addr + i, str.charCodeAt(i));
    }
  };
}

//dma.js
"use strict";

/**
 * @constructor
 */
function DMA(dev)
{
    var io = dev.io,
        memory = dev.memory,

        channels = [
            { address: 0, count: 0 },
            { address: 0, count: 0 },
            { address: 0, count: 0 },
            { address: 0, count: 0 }
        ],

        lsb_msb_flipflop = 0;

    io.register_write(0x04, port_write.bind(0, 0x04));
    io.register_write(0x05, port_write.bind(0, 0x05));
    io.register_write(0x0A, portA_write);
    io.register_write(0x0B, portB_write);
    io.register_write(0x0C, portC_write);
    io.register_write(0x81, port81_write);

    function port_write(port, data_byte)
    {
        dbg_log("port " + port + " write " + data_byte, LOG_DMA);

        if(port < 8)
        {
            var channel = port >> 1;

            if(port & 1)
            {
                channels[channel].count = flipflop_get(channels[channel].count, data_byte);
            }
            else
            {
                channels[channel].address = flipflop_get(channels[channel].address, data_byte);
            }
        }
    };

    function port_read(port)
    {
        if(port < 8)
        {
            var channel = port >> 1;

            if(port & 1)
            {
                return channels[channel].count;
            }
            else
            {
                // Bug?
                return channels[channel].address;
            }
        }
        else
        {
            dbg_log("port " + h(port) + " read", LOG_DMA);
        }
    };

    function portA_write(data_byte)
    {
        dbg_log("port A write: " + h(data_byte), LOG_DMA);
    };

    function portB_write(data_byte)
    {
        dbg_log("port B write: " + h(data_byte), LOG_DMA);
    };

    function portC_write(data_byte)
    {
        lsb_msb_flipflop = 0;
    }

    function port81_write(data_byte)
    {
        channels[2].address = channels[2].address & 0xFFFF | data_byte << 16;
    }

    // read data, write to memory
    this.do_read = function(buffer, start, len, channel, fn)
    {
        var read_count = channels[channel].count,
            addr = channels[channel].address;

        dbg_log("DMA write channel " + channel, LOG_DMA);
        dbg_log("to " + h(addr) + " len " + h(read_count), LOG_DMA);

        if(len < read_count)
        {
            dbg_log("DMA should read more than provided: " + h(len) + " " + h(read_count), LOG_DMA);
        }

        channels[channel].address += len;

        buffer.get(start, len, function(data)
        {
            memory.write_blob(data, addr);
            fn();
        });
    };

    // write data, read memory
    this.do_write = function(buffer, start, len, channel, fn)
    {
        var read_count = channels[channel].count,
            addr = channels[channel].address;

        dbg_log("DMA write channel " + channel, LOG_DMA);
        dbg_log("to " + h(addr) + " len " + h(read_count), LOG_DMA);
        dbg_log(channels[channel], LOG_DMA);

        if(len < read_count)
        {
            dbg_log("DMA should read more than provided", LOG_DMA);
        }

        buffer.set(start,
                new Uint8Array(memory.buffer, addr, read_count + 1),
                function() {
                    fn();
                }
            );
    }

    function flipflop_get(old_dword, new_byte)
    {
        lsb_msb_flipflop ^= 1;

        if(lsb_msb_flipflop)
        {
            // low byte
            return old_dword & ~0xFF | new_byte;
        }
        else
        {
            // high byte
            return old_dword & ~0xFF00 | new_byte << 8;
        }
    }
}

//pit.js
"use strict";


/**
 * @constructor
 *
 * Programmable Interval Timer
 */
function PIT(dev)
{
    var 
        io = dev.io,
        pic = dev.pic,
        
        next_tick = Date.now(),

        me = this,

        /** 
         * @const 
         * In kHz
         */
        OSCILLATOR_FREQ = 1193.1816666, // 1.193182 MHz


        counter_next_low = new Uint8Array(3),
        counter_enabled = new Uint8Array(3),
        counter_mode = new Uint8Array(3),
        counter_read_mode = new Uint8Array(3),

        // 2 = latch low, 1 = latch high, 0 = no latch
        counter_latch = new Uint8Array(3), 
        counter_latch_value = new Uint16Array(3),

        counter_reload = new Uint16Array(3),
        counter_current = new Uint16Array(3),

        // only counter2 output can be read
        counter2_out = 0;


    // TODO:
    // - counter2 can be controlled by an input
        

    this.get_timer2 = function()
    {
        //dbg_log("timer2 read", LOG_PIT);
        return counter2_out;
    };

    var parity = 0;

    io.register_read(0x61, function()
    {
        // > xxx1 xxxx  0=RAM parity error enable
        // >            PS/2: Read:  This bit tiggles for each refresh request.
        // 
        // tiggles??
        
        parity ^= 0x10;
        return parity | counter2_out << 5;
    });


    this.timer = function(time)
    {
        var current,
            mode,
            steps = (time - next_tick) * OSCILLATOR_FREQ >>> 0;

        if(!steps)
        {
            return;
        }
        dbg_assert(steps >= 0);

        next_tick += steps / OSCILLATOR_FREQ;

        // counter 0 produces interrupts
        if(counter_enabled[0])
        {
            current = counter_current[0] -= steps;

            if(current <= 0)
            {
                pic.push_irq(0);
                mode = counter_mode[0];

                if(mode === 0)
                {
                    counter_enabled[0] = 0;
                    counter_current[0] = 0;
                }
                else if(mode === 3 || mode === 2)
                {
                    counter_current[0] = counter_reload[0] + current % counter_reload[0];
                }
            }
        }

        // counter 2 has an output bit
        if(counter_enabled[2])
        {
            current = counter_current[2] -= steps;

            if(current <= 0)
            {
                mode = counter_mode[2];

                if(mode === 0)
                {
                    counter2_out = 1;
                    counter_enabled[2] = 0;
                    counter_current[2] = 0;
                }
                else if(mode === 2)
                {
                    counter2_out = 1;
                    counter_current[2] = counter_reload[2] + current % counter_reload[2];
                }
                else if(mode === 3)
                {
                    counter2_out ^= 1;
                    counter_current[2] = counter_reload[2] + current % counter_reload[2];
                }
            }
            // cannot really happen, because the counter gets changed by big numbers
            //else if(current === 1)
            //{
            //    if(counter_mode[2] === 2)
            //    {
            //        counter2_out = 0;
            //    }
            //}
        }
    }

    io.register_read(0x40, function() { return counter_read(0); });
    io.register_read(0x41, function() { return counter_read(1); });
    io.register_read(0x42, function() { return counter_read(2); });
            
    function counter_read(i) 
    { 
        var latch = counter_latch[i];

        if(latch)
        {
            counter_latch[i]--;

            if(latch === 2)
            {
                return counter_latch_value[i] & 0xFF;
            }
            else
            {
                return counter_latch_value[i] >> 8;
            }
        }
        else
        {
            var next_low = counter_next_low[i];

            if(counter_mode[i] === 3)
            {
                counter_next_low[i] ^= 1;
            }

            if(next_low)
            {
                return counter_current[i] & 0xFF;
            }
            else
            {
                return counter_current[i] >> 8;
            }
        }
    }

    io.register_write(0x40, function(value) { counter_write(0, value); });
    io.register_write(0x41, function(value) { counter_write(1, value); });
    io.register_write(0x42, function(value) { counter_write(2, value); });
            
    function counter_write(i, value) 
    { 
        if(counter_next_low[i])
        {
            counter_reload[i] = counter_reload[i] & ~0xFF | value;
        }
        else
        {
            counter_reload[i] = counter_reload[i] & 0xFF | value << 8;
        }

        if(counter_read_mode[i] !== 3 || !counter_next_low[i])
        {
            if(!counter_reload[i])
            {
                counter_reload[i] = 0xFFFF;
            }

            // depends on the mode, should actually 
            // happen on the first tick
            counter_current[i] = counter_reload[i];

            counter_enabled[i] = true;

            dbg_log("counter" + i + " reload=" + h(counter_reload[i]) + 
                " tick=" + (counter_reload[i] || 0x10000) / OSCILLATOR_FREQ + "ms", LOG_PIT);
        }

        if(counter_read_mode[i] === 3)
        {
            counter_next_low[i] ^= 1;
        }
    }

    io.register_write(0x43, port43_write);

    function port43_write(reg_byte)
    {
        var mode = reg_byte >> 1 & 7,
            binary_mode = reg_byte & 1,
            i = reg_byte >> 6 & 3,
            read_mode = reg_byte >> 4 & 3,
            next_low;

        if(i === 1)
        {
            dbg_log("Unimplemented timer1", LOG_PIT);
        }

        if(i === 3)
        {
            dbg_log("Unimplemented read back", LOG_PIT);
            return;
        }

        if(read_mode === 0)
        {
            // latch
            counter_latch[i] = 2;
            counter_latch_value[i] = counter_current[i];

            return;
        }

        if(mode >= 6)
        {
            // 6 and 7 are aliased to 2 and 3
            mode &= ~4;
        }

        dbg_log("Control: mode=" + mode + " ctr=" + i + 
                " read_mode=" + read_mode + " bcd=" + binary_mode, LOG_PIT);

        if(read_mode === 1)
        {
            // lsb
            counter_next_low[i] = 1;
        }
        else if(read_mode === 2)
        {
            // msb
            counter_next_low[i] = 0;
        }
        else
        {
            // first lsb then msb
            counter_next_low[i] = 1;
        }


        if(mode === 0)
        {
        }
        else if(mode === 3 || mode === 2)
        {
            // what is the difference 
        }
        else
        {
            dbg_log("Unimplemented counter mode: " + h(mode), LOG_PIT);
        }

        counter_mode[i] = mode;
        counter_read_mode[i] = read_mode;

        if(i === 2)
        {
            if(mode === 0)
            {
                counter2_out = 0;
            }
            else
            {
                // correct for mode 2 and 3
                counter2_out = 1;
            }
        }
    };
}


//vga.js
"use strict";


/**
 * @constructor
 */
function VGAScreen(dev, adapter)
{
    var
        io = dev.io,
        memory = dev.memory,

        /** 
         * TODO: Make this configurable
         * @const 
         */
        SVGA_MEMORY_SIZE = 128 * 64 * 1024,

        /** @const */
        MAX_XRES = 1280,

        /** @const */
        MAX_YRES = 1024,

        /** @const */
        MAX_BPP = 32,
        
        /** @type {number} */
        cursor_address = 0,

        /** @type {number} */
        cursor_scanline_start = 0xE,

        /** @type {number} */
        cursor_scanline_end = 0xF,

        /** @type {VGAScreen} */
        screen = this,

        /**
         * Number of columns in text mode
         * @type {number} 
         */
        max_cols,

        /** 
         * Number of rows in text mode
         * @type {number} 
         */
        max_rows,

        /**
         * Width in pixels in graphical mode
         * @type {number}
         */
        screen_width,

        /**
         * Height in pixels in graphical mode
         * @type {number}
         */
        screen_height,

        /**
         * video memory start address
         * @type {number}
         */
        start_address = 0,

        /** @type {boolean} */
        graphical_mode_is_linear = true,

        /** @type {boolean} */
        graphical_mode = false,

        /** @type {boolean} */
        do_complete_redraw = false,

        /* 
         * VGA palette containing 256 colors for video mode 13 etc.
         * Needs to be initialised by the BIOS
         */
        vga256_palette = new Int32Array(256),

        // 4 times 64k
        // Could be shared with SVGA memory
        vga_memory = new Uint8Array(4 * 64 * 1024),

        plane0 = new Uint8Array(vga_memory.buffer, 0 * 64 * 1024, 64 * 1024),
        plane1 = new Uint8Array(vga_memory.buffer, 1 * 64 * 1024, 64 * 1024),
        plane2 = new Uint8Array(vga_memory.buffer, 2 * 64 * 1024, 64 * 1024),
        plane3 = new Uint8Array(vga_memory.buffer, 3 * 64 * 1024, 64 * 1024),

        // VGA latches
        latch0 = 0,
        latch1 = 0,
        latch2 = 0,
        latch3 = 0,

        
        svga_memory = new Uint8Array(SVGA_MEMORY_SIZE),
        svga_enabled = false,

        /** @type {number} */
        svga_width = 0,

        /** @type {number} */
        svga_height = 0,

        /** @type {number} */
        svga_bpp = 0;


    function init()
    {
        screen.set_size_text(80, 25);
        screen.update_cursor_scanline();

        memory.mmap_register(0xA0000, 0x20000, false, vga_memory_read, vga_memory_write);

        memory.mmap_register(0xE0000000, SVGA_MEMORY_SIZE, false, svga_memory_read, svga_memory_write);
    }

    function vga_memory_read(addr)
    {
        if(!graphical_mode || graphical_mode_is_linear)
        {
            return vga_memory[addr];
        }


        // planar mode
        addr &= 0xFFFF;

        latch0 = plane0[addr];
        latch1 = plane1[addr];
        latch2 = plane2[addr];
        latch3 = plane3[addr];

        return vga_memory[plane_read << 16 | addr];
    }

    function vga_memory_write(addr, value)
    {
        if(graphical_mode)
        {
            if(graphical_mode_is_linear)
            {
                vga_memory_write_graphical_linear(addr, value);
            }
            else
            {
                vga_memory_write_graphical_planar(addr, value);
            }
        }
        else
        {
            vga_memory_write_text_mode(addr, value);
        }
    }

    function vga_memory_write_graphical_linear(addr, value)
    {
        var offset = addr << 2,
            color = vga256_palette[value];

        adapter.put_pixel_linear(offset | 2, color >> 16 & 0xFF);
        adapter.put_pixel_linear(offset | 1, color >> 8 & 0xFF);
        adapter.put_pixel_linear(offset, color & 0xFF);

        vga_memory[addr] = value;
    }

    function vga_memory_write_graphical_planar(addr, value)
    {
        if(addr > 0xFFFF)
        {
            return;
        }

        // TODO:
        // Replace 4 byte operations with single double word operations

        var write,
            plane0_byte,
            plane1_byte,
            plane2_byte,
            plane3_byte;

        // not implemented
        dbg_assert((planar_rotate_reg & 7) === 0);
        dbg_assert(planar_mode < 3);
        
        if(planar_mode === 0)
        {
            plane0_byte = plane1_byte = plane2_byte = plane3_byte = value;
        }
        else if(planar_mode === 2)
        {
            if(plane_write_bm & 1)
            {
                write = value & 1 ? 0xFF : 0;
                plane0_byte = latch0 & ~planar_bitmap | write & planar_bitmap;
            }
            if(plane_write_bm & 2)
            {
                write = value & 2 ? 0xFF : 0;
                plane1_byte = latch1 & ~planar_bitmap | write & planar_bitmap;
            }
            if(plane_write_bm & 4)
            {
                write = value & 4 ? 0xFF : 0;
                plane2_byte = latch2 & ~planar_bitmap | write & planar_bitmap;
            }
            if(plane_write_bm & 8)
            {
                write = value & 8 ? 0xFF : 0;
                plane3_byte = latch3 & ~planar_bitmap | write & planar_bitmap;
            }
        }

        if(planar_mode === 0 || planar_mode === 2)
        {
            switch(planar_rotate_reg & 0x18)
            {
                case 0x08:
                    plane0_byte &= latch0;
                    plane1_byte &= latch1;
                    plane2_byte &= latch2;
                    plane3_byte &= latch3;
                    break;
                case 0x10:
                    plane0_byte |= latch0;
                    plane1_byte |= latch1;
                    plane2_byte |= latch2;
                    plane3_byte |= latch3;
                    break;
                case 0x18:
                    plane0_byte ^= latch0;
                    plane1_byte ^= latch1;
                    plane2_byte ^= latch2;
                    plane3_byte ^= latch3;
                    break;
            }

            if(plane_write_bm & 1)
            {
                plane0_byte = latch0 & ~planar_bitmap | plane0_byte & planar_bitmap;
            }
            if(plane_write_bm & 2)
            {
                plane1_byte = latch1 & ~planar_bitmap | plane1_byte & planar_bitmap;
            }
            if(plane_write_bm & 4)
            {
                plane2_byte = latch2 & ~planar_bitmap | plane2_byte & planar_bitmap;
            }
            if(plane_write_bm & 8)
            {
                plane3_byte = latch3 & ~planar_bitmap | plane3_byte & planar_bitmap;
            }
        }
        else if(planar_mode === 1)
        {
            plane0_byte = latch0;
            plane1_byte = latch1;
            plane2_byte = latch2;
            plane3_byte = latch3;
        }

        if(plane_write_bm & 1)
        {
            plane0[addr] = plane0_byte;
        }
        else
        {
            plane0_byte = plane0[addr];
        }
        if(plane_write_bm & 2)
        {
            plane1[addr] = plane1_byte;
        }
        else
        {
            plane1_byte = plane1[addr];
        }
        if(plane_write_bm & 4)
        {
            plane2[addr] = plane2_byte;
        }
        else
        {
            plane2_byte = plane2[addr];
        }
        if(plane_write_bm & 8)
        {
            plane3[addr] = plane3_byte;
        }
        else
        {
            plane3_byte = plane3[addr];
        }

        if(addr >= (screen_width * screen_height << 3))
        {
            return;
        }

        // Shift these, so that the bits for the color are in 
        // the correct position in the while loop
        plane1_byte <<= 1;
        plane2_byte <<= 2;
        plane3_byte <<= 3;

        // 8 pixels per byte, we start at high (addr << 3 | 7)
        // << 2 because we're using put_pixel_linear
        var offset = (addr << 3 | 7) << 2;

        for(var i = 0; i < 8; i++)
        {
            var color_index = 
                    plane0_byte >> i & 1 |
                    plane1_byte >> i & 2 |
                    plane2_byte >> i & 4 |
                    plane3_byte >> i & 8,
                color = vga256_palette[dac_map[color_index]];

            adapter.put_pixel_linear(offset | 2, color >> 16);
            adapter.put_pixel_linear(offset | 1, color >> 8 & 0xFF);
            adapter.put_pixel_linear(offset, color & 0xFF);

            offset -= 4;
        }
    }

    function text_mode_redraw()
    {
        var addr = 0x18000 | start_address << 1,
            chr,
            color;

        for(var row = 0; row < max_rows; row++)
        {
            for(var col = 0; col < max_cols; col++)
            {
                chr = vga_memory[addr];
                color = vga_memory[addr | 1];

                adapter.put_char(row, col, chr, 
                    vga256_palette[color >> 4 & 0xF], vga256_palette[color & 0xF]);

                addr += 2;
            }
        }
    }

    function graphical_linear_redraw()
    {
        // TODO
    }

    function graphical_planar_redraw()
    {
        var addr = 0,
            color;

        for(var y = 0; y < screen_height; y++)
        {
            for(var x = 0; x < screen_width; x += 8)
            {
                for(var i = 0; i < 8; i++)
                {
                    color = 
                        plane0[addr] >> i & 1 |
                        plane1[addr] >> i << 1 & 2 |
                        plane2[addr] >> i << 2 & 4 |
                        plane3[addr] >> i << 3 & 8;

                    adapter.put_pixel(x + 7 - i, y, vga256_palette[dac_map[color]]);
                }

                addr++;
            }
        }
    }

    function vga_memory_write_text_mode(addr, value)
    {
        if(addr < 0x18000)
        {
            return;
        }

        var memory_start = (addr - 0x18000 >> 1) - start_address,
            row = memory_start / max_cols | 0,
            col = memory_start % max_cols,
            chr,
            color;

        if(addr & 1)
        {
            color = value;
            chr = vga_memory[addr & ~1];
        }
        else
        {
            chr = value;
            color = vga_memory[addr | 1];
        }

        adapter.put_char(row, col, chr, 
                vga256_palette[color >> 4 & 0xF], vga256_palette[color & 0xF]);

        vga_memory[addr] = value;
    }

    function update_cursor()
    {
        var row = (cursor_address - start_address) / max_cols | 0,
            col = (cursor_address - start_address) % max_cols;

        row = Math.min(max_rows - 1, row);

        adapter.update_cursor(row, col);
    }


    function svga_memory_read(addr)
    {
        return svga_memory[addr];
    }

    function svga_memory_write(addr, value)
    {
        svga_memory[addr] = value;

        switch(svga_bpp)
        {
            case 32:
                if((addr & 3) === 3)
                {
                    // 4th byte is meaningless
                    return;
                }

                adapter.put_pixel_linear(addr, value);
                break;

            case 24:
                addr = addr * (4/3) | 0;
                adapter.put_pixel_linear(addr, value);
                break;

            case 16:
                if(addr & 1)
                {
                    var prev = svga_memory[addr ^ 1],
                        green = prev >> 5 & 0x07 | value << 3 & 0x38,
                        blue = value >> 3 & 0x1F;

                    blue = blue * 0xFF / 0x1F | 0;
                    green = green * 0xFF / 0x3F | 0;

                    addr <<= 1;

                    adapter.put_pixel_linear(addr - 1, green);
                    adapter.put_pixel_linear(addr - 2, blue);
                }
                else
                {
                    var red = value & 0x1F;
                    red = red * 0xFF / 0x1F | 0;

                    adapter.put_pixel_linear((addr << 1) + 2, red);
                }
                break;

            default:
                if(DEBUG)
                {
                    throw "SVGA: Unsupported BPP: " + svga_bpp;
                }
        }
    }

    this.timer = function(time)
    {
        if(do_complete_redraw)
        {
            do_complete_redraw = false;

            if(graphical_mode)
            {
                if(graphical_mode_is_linear)
                {
                    graphical_linear_redraw();
                }
                else 
                {
                    graphical_planar_redraw();
                }
            }
            else
            {
                text_mode_redraw();
            }
        }

        if(graphical_mode || svga_enabled)
        {
            adapter.timer_graphical();
        }
        else
        {
            adapter.timer_text();
        }
    };

    /**
     * @param {number} cols_count 
     * @param {number} rows_count 
     */
    this.set_size_text = function(cols_count, rows_count)
    {
        max_cols = cols_count;
        max_rows = rows_count;

        adapter.set_size_text(cols_count, rows_count);
    };

    this.set_size_graphical = function(width, height)
    {
        adapter.set_size_graphical(width, height);
    }

    this.update_cursor_scanline = function()
    {
        adapter.update_cursor_scanline(cursor_scanline_start, cursor_scanline_end);
    };

    this.clear_screen = function()
    {
        adapter.clear_screen();
    };

    this.set_video_mode = function(mode)
    {
        var is_graphical = false;

        switch(mode)
        {
            case 0x03:
                this.set_size_text(80, 25);
                break;
            case 0x10:
                this.set_size_graphical(640, 350);
                screen_width = 640;
                screen_height = 350;
                is_graphical = true;
                graphical_mode_is_linear = false;
                break;
            case 0x12:
                this.set_size_graphical(640, 480);
                screen_width = 640;
                screen_height = 480;
                is_graphical = true;
                graphical_mode_is_linear = false;
                break;
            case 0x13:
                this.set_size_graphical(320, 200);
                screen_width = 320;
                screen_height = 200;
                is_graphical = true;
                graphical_mode_is_linear = true;
                break;
            default:
        }

        adapter.set_mode(is_graphical);

        graphical_mode = is_graphical;

        dbg_log("Current video mode: " + h(mode), LOG_VGA);
    };

    this.destroy = function()
    {

    };

    var index_crtc = 0,
        index_dac = 0,
        index_attribute = 0;


    // index for setting colors through port 3C9h
    var dac_color_index = 0;

    function port3C7_write(index)
    {
        // index for reading the DAC
        dbg_log("3C7 write: " + h(index), LOG_VGA);
    };
    io.register_write(0x3C7, port3C7_write);

    function port3C8_write(index)
    {
        dac_color_index = index * 3;
    };
    io.register_write(0x3C8, port3C8_write);


    function port3C9_write(color_byte)
    {
        var index = dac_color_index / 3 | 0,
            offset = dac_color_index % 3,
            color = vga256_palette[index];

        color_byte = color_byte << 2 & 0xFF | 3;

        if(offset === 0)
        {
            color = color & ~0xFF0000 | color_byte << 16;
        }
        else if(offset === 1)
        {
            color = color & ~0xFF00 | color_byte << 8;
        }
        else
        {
            color = color & ~0xFF | color_byte;
            dbg_log("dac set color, index=" + h(index) + " value=" + h(color), LOG_VGA);
        }

        vga256_palette[index] = color;

        dac_color_index++;

        do_complete_redraw = true;
    }
    io.register_write(0x3C9, port3C9_write);

    function port3D4_write(register)
    {
        index_crtc = register;
    };
    io.register_write(0x3D4, port3D4_write);

    function port3D5_write(value)
    {
        switch(index_crtc)
        {
            case 0x2:
                screen.set_size_text(value, 25);
                break;
            case 0xA:
                cursor_scanline_start = value;
                screen.update_cursor_scanline();
                break;
            case 0xB:
                cursor_scanline_end = value;
                screen.update_cursor_scanline();
                break;
            case 0xC:
                start_address = start_address & 0xff | value << 8;
                do_complete_redraw = true;
                break;
            case 0xD:
                start_address = start_address & 0xff00 | value;
                do_complete_redraw = true;
                //dbg_log("start addr: " + h(start_address, 4), LOG_VGA);
                break;
            case 0xE:
                cursor_address = cursor_address & 0xFF | value << 8;
                update_cursor();
                break;
            case 0xF:
                cursor_address = cursor_address & 0xFF00 | value;
                update_cursor();
                break;
            default:
                dbg_log("3D5 / CRTC write " + h(index_crtc) + ": " + h(value), LOG_VGA);
        }

    };
    io.register_write(0x3D5, port3D5_write);

    function port3D5_read()
    {
        if(index_crtc === 0xA)
        {
            return cursor_scanline_start;
        }
        else if(index_crtc === 0xB)
        {
            return cursor_scanline_end;
        }
        else if(index_crtc === 0xE)
        {
            return cursor_address >> 8;
        }
        else if(index_crtc === 0xF)
        {
            return cursor_address & 0xFF;
        }

        dbg_log("3D5 read " + h(index_crtc), LOG_VGA);
        return 0;
    };
    io.register_read(0x3D5, port3D5_read);

    var miscellaneous_output_register = 0xff;

    function port3CC_read()
    {
        return miscellaneous_output_register;
    }
    io.register_read(0x3CC, port3CC_read);

    function port3C2_write(value)
    {
        dbg_log("3C2 / miscellaneous output register = " + h(value), LOG_VGA);
        miscellaneous_output_register = value;

        // cheat way to figure out which video mode is indended to be used
        switch_video_mode(value);
    }
    io.register_write(0x3C2, port3C2_write);


    function port3DA_read()
    {
        // status register
        attribute_controller_index = -1;
        return 0xff;
    }
    io.register_read(0x3DA, port3DA_read);


    var attribute_controller_index = -1;

    function port3C1_read()
    {
        attribute_controller_index = -1;

        dbg_log("3C1 / attribute controller read " + h(attribute_controller_index), LOG_VGA);
        return -1;
    }
    io.register_read(0x3C1, port3C1_read);

    var dac_map = new Uint8Array(0x10);

    function port3C0_write(value)
    {
        if(attribute_controller_index === -1)
        {
            attribute_controller_index = value;
        }
        else
        {
            if(attribute_controller_index < 0x10)
            {
                dac_map[attribute_controller_index] = value;
            }
            else
            switch(attribute_controller_index)
            {
                default:
                    dbg_log("3C0 / attribute controller write " + h(attribute_controller_index) + ": " + h(value), LOG_VGA);
            }

            attribute_controller_index = -1;

        }
    }
    io.register_write(0x3C0, port3C0_write);

    function port3C0_read()
    {
        dbg_log("3C0 read", LOG_VGA);
        var result = attribute_controller_index;
        attribute_controller_index = -1;
        return result;
    }
    io.register_read(0x3C0, port3C0_read);

    
    var sequencer_index = -1;

    function port3C4_write(value)
    {
        sequencer_index = value;
    }
    io.register_write(0x3C4, port3C4_write);


    var 
        // bitmap of planes 0-3
        plane_write_bm = 0xF,
        sequencer_memory_mode = 0
        ; 

    function port3C5_write(value)
    {
        switch(sequencer_index)
        {
            case 0x02:
                //dbg_log("plane write mask: " + h(value), LOG_VGA);
                plane_write_bm = value;
                break;
            case 0x04:
                dbg_log("sequencer memory mode: " + h(value), LOG_VGA);
                sequencer_memory_mode = value;
                break;
            default:
                dbg_log("3C5 / sequencer write " + h(sequencer_index) + ": " + h(value), LOG_VGA);
        }
    }
    io.register_write(0x3C5, port3C5_write);


    function port3C5_read()
    {
        switch(sequencer_index)
        {
            case 0x06:
                return 0x12;
                break;
            default:
                dbg_log("3C5 / sequencer read " + h(sequencer_index), LOG_VGA);
        }
    }
    io.register_read(0x3C5, port3C5_read);


    var graphics_index = -1;

    function port3CE_write(value)
    {
        graphics_index = value;
    }
    io.register_write(0x3CE, port3CE_write);

    var plane_read = 0, // value 0-3, which plane to read
        planar_mode = 0,
        planar_rotate_reg = 0,
        planar_bitmap = 0xFF;

    function port3CF_write(value)
    {
        switch(graphics_index)
        {
            // TODO: Set/Reset bit
            //case 0:
            //case 1:
                //break;
            case 3:
                planar_rotate_reg = value;
                dbg_log("plane rotate: " + h(value), LOG_VGA);
                break;
            case 4:
                plane_read = value;
                dbg_assert(value < 4);
                dbg_log("plane read: " + h(value), LOG_VGA);
                break;
            case 5:
                planar_mode = value;
                dbg_log("planar mode: " + h(value), LOG_VGA);
                break;
            case 8:
                planar_bitmap = value;
                //dbg_log("planar bitmap: " + h(value), LOG_VGA);
                break;
            default:
                dbg_log("3CF / graphics write " + h(graphics_index) + ": " + h(value), LOG_VGA);
        }
    }
    io.register_write(0x3CF, port3CF_write);


    function switch_video_mode(mar)
    {
        // Cheap way to figure this out, using the Miscellaneous Output Register 
        // See: http://wiki.osdev.org/VGA_Hardware#List_of_register_settings

        if(mar === 0x67)
        {
            screen.set_video_mode(0x3);
        }
        else if(mar === 0xE3)
        {
            // also mode X
            screen.set_video_mode(0x12);
        }
        else if(mar === 0x63)
        {
            screen.set_video_mode(0x13);
        }
        else if(mar === 0xA3)
        {
            screen.set_video_mode(0x10);
        }
        else
        {
            dbg_log("Unkown MAR value: " + h(mar, 2) + ", going back to text mode", LOG_VGA);
            screen.set_video_mode(0x3);
        }
    }


    // Bochs VBE Extensions
    // http://wiki.osdev.org/Bochs_VBE_Extensions
    var dispi_index = -1,
        dispi_value = -1,
        read_index = true;

    function port1CE_write(value)
    {
        dispi_index = value;
        read_index = true;
    }
    io.register_write(0x1CE, port1CE_write);

    function port1CF_write(value)
    {
        if(read_index)
        {
            dispi_index |= value << 8;
            read_index = false
            return;
        }

        read_index = true;

        dispi_value = value;
        switch(dispi_index)
        {
            default:
                dbg_log("1CF / dispi write low " + h(dispi_index) + ": " + h(value), LOG_VGA);
        }
    }
    io.register_write(0x1CF, port1CF_write);

    function port1D0_write(value)
    {
        dbg_log("1D0 / dispi write high " + h(dispi_index) + ": " + h(value), LOG_VGA);
        dispi_value |= value << 8;

        switch(dispi_index)
        {
            case 1:
                svga_width = dispi_value;
                break;
            case 2:
                svga_height = dispi_value;
                break;
            case 3:
                svga_bpp = dispi_value;
                break;
            case 4:
                // enable, options
                svga_enabled = (dispi_value & 1) === 1;
                break;
            default:
        }

        dbg_log("SVGA: enabled=" + svga_enabled + ", " + svga_width + "x" + svga_height + "x" + svga_bpp, LOG_VGA);

        if(svga_enabled)
        {
            screen.set_size_graphical(svga_width, svga_height);
            adapter.set_mode(true);
        }
    }
    io.register_write(0x1D0, port1D0_write);


    function port1CF_read()
    {
        switch(dispi_index)
        {
            case 0:
                // id
                return 0xC0;
            case 1:
                return MAX_XRES;
            case 2:
                return MAX_YRES;
            case 3:
                return MAX_BPP;
            case 0x0A:
                // memory size in 64 kilobyte banks
                return SVGA_MEMORY_SIZE / 64 / 1024;
            default:
        }
        dbg_log("1CF / dispi read low " + h(dispi_index), LOG_VGA);
    }
    io.register_read(0x1CF, port1CF_read);

    function port1D0_read()
    {
        switch(dispi_index)
        {
            case 0:
                // id
                return 0xB0;
            case 1:
                return MAX_XRES >> 8;
            case 2:
                return MAX_YRES >> 8;
            case 3:
                return MAX_BPP >> 8;
            case 0x0A:
                return SVGA_MEMORY_SIZE / 64 / 1024 >> 8;
            default:
        }
        dbg_log("1D0 / dispi read high " + h(dispi_index), LOG_VGA);
    }
    io.register_read(0x1D0, port1D0_read);

    init();
}


//ps2.js
"use strict";

/**
 * @constructor
 */
function PS2(dev, keyboard, mouse)
{
    var 
        io = dev.io,
        pic = dev.pic,

        me = this,

        /** @type {boolean} */
        enable_mouse_stream = false,
        /** @type {boolean} */
        enable_mouse = false,

        /** @type {boolean} */
        have_mouse = false,

        /** @type {number} */
        mouse_delta_x = 0,
        /** @type {number} */
        mouse_delta_y = 0,
        /** @type {number} */
        mouse_clicks = 0,

        /** @type {boolean} */
        have_keyboard = false,

        /** @type {boolean} */
        next_is_mouse_command = false,

        /** @type {boolean} */
        next_read_sample = false,

        /** @type {boolean} */
        next_read_led = false,

        /** 
         * @type {Array.<number>} 
         */
        kbd_buffer = [],

        /** @type {number} */
        sample_rate = 100,

        /** @type {number} */
        last_mouse_packet = -1,

        /** 
         * @type {Array.<number>} 
         */
        mouse_buffer = [];


    if(keyboard)
    {
        have_keyboard = true;
        keyboard.init(kbd_send_code);
    }

    if(mouse)
    {
        have_mouse = true;
        mouse.init(mouse_send_click, mouse_send_delta);

        // TODO: Mouse Wheel
        // http://www.computer-engineering.org/ps2mouse/
    }


    function mouse_irq()
    {
        pic.push_irq(12);
    }

    function kbd_irq()
    {
        pic.push_irq(1);
    }


    function kbd_send_code(code)
    {
        //console.log(h(code));
        kbd_buffer.push(code);
        kbd_irq();
    }
    this.kbd_send_code = kbd_send_code;

    function mouse_send_delta(delta_x, delta_y)
    {
        if(have_mouse && enable_mouse)
        {
            mouse_delta_x += delta_x;
            mouse_delta_y += delta_y;

            if(enable_mouse_stream)
            {
                var now = Date.now();

                if(now - last_mouse_packet < 1000 / sample_rate)
                {
                    // TODO: set timeout
                    return;
                }

                last_mouse_packet = now;

                send_mouse_packet();
            }
        }
    }

    function mouse_send_click(left, middle, right)
    {
        if(have_mouse && enable_mouse)
        {
            mouse_clicks = left | right << 1 | middle << 2;

            if(enable_mouse_stream)
            {
                send_mouse_packet();
            }
        }
    }

    function send_mouse_packet()
    {
        var info_byte = 
                (mouse_delta_y < 0) << 5 |
                (mouse_delta_x < 0) << 4 |
                1 << 3 | 
                mouse_clicks;

        mouse_buffer.push(
            info_byte, 
            mouse_delta_x & 0xFF,
            mouse_delta_y & 0xFF
        );

        if(mouse_buffer.length > 15)
        {
            var off = mouse_buffer.length % 3;
            mouse_buffer = mouse_buffer.slice(0, off).concat(mouse_buffer.slice(off + 3));
        }

        mouse_delta_x = 0;
        mouse_delta_y = 0;

        mouse_irq();
    }

    this.destroy = function()
    {
        if(have_keyboard)
        {
            keyboard.destroy();
        }

        if(have_mouse)
        {
            mouse.destroy();
        }
    };
        

    var command_register = 0,
        read_output_register = false,
        read_command_register = false;


    io.register_read(0x60, port60_read);
    io.register_read(0x64, port64_read);

    io.register_write(0x60, port60_write);
    io.register_write(0x64, port64_write);

    function port60_read()
    {
        //log("port 60 read: " + (buffer[0] || "(none)"));

        if(!kbd_buffer.length && !mouse_buffer.length)
        {
            // should not happen
            dbg_log("Port 60 read: Empty", LOG_PS2);
            return 0xFF;
        }

        var do_mouse_buffer;

        if(kbd_buffer.length && mouse_buffer.length)
        {
            // tough decision, let's ask the PIC
            do_mouse_buffer = (pic.get_isr() & 2) === 0;
        }
        else if(kbd_buffer.length)
        {
            do_mouse_buffer = false;
        }
        else
        {
            do_mouse_buffer = true;
        }


        if(do_mouse_buffer)
        {
            dbg_log("Port 60 read (mouse): " + h(mouse_buffer[0]), LOG_PS2);

            if(mouse_buffer.length > 1)
            {
                mouse_irq();
            }

            return mouse_buffer.shift();
        }
        else
        {
            dbg_log("Port 60 read (kbd)  : " + h(kbd_buffer[0]), LOG_PS2);

            if(kbd_buffer.length > 1)
            {
                kbd_irq();
            }

            return kbd_buffer.shift();
        }
    };

    function port64_read()
    {
        // status port 
        //dbg_log("port 64 read", LOG_PS2);

        var status_byte = 0x10;

        if(mouse_buffer.length || kbd_buffer.length)
        {
            status_byte |= 1;
        }
        if(mouse_buffer.length)
        {
            status_byte |= 0x20;
        }

        return status_byte;
    };

    function port60_write(write_byte)
    {
        if(read_command_register)
        {
            command_register = write_byte;
            read_command_register = false;

            dbg_log("Keyboard command register = " + h(command_register), LOG_PS2);
        }
        else if(read_output_register)
        {
            read_output_register = false;
            mouse_buffer = [write_byte];
            mouse_irq();
        }
        else if(next_read_sample)
        {
            next_read_sample = false;
            mouse_buffer = [0xFA];

            sample_rate = write_byte;
            mouse_irq();
        }
        else if(next_read_led)
        {
            // nope
            next_read_led = false;
        }
        else if(next_is_mouse_command)
        {
            dbg_log("Port 60 data register write: " + h(write_byte), LOG_PS2); 

            if(!have_mouse)
            {
                return;
            }

            // send ack
            mouse_buffer = [0xFA];

            if(write_byte === 0xFF)
            {
                // reset, send completion code
                mouse_buffer.push(0xAA, 0x00);

                enable_mouse = true;
                mouse.enabled = true;
            }
            else if(write_byte === 0xF2)
            {
                //  MouseID Byte
                mouse_buffer.push(0, 0);
            }
            else if(write_byte === 0xF3)
            {
                // sample rate
                next_read_sample = true;
            }
            else if(write_byte === 0xF4)
            {
                // enable streaming

                enable_mouse_stream = true;
                enable_mouse = true;

                mouse.enabled = true;
            }
            else if(write_byte === 0xF5)
            {
                // disable streaming
                enable_mouse_stream = true;
            }
            else if(write_byte === 0xF6)
            {
                // reset defaults 
                enable_mouse_stream = false;
                sample_rate = 100;

                // ... resolution, scaling
            }
            else if(write_byte === 0xEB)
            {
                // request single packet
                dbg_log("unimplemented request single packet");
            }
            else 
            {
                dbg_log("new mouse command: " + h(write_byte), LOG_PS2);
            }

            mouse_irq();
        }
        else 
        {
            dbg_log("Port 60 data register write: " + h(write_byte), LOG_PS2); 

            // send ack
            kbd_buffer.push(0xFA);

            if(write_byte === 0xFF)
            {
                kbd_buffer.push(0xAA, 0x00);
            }
            else if(write_byte === 0xF2)
            {
                // identify
                kbd_buffer.push(0xAB, 83);
            }
            else if(write_byte === 0xF4)
            {
                // enable scanning
            }
            else if(write_byte === 0xF5)
            {
                // disable scanning
            }
            else if(write_byte === 0xED)
            {
                next_read_led = true;
            }
            
            kbd_irq();
        }
    };

    function port64_write(write_byte)
    {
        dbg_log("port 64 write: " + h(write_byte), LOG_PS2);

        if(write_byte === 0xFE)
        {
            dbg_log("CPU reboot via PS2");
            dev.reboot();
        }
        else if(write_byte === 0x20)
        {
            kbd_buffer.push(command_register);
            kbd_irq();
        }
        else if(write_byte === 0x60)
        {
            read_command_register = true;
        }
        else if(write_byte === 0xD3)
        {
            read_output_register = true;
        }
        else if(write_byte === 0xD4)
        {
            next_is_mouse_command = true;
        }
        else if(write_byte === 0xA9)
        {
            // test second ps/2 port
            kbd_buffer = [0];
            kbd_irq();
        }
        else if(write_byte === 0xAA)
        {
            kbd_buffer = [0x55];
            kbd_irq();
        }
        else if(write_byte === 0xAB)
        {
            kbd_buffer = [0];
            kbd_irq();
        }
        /*else if(write_byte === 0xAE)
        {
            // not sure if right ...
            kbd_buffer =[];
        }*/
        else
        {
            dbg_log("port 64: New command byte: " + h(write_byte), LOG_PS2);
        }
    };
}




//pic.js
"use strict";

/** 
 * Programmable Interrupt Controller
 * http://stanislavs.org/helppc/8259.html
 *
 * @constructor
 * @param {PIC=} master
 */
function PIC(dev, call_interrupt_vector, handle_irqs, master)
{
    var 
        io = dev.io,

        /** 
         * all irqs off
         * @type {number}
         */
        irq_mask = 0,

        /**
         * @type {number}
         *
         * Bogus default value (both master and slave mapped to 0).
         * Will be initialized by the BIOS
         */
        irq_map = 0,

        /**
         * in-service register
         * Holds interrupts that are currently being serviced
         * @type {number}
         */
        isr = 0,

        /**
         * interrupt request register
         * Holds interrupts that have been requested
         * @type {number}
         */
        irr = 0,

        is_master = master === undefined,

        slave,

        me = this;

    if(is_master)
    {
        slave = new PIC(dev, call_interrupt_vector, handle_irqs, this);

        this.handle_irqs = function()
        {
            var enabled_irr = irr & irq_mask;

            if(!enabled_irr)
            {
                return false
            }

            var irq = enabled_irr & -enabled_irr;

            if(isr && (isr & -isr) <= irq)
            {
                // wait for eoi of higher or same priority interrupt
                return false;
            }

            irr &= ~irq;
            isr |= irq;

            if(irq === 4)
            {
                // this should always return true
                return slave.handle_irqs();
            }

            call_interrupt_vector(irq_map + log2_table[irq], false, false);

            return true;
        };
    }
    else
    {
        // is slave
        this.handle_irqs = function()
        {
            var enabled_irr = irr & irq_mask;

            if(!enabled_irr)
            {
                return false;
            }

            var irq = enabled_irr & -enabled_irr;

            if(isr && (isr & -isr) <= irq)
            {
                // wait for eoi of higher or same priority interrupt
                return false;
            }

            irr &= ~irq;
            isr |= irq;

            call_interrupt_vector(irq_map + log2_table[irq], false, false);

            if(irr)
            {
                // tell the master we have one more
                master.push_irq(2);
            }

            return true;
        };
    }

    this.dump = function()
    {
        dbg_log("mask: " + h(irq_mask & 0xFF), LOG_PIC);
        dbg_log("base: " + h(irq_map), LOG_PIC);
        dbg_log("requested: " + h(irr), LOG_PIC);
        dbg_log("serviced: " + h(isr), LOG_PIC);

        if(is_master)
        {
            slave.dump();
        }
    };


    var expect_icw4,
        state = 0,
        read_irr = 1,
        io_base,
        auto_eoi;


    if(is_master)
    {
        io_base = 0x20;
    }
    else
    {
        io_base = 0xA0;
    }

    io.register_write(io_base, port20_write);
    io.register_read(io_base, port20_read);

    io.register_write(io_base | 1, port21_write);
    io.register_read(io_base | 1, port21_read);

    function port20_write(data_byte)
    {
        //dbg_log("20 write: " + h(data_byte), LOG_PIC);
        if(data_byte & 0x10) // xxxx1xxx
        {
            // icw1
            dbg_log("icw1 = " + h(data_byte), LOG_PIC);
            expect_icw4 = data_byte & 1;
            state = 1;
        }
        else if(data_byte & 8) // xxx01xxx
        {
            // ocw3
            dbg_log("ocw3: " + h(data_byte), LOG_PIC);
            read_irr = data_byte & 1;
        }
        else // xxx00xxx
        {
            // ocw2
            // end of interrupt
            //dbg_log("ocw2: " + h(data_byte), LOG_PIC);

            var eoi_type = data_byte >> 5;

            if(eoi_type === 1)
            {
                // non-specific eoi
                isr = 0;
            }
            else if(eoi_type === 3)
            {
                // specific eoi
                isr &= ~(1 << (data_byte & 7));
            }
            else
            {
                dbg_log("Unknown eoi: " + h(data_byte), LOG_PIC);
            }
        }
    };

    function port20_read()
    {
        if(read_irr)
        {
            return irr;
        }
        else
        {
            return isr;
        }
    }

    function port21_write(data_byte)
    {
        //dbg_log("21 write: " + h(data_byte), LOG_PIC);
        if(state === 0)
        {
            if(expect_icw4)
            {
                // icw4
                expect_icw4 = false;
                auto_eoi = data_byte & 2;
                dbg_log("icw4: " + h(data_byte), LOG_PIC);
            }
            else
            {
                // ocw1
                irq_mask = ~data_byte;
                //dbg_log("interrupt mask: " + (irq_mask & 0xFFFF).toString(2) + " / map " + h(irq_map), LOG_PIC);
            }
        }
        else if(state === 1)
        {
            // icw2
            irq_map = data_byte;
            dbg_log("interrupts are mapped to " + h(irq_map) +
                    " (" + (is_master ? "master" : "slave") + ")", LOG_PIC);
            state++;
        }
        else if(state === 2)
        {
            // icw3
            state = 0;
            dbg_log("icw3: " + h(data_byte), LOG_PIC);
        }
    };

    function port21_read()
    {
        //dbg_log("21h read (" + h(irq_map) + ")", LOG_PIC);
        return ~irq_mask;
    };

    if(is_master)
    {
        this.push_irq = function(irq_number)
        {
            dbg_assert(irq_number >= 0 && irq_number < 16);

            if(irq_number >= 8)
            {
                slave.push_irq(irq_number - 8);
                irq_number = 2;
            }

            irr |= 1 << irq_number;

            handle_irqs();
        };
    }
    else
    {
        this.push_irq = function(irq_number)
        {
            dbg_assert(irq_number >= 0 && irq_number < 8);

            irr |= 1 << irq_number;
        };
    }

    this.get_isr = function()
    {
        return isr;
    };
}

//rtc.js
/**
 * RTC (real time clock) and CMOS
 * @constructor
 */
function RTC(dev, diskette_type)
{
    var 
        io = dev.io,
        pic = dev.pic,

        cmos_index = 0,
        me = this,
        
        // used for cmos entries
        rtc_time = Date.now(),
        last_update = rtc_time,

        // used for periodic interrupt
        next_interrupt,

        periodic_interrupt = false,

        // corresponds to default value for cmos_a
        periodic_interrupt_time = 1000 / 1024;


    var cmos_a = 0x26,
        cmos_b = 2;

    this.nmi_disabled = 0;

    this.timer = function(time)
    {
        if(periodic_interrupt)
        {
            while(next_interrupt < time)
            {
                next_interrupt += periodic_interrupt_time;

                pic.push_irq(8);
            }
        }

        rtc_time += time - last_update;
        last_update = time;
    };

    io.register_write(0x70, function(out_byte)
    {
        cmos_index = out_byte & 0x7F;
        me.nmi_disabled = out_byte >> 7;
    });

    io.register_write(0x71, cmos_write);
    io.register_read(0x71, cmos_read);

    function encode_time(t)
    {
        if(cmos_b & 4)
        {
            // binary mode
            return t;
        }
        else
        {
            return Math.bcd_pack(t);
        }
    }
    

    // TODO
    // - interrupt on update
    // - countdown
    // - letting bios/os set values
    // (none of these are used by seabios or the OSes we're 
    // currently testing)
    function cmos_read()
    {
        var index = cmos_index;

        cmos_index = 0xD;

        switch(index)
        {
            case 0:
                return encode_time(new Date(rtc_time).getUTCSeconds());
            case 2:
                return encode_time(new Date(rtc_time).getUTCMinutes());
            case 4:
                // TODO: 12 hour mode
                return encode_time(new Date(rtc_time).getUTCHours());
            case 7:
                return encode_time(new Date(rtc_time).getUTCDate());
            case 8:
                return encode_time(new Date(rtc_time).getUTCMonth() + 1);
            case 9:
                return encode_time(new Date(rtc_time).getUTCFullYear() % 100);

            case 0xA:
                return cmos_a;
            case 0xB:
                //dbg_log("cmos read from index " + h(index));
                return cmos_b;

            case 0xE:
                // post info
                return 0;
            case 0xC:
                //dbg_log("cmos read from index " + h(index));
                // TODO:
                // It is important to know that upon a IRQ 8, Status Register C
                // will contain a bitmask telling which interrupt happened.
                // What is important is that if register C is not read after an
                // IRQ 8, then the interrupt will not happen again. 

                //dbg_log("cmos Ch read");
                return 0;
                // Missing IRQF flag
                //return cmos_b & 0x70;

            case 0xF:
                return 0;

            case 0x10:
                // floppy type
                return diskette_type;

            case 0x14:
                // equipment
                return 0x2D;

            case 0x32:
                return encode_time(new Date(rtc_time).getUTCFullYear() / 100 | 0);

            case 0x34:
                return (memory_size - 16 * 1024 * 1024) >> 16 & 0xff;
            case 0x35:
                return (memory_size - 16 * 1024 * 1024) >> 24 & 0xff;

            case 0x38:
                // used by seabios to determine the boot order
                // bootflag 1, high nibble, lowest priority
                return 0x30; // hd
            case 0x3D:
                // bootflag 2, both nibbles, high and middle priority
                return 0x21; // floppy first, cd second

            case 0x5B:
            case 0x5C:
            case 0x5D:
                // memory above 4GB
                return 0;
        }

        dbg_log("cmos read from index " + h(index), LOG_RTC);

        return 0xFF;
    }

    function cmos_write(data_byte)
    {
        switch(cmos_index)
        {
            case 0xA:
                cmos_a = data_byte & 0x7F;
                periodic_interrupt_time = 1000 / (32768 >> (cmos_a & 0xF) - 1);

                dbg_log("Periodic interrupt, a=" + h(cmos_a, 2) + " t=" + periodic_interrupt_time , LOG_RTC);
                break;
            case 0xB:
                cmos_b = data_byte;
                if(cmos_b & 0x40)
                {
                    next_interrupt = Date.now();
                }

                if(cmos_b & 0x20) dbg_log("Unimplemented: alarm interrupt");
                if(cmos_b & 0x10) dbg_log("Unimplemented: updated interrupt");

                dbg_log("cmos b=" + h(cmos_b, 2), LOG_RTC);
                break;
            default:
                dbg_log("cmos write index " + h(cmos_index) + ": " + h(data_byte), LOG_RTC);
        }

        periodic_interrupt = (cmos_b & 0x40) === 0x40 && (cmos_a & 0xF) > 0;
    }
}

//uart.js
/** 
 * No full implementation, just dumping serial output
 * to console
 *
 * @constructor 
 */
function UART(dev)
{
    var 
        io = dev.io,
        line = "";

    io.register_write(0x3F8, function(out_byte) 
    {
        if(out_byte === 0x0A)
        {
            log(line);
            dbg_log(line, LOG_SERIAL);
            line = "";
        }
        else
        {
            line += String.fromCharCode(out_byte);
        }
    });
}

//browser/screen.js
'use strict';

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame =
    window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
}

/**
 * Adapter to use visual screen in browsers (in constrast to node)
 * @constructor
 */
function ScreenAdapter() {
  var dom_target = document.body,
    text_screen = document.getElementById('screen'),
    graphic_screen = document.getElementById('vga'),
    graphic_context = graphic_screen.getContext('2d'),
    cursor_element = document.createElement('div'),
    graphic_image_data,
    graphic_buffer,
    /** @type {number} */
    cursor_row,
    /** @type {number} */
    cursor_col,
    /** @type {number} */
    scale_x = 1,
    /** @type {number} */
    scale_y = 1,
    graphical_mode_width,
    screen = this,
    changed_rows,
    did_redraw = true,
    // Index 0: ASCII code
    // Index 1: Background color
    // Index 2: Foreground color
    text_mode_data,
    // number of columns
    text_mode_width,
    // number of rows
    text_mode_height;

  /**
   * Charmaps that containt unicode sequences for the default dospage
   * @const
   */
  var charmap_high = new Uint16Array([
    0xc7, 0xfc, 0xe9, 0xe2, 0xe4, 0xe0, 0xe5, 0xe7, 0xea, 0xeb, 0xe8, 0xef,
    0xee, 0xec, 0xc4, 0xc5, 0xc9, 0xe6, 0xc6, 0xf4, 0xf6, 0xf2, 0xfb, 0xf9,
    0xff, 0xd6, 0xdc, 0xa2, 0xa3, 0xa5, 0x20a7, 0x192, 0xe1, 0xed, 0xf3, 0xfa,
    0xf1, 0xd1, 0xaa, 0xba, 0xbf, 0x2310, 0xac, 0xbd, 0xbc, 0xa1, 0xab, 0xbb,
    0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556, 0x2555,
    0x2563, 0x2551, 0x2557, 0x255d, 0x255c, 0x255b, 0x2510, 0x2514, 0x2534,
    0x252c, 0x251c, 0x2500, 0x253c, 0x255e, 0x255f, 0x255a, 0x2554, 0x2569,
    0x2566, 0x2560, 0x2550, 0x256c, 0x2567, 0x2568, 0x2564, 0x2565, 0x2559,
    0x2558, 0x2552, 0x2553, 0x256b, 0x256a, 0x2518, 0x250c, 0x2588, 0x2584,
    0x258c, 0x2590, 0x2580, 0x3b1, 0xdf, 0x393, 0x3c0, 0x3a3, 0x3c3, 0xb5,
    0x3c4, 0x3a6, 0x398, 0x3a9, 0x3b4, 0x221e, 0x3c6, 0x3b5, 0x2229, 0x2261,
    0xb1, 0x2265, 0x2264, 0x2320, 0x2321, 0xf7, 0x2248, 0xb0, 0x2219, 0xb7,
    0x221a, 0x207f, 0xb2, 0x25a0, 0xa0,
  ]);

  /** @const */
  var charmap_low = new Uint16Array([
    0x20, 0x263a, 0x263b, 0x2665, 0x2666, 0x2663, 0x2660, 0x2022, 0x25d8,
    0x25cb, 0x25d9, 0x2642, 0x2640, 0x266a, 0x266b, 0x263c, 0x25ba, 0x25c4,
    0x2195, 0x203c, 0xb6, 0xa7, 0x25ac, 0x21a8, 0x2191, 0x2193, 0x2192, 0x2190,
    0x221f, 0x2194, 0x25b2, 0x25bc,
  ]);

  graphic_context['imageSmoothingEnabled'] = false;
  graphic_context['mozImageSmoothingEnabled'] = false;
  graphic_context['webkitImageSmoothingEnabled'] = false;

  cursor_element.id = 'cursor';
  text_screen.style.display = 'block';

  graphic_screen.style.display = 'none';

  this.put_char = function (row, col, chr, bg_color, fg_color) {
    changed_rows[row] = 1;

    var p = 3 * (row * text_mode_width + col);
    text_mode_data[p] = chr;
    text_mode_data[p + 1] = bg_color;
    text_mode_data[p + 2] = fg_color;
  };

  this.timer_text = function () {
    if (!did_redraw) {
      return;
    }
    did_redraw = false;

    requestAnimationFrame(update_text);
  };

  function update_text() {
    did_redraw = true;

    for (var i = 0; i < text_mode_height; i++) {
      if (changed_rows[i]) {
        screen.text_update_row(i);
        changed_rows[i] = 0;
      }
    }
  }

  this.put_pixel = function (x, y, color) {
    var offset = (y * graphical_mode_width + x) << 2;

    graphic_buffer[offset] = (color >> 16) & 0xff;
    graphic_buffer[offset + 1] = (color >> 8) & 0xff;
    graphic_buffer[offset + 2] = color & 0xff;
  };

  this.put_pixel_linear = function (index, color) {
    // (addr ^ 3) - 1: Change BGR (svga) order to RGB (canvas)
    graphic_buffer[(index ^ 3) - 1] = color;
  };

  this.timer_graphical = function () {
    if (!did_redraw) {
      return;
    }
    did_redraw = false;

    requestAnimationFrame(function () {
      did_redraw = true;
      graphic_context.putImageData(graphic_image_data, 0, 0);
    });
  };

  this.destroy = function () {
    //dom_target.removeChild(text_screen);
    //dom_target.removeChild(graphic_screen);
  };

  this.set_mode = function (graphical) {
    if (graphical) {
      text_screen.style.display = 'none';
      graphic_screen.style.display = 'block';
    } else {
      text_screen.style.display = 'block';
      graphic_screen.style.display = 'none';
    }
  };

  this.clear_screen = function () {
    graphic_context.fillStyle = '#000';
    graphic_context.fillRect(0, 0, graphic_screen.width, graphic_screen.height);
  };

  /**
   * @param {number} cols
   * @param {number} rows
   */
  this.set_size_text = function (cols, rows) {
    changed_rows = new Int8Array(rows);
    text_mode_data = new Int32Array(cols * rows * 3);

    text_mode_width = cols;
    text_mode_height = rows;

    while (text_screen.firstChild) {
      text_screen.removeChild(text_screen.firstChild);
    }

    for (var i = 0; i < rows; i++) {
      text_screen.appendChild(document.createElement('div'));
    }
  };

  this.set_size_graphical = function (width, height) {
    graphic_screen.style.display = 'block';

    graphic_screen.width = width;
    graphic_screen.height = height;

    //graphic_screen.style.width = width * scale_x + "px";
    //graphic_screen.style.height = height * scale_y + "px";

    // Make sure to call this here, because pixels are transparent otherwise
    screen.clear_screen();

    graphic_image_data = graphic_context.getImageData(0, 0, width, height);
    graphic_buffer = graphic_image_data.data;

    graphical_mode_width = width;
  };

  this.set_scale = function (s_x, s_y) {
    scale_x = s_x;
    scale_y = s_y;

    elem_set_scale(graphic_screen, scale_x, scale_y);
    elem_set_scale(text_screen, scale_x, scale_y);
  };
  this.set_scale(scale_x, scale_y);

  function elem_set_scale(elem, scale_x, scale_y) {
    var scale_str = '';

    scale_str += scale_x === 1 ? '' : ' scaleX(' + scale_x + ')';
    scale_str += scale_y === 1 ? '' : ' scaleY(' + scale_y + ')';

    elem.style.webkitTransform = elem.style.MozTransform = scale_str;
  }

  this.update_cursor_scanline = function (start, end) {
    if (start & 0x20) {
      cursor_element.style.display = 'none';
    } else {
      cursor_element.style.display = 'inline';

      cursor_element.style.height = end - start + 'px';
      cursor_element.style.marginTop = start + 'px';
    }
  };

  this.update_cursor = function (row, col) {
    if (row !== cursor_row || col !== cursor_col) {
      changed_rows[row] = 1;
      changed_rows[cursor_row] = 1;

      cursor_row = row;
      cursor_col = col;
    }
  };

  this.text_update_row = function (row) {
    var offset = 3 * row * text_mode_width,
      row_element,
      color_element,
      bg_color,
      fg_color,
      text;

    row_element = document.createElement('div');

    for (var i = 0; i < text_mode_width; ) {
      color_element = document.createElement('span');

      bg_color = text_mode_data[offset + 1];
      fg_color = text_mode_data[offset + 2];

      color_element.style.backgroundColor = '#' + h(bg_color, 6);
      color_element.style.color = '#' + h(fg_color, 6);

      text = '';

      // put characters of the same color in one element
      while (
        i < text_mode_width &&
        text_mode_data[offset + 1] === bg_color &&
        text_mode_data[offset + 2] === fg_color
      ) {
        var ascii = text_mode_data[offset],
          chr;

        // use of utf-8
        if (ascii > 127) {
          chr = String.fromCharCode(charmap_high[ascii - 0x80]);
        } else if (ascii < 32) {
          chr = String.fromCharCode(charmap_low[ascii]);
        } else {
          chr = String.fromCharCode(ascii);
        }

        text += chr;

        i++;
        offset += 3;

        if (row === cursor_row) {
          if (i === cursor_col) {
            // next row will be cursor
            // create new element
            break;
          } else if (i === cursor_col + 1) {
            // found the cursor
            row_element.appendChild(cursor_element);
            break;
          }
        }
      }

      color_element.textContent = text;
      row_element.appendChild(color_element);
    }

    text_screen.replaceChild(row_element, text_screen.childNodes[row]);
  };
}

//browser/keyboard.js
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

//browser/mouse.js
/** @constructor */
function MouseAdapter() {
  /** @const */
  var SPEED_FACTOR = 0.5;

  var left_down = false,
    right_down = false,
    middle_down = false,
    last_x = 0,
    last_y = 0,
    // callback to call on a mouse click
    send_click,
    // callback to call on a mouse move
    send_delta,
    mouse = this;

  this.enabled = false;

  function may_handle(e) {
    return (
      mouse.enabled &&
      (!e.target ||
        e.type === 'mousemove' ||
        (e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'TEXTAREA'))
    );
  }

  this.destroy = function () {
    window.removeEventListener('mousemove', mousemove_handler, false);
    document.removeEventListener('contextmenu', contextmenu_handler, false);
    window.removeEventListener('mousedown', mousedown_handler, false);
    window.removeEventListener('mouseup', mouseup_handler, false);
  };

  this.init = function (click_fn, delta_fn, wheel_fn) {
    this.destroy();

    send_click = click_fn;
    send_delta = delta_fn;

    // TODO: wheel_fn

    window.addEventListener('mousemove', mousemove_handler, false);
    document.addEventListener('contextmenu', contextmenu_handler, false);
    window.addEventListener('mousedown', mousedown_handler, false);
    window.addEventListener('mouseup', mouseup_handler, false);
  };

  function mousemove_handler(e) {
    if (!may_handle(e)) {
      return;
    }

    var delta_x, delta_y;

    if (true) {
      delta_x = e['webkitMovementX'] || e['mozMovementX'] || 0;
      delta_y = e['webkitMovementY'] || e['mozMovementY'] || 0;
    } else {
      // Fallback for other browsers?
      delta_x = e.clientX - last_x;
      delta_y = e.clientY - last_y;

      last_x = e.clientX;
      last_y = e.clientY;
    }

    delta_x = Math.roundInfinity(delta_x * SPEED_FACTOR);
    delta_y = Math.roundInfinity(delta_y * SPEED_FACTOR);

    send_delta(delta_x, -delta_y);
  }

  function contextmenu_handler(e) {
    if (may_handle(e)) {
      e.preventDefault();
    }
  }

  function mousedown_handler(e) {
    if (may_handle(e)) {
      click_event(e, true);
    }
  }

  function mouseup_handler(e) {
    if (may_handle(e)) {
      click_event(e, false);
    }
  }

  function click_event(e, down) {
    if (e.which === 1) {
      left_down = down;
    } else if (e.which === 2) {
      middle_down = down;
    } else if (e.which === 3) {
      right_down = down;
    } else {
      dbg_log('Unknown event.which: ' + e.which, LOG_MOUSE);
    }
    send_click(left_down, middle_down, right_down);

    e.preventDefault();
  }
}

