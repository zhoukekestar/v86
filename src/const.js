// DEBUG 开关
var DEBUG = true;

// 内存大小 64KB
const MEMORY_SIZE = 1024 * 1024 * 64;

// 用于控制日志输出
const LOG_ALL = -1,
  LOG_NONE = 0,
  LOG_OTHER = 0x00001,
  LOG_CPU = 0x00002,
  LOG_FPU = 0x00004,
  LOG_MEM = 0x00008,
  LOG_DMA = 0x00010,
  LOG_IO = 0x00020,
  LOG_PS2 = 0x00040,
  LOG_PIC = 0x00080,
  LOG_VGA = 0x00100,
  LOG_PIT = 0x00200,
  LOG_MOUSE = 0x00400,
  LOG_PCI = 0x00800,
  LOG_BIOS = 0x01000,
  LOG_CD = 0x02000,
  LOG_SERIAL = 0x04000,
  LOG_DISK = 0x08000,
  LOG_RTC = 0x10000,
  //LOG_LEVEL = LOG_OTHER | LOG_PS2 | LOG_BIOS;
  //LOG_LEVEL = LOG_PS2 | LOG_OTHER | LOG_IO;
  //LOG_LEVEL = LOG_PS2;
  //LOG_LEVEL = LOG_OTHER | LOG_CPU | LOG_BIOS;
  //LOG_LEVEL = LOG_VGA | LOG_IO | LOG_BIOS | LOG_OTHER;
  //LOG_LEVEL = LOG_FPU | LOG_OTHER;
  //LOG_LEVEL = LOG_DMA | LOG_DISK | LOG_IO | LOG_PCI;
  //LOG_LEVEL = LOG_DMA | LOG_DISK | LOG_PCI | LOG_CD | LOG_BIOS;
  LOG_LEVEL = LOG_ALL & ~LOG_DISK & ~LOG_DMA & ~LOG_VGA & ~LOG_PS2 & ~LOG_FPU;
//LOG_LEVEL = LOG_SERIAL | LOG_IO;
//LOG_LEVEL = LOG_PIT | LOG_RTC;
//LOG_LEVEL = 0;

/*
 * Translation Lookaside Buffer
 * Information about which pages are cached in the tlb.
 * By bit:
 *   0 system, read
 *   1 system, write
 *   2 user, read
 *   3 user, write
 */
const TLB_SYSTEM_READ = 1,
  TLB_SYSTEM_WRITE = 2,
  TLB_USER_READ = 4,
  TLB_USER_WRITE = 8;

// 所有状态寄存器
// 参考 2.3.4 Flags Register https://www.scs.stanford.edu/05au-cs240c/lab/i386/s02_03.htm
const FLAG_MASK = 0b110111111111010111;

// 默认状态寄存器的值，除了第一位是 1，其余都是 0
// 参考 2.3.4 Flags Register https://www.scs.stanford.edu/05au-cs240c/lab/i386/s02_03.htm
const FLAG_DEFAULT = 1 << 1;

// 状态寄存器
// 参考 2.3.4 Flags Register https://www.scs.stanford.edu/05au-cs240c/lab/i386/s02_03.htm
const [
  FLAG_CARRY /* 0 */,
  FLAG_INTEL_RESERVED_NO_USE_1 /* 1 INTEL RESERVED 1 */,
  FLAG_PARITY /* 2 */,
  FLAG_INTEL_RESERVED_NO_USE_2 /* 3 INTEL RESERVED 0 */,
  FLAG_ADJUST /* 4 AUXILIARY CARRY */,
  FLAG_INTEL_RESERVED_NO_USE_3 /* 5 INTEL RESERVED 0 */,
  FLAG_ZERO /* 6 */,
  FLAG_SIGN /* 7 */,
  FLAG_TRAP /* 8 */,
  FLAG_INTERRUPT /* 9 INTERRUPT ENABLE */,
  FLAG_DIRECTION /* 10 */,
  FLAG_OVERFLOW /* 11 */,
  FLAG_IO_PRIVILEGE_LEVEL1 /* 12 I/O PRIVILEGE LEVEL */,
  FLAG_IO_PRIVILEGE_LEVEL2 /* 13 I/O PRIVILEGE LEVEL */,
  FLAG_NESTED_TASK /* 14 NESTED TASK FLAG */,
  FLAG_INTEL_RESERVED_NO_USE_4 /* 15 INTEL RESERVED 0 */,
  FLAG_RESUME /* 16 */,
  FLAG_VIRTUAL_8086_MODE /* 17 VIRTUAL 8086 MODE */,
] = FLAG_MASK.toString(2)
  .split('')
  .reverse()
  .map((v, i) => v << i);

// FLAG I/O PRIVILEGE LEVEL 占了两位
const FLAG_IO_PRIVILEGE_LEVEL =
  FLAG_IO_PRIVILEGE_LEVEL1 | FLAG_IO_PRIVILEGE_LEVEL2;

// 所有的算术标记位
// all arithmetic flags
const FLAG_ALL_ARITHMETIC =
  FLAG_CARRY |
  FLAG_PARITY |
  FLAG_ADJUST |
  FLAG_ZERO |
  FLAG_SIGN |
  FLAG_OVERFLOW;

// 操作码长度
const OPSIZE_8 = 8;
const OPSIZE_16 = 16;
const OPSIZE_32 = 32;

// 分页大小 PSE page size extension
const PSE_ENABLED = 128;

// 32 位寄存器序号
const REG_32_INDEX_MAP = [0, 1, 2, 3, 4, 5, 6, 7];
const [
  REG_EAX_INDEX,
  REG_ECX_INDEX,
  REG_EDX_INDEX,
  REG_EBX_INDEX,
  REG_ES_INDEXP_INDEX,
  REG_EBP_INDEX,
  REG_ES_INDEXI_INDEX,
  REG_EDI_INDEX,
] = REG_32_INDEX_MAP;

// 16 位寄存器序号
const REG_16_INDEX_MAP = [0, 2, 4, 6, 8, 10, 12, 14];
const [
  REG_AX_INDEX,
  REG_CX_INDEX,
  REG_DX_INDEX,
  REG_BX_INDEX,
  REG_SP_INDEX,
  REG_BP_INDEX,
  REG_SI_INDEX,
  REG_DI_INDEX,
] = REG_16_INDEX_MAP;

// 8 位寄存器序号
const REG_8_INDEX_MAP = [0, 4, 8, 12, 1, 5, 9, 13];
const [
  REG_AL_INDEX,
  REG_CL_INDEX,
  REG_DL_INDEX,
  REG_BL_INDEX,
  REG_AH_INDEX,
  REG_CH_INDEX,
  REG_DH_INDEX,
  REG_BH_INDEX,
] = REG_8_INDEX_MAP;

// 段序号
const REG_ES_INDEX = 0,
  REG_CS_INDEX = 1,
  REG_SS_INDEX = 2,
  REG_DS_INDEX = 3,
  REG_FS_INDEX = 4,
  REG_GS_INDEX = 5,
  REG_NOSEG_INDEX = 6;

const LOOP_COUNTER = 20001;
const TIME_PER_FRAME = 33;
