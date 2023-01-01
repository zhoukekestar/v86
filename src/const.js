
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


// 所有状态寄存器
// 参考 2.3.4 Flags Register https://www.scs.stanford.edu/05au-cs240c/lab/i386/s02_03.htm
const FLAG_MASK = 0b110111111111010111;

// 默认状态寄存器的值，除了第一位是 1，其余都是 0
// 参考 2.3.4 Flags Register https://www.scs.stanford.edu/05au-cs240c/lab/i386/s02_03.htm
const FLAG_DEFAULT = 1 << 1;

// 状态寄存器
// 参考 2.3.4 Flags Register https://www.scs.stanford.edu/05au-cs240c/lab/i386/s02_03.htm
let [
  flag_carry,     /* 0 */
  ,               /* 1 INTEL RESERVED 1 */
  flag_parity,    /* 2 */
  ,               /* 3 INTEL RESERVED 0 */
  flag_adjust,    /* 4 AUXILIARY CARRY */
  ,               /* 5 INTEL RESERVED 0 */
  flag_zero,      /* 6 */
  flag_sign,      /* 7 */
  flag_trap,      /* 8 */
  flag_interrupt, /* 9 INTERRUPT ENABLE */
  flag_direction, /* 10 */
  flag_overflow,  /* 11 */
  flag_iopl1,     /* 12 I/O PRIVILEGE LEVEL */
  flag_iopl2,     /* 13 I/O PRIVILEGE LEVEL */
  flag_nt,        /* 14 NESTED TASK FLAG */
  ,               /* 15 INTEL RESERVED 0 */
  flag_resume,    /* 16 */
  flag_vm,        /* 17 VIRTUAL 8086 MODE */
] = FLAG_MASK.toString(2).split('').reverse().map((v, i) => v << i);

// flag I/O PRIVILEGE LEVEL 占了两位
let flag_iopl = flag_iopl1 | flag_iopl2;

// 所有的算术标记位
// all arithmetic flags
const FLAG_ALL_ARITHMETIC = flag_carry | flag_parity | flag_adjust | flag_zero | flag_sign | flag_overflow;



var

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



