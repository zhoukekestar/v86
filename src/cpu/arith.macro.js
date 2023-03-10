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
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function add16(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + source_operand | 0;

    last_op_size = OPSIZE_16;
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function add32(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + source_operand;

    last_op_size = OPSIZE_32;
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function adc8(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + last_op2 + getcf() | 0;

    last_op_size = OPSIZE_8;
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function adc16(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + last_op2 + getcf() | 0;

    last_op_size = OPSIZE_16;
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function adc32(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = source_operand;
    last_result = last_op1 + last_op2 + getcf();

    last_op_size = OPSIZE_32;
    flags_changed = FLAG_ALL_ARITHMETIC;

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
    flags_changed = FLAG_ALL_ARITHMETIC;
}

function cmp16(dest_operand, source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand < 0x10000);
    dbg_assert(dest_operand >= 0 && dest_operand < 0x10000);

    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand;

    last_op_size = OPSIZE_16;
    flags_changed = FLAG_ALL_ARITHMETIC;
}

function cmp32(dest_operand, source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand < 0x100000000);
    dbg_assert(dest_operand >= 0 && dest_operand < 0x100000000);

    last_op1 = dest_operand;
    last_op2 = -source_operand - 1;
    last_result = last_op1 - source_operand;

    last_op_size = OPSIZE_32;
    flags_changed = FLAG_ALL_ARITHMETIC;
}

function sub8(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand | 0;

    last_op_size = OPSIZE_8;
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function sub16(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand | 0;

    last_op_size = OPSIZE_16;
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function sub32(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = -source_operand - 1;
    last_result = last_op1 - source_operand;

    last_op_size = OPSIZE_32;
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function sbb8(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand - getcf() | 0;

    last_op_size = OPSIZE_8;
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function sbb16(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = ~source_operand;
    last_result = last_op1 - source_operand - getcf() | 0;

    last_op_size = OPSIZE_16;
    flags_changed = FLAG_ALL_ARITHMETIC;

    return last_result;
}

function sbb32(dest_operand, source_operand)
{
    last_op1 = dest_operand;
    last_op2 = -source_operand - 1;
    last_result = last_op1 - source_operand - getcf();

    last_op_size = OPSIZE_32;
    flags_changed = FLAG_ALL_ARITHMETIC;

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY;

    return last_result;
}

function inc16(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = 1;
    last_result = last_op1 + 1 | 0;

    last_op_size = OPSIZE_16;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY;

    return last_result;
}

function inc32(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = 1;
    last_result = last_op1 + 1;

    last_op_size = OPSIZE_32;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY;

    return last_result;
}



function dec8(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = -1;
    last_result = last_op1 - 1 | 0;

    last_op_size = OPSIZE_8;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY;

    return last_result;
}

function dec16(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = -1;
    last_result = last_op1 - 1 | 0;

    last_op_size = OPSIZE_16;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY;

    return last_result;
}

function dec32(dest_operand)
{
    flags = (flags & ~1) | getcf();
    last_op1 = dest_operand;
    last_op2 = -1;
    last_result = last_op1 - 1;

    last_op_size = OPSIZE_32;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY;

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

    flags_changed = FLAG_ALL_ARITHMETIC;
    last_op_size = OPSIZE_8;
    last_op1 = 0;
    last_op2 = last_result - 1;

    return last_result;
}

function neg16(dest_operand)
{
    last_result = -dest_operand;

    flags_changed = FLAG_ALL_ARITHMETIC;
    last_op_size = OPSIZE_16;
    last_op1 = 0;
    last_op2 = last_result - 1;

    return last_result;
}

function neg32(dest_operand)
{
    last_result = -dest_operand;

    flags_changed = FLAG_ALL_ARITHMETIC;
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
    var result = source_operand * reg8[REG_AL_INDEX];

    reg16[REG_AX_INDEX] = result;

    if(result < 0x100)
    {
        flags = flags & ~1 & ~FLAG_OVERFLOW;
    }
    else
    {
        flags = flags | 1 | FLAG_OVERFLOW;
    }

    flags_changed = 0;
}

function imul8(source_operand)
{
    var result = source_operand * reg8s[REG_AL_INDEX];

    reg16[REG_AX_INDEX] = result;

    if(result > 0x7F || result < -0x80)
    {
        flags = flags | 1 | FLAG_OVERFLOW;
    }
    else
    {
        flags = flags & ~1 & ~FLAG_OVERFLOW;
    }
    flags_changed = 0;
}

function mul16(source_operand)
{
    var result = source_operand * reg16[REG_AX_INDEX],
        high_result = result >>> 16;
    //console.log(h(a) + " * " + h(reg16[REG_AX_INDEX]) + " = " + h(result));

    reg16[REG_AX_INDEX] = result;
    reg16[REG_DX_INDEX] = high_result;

    if(high_result === 0)
    {
        flags &= ~1 & ~FLAG_OVERFLOW;
    }
    else
    {
        flags |= 1 | FLAG_OVERFLOW;
    }
    flags_changed = 0;
}

/*
 * imul with 1 argument
 * ax = ax * r/m
 */
function imul16(source_operand)
{
    var result = source_operand * reg16s[REG_AX_INDEX];

    reg16[REG_AX_INDEX] = result;
    reg16[REG_DX_INDEX] = result >> 16;

    if(result > 0x7FFF || result < -0x8000)
    {
        flags |= 1 | FLAG_OVERFLOW;
    }
    else
    {
        flags &= ~1 & ~FLAG_OVERFLOW;
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
        flags |= 1 | FLAG_OVERFLOW;
    }
    else
    {
        flags &= ~1 & ~FLAG_OVERFLOW;
    }
    flags_changed = 0;

    return result;
}

function mul32(source_operand)
{
    var dest_operand = reg32[REG_EAX_INDEX],
        high_result = source_operand * dest_operand / 0x100000000 | 0;

    reg32[REG_EAX_INDEX] = multiply_low(source_operand, dest_operand);
    reg32[REG_EDX_INDEX] = high_result;

    if(high_result === 0)
    {
        flags &= ~1 & ~FLAG_OVERFLOW;
    }
    else
    {
        flags |= 1 | FLAG_OVERFLOW;
    }
    flags_changed = 0;

    //console.log(memory.read32s(address) + " * " + old);
    //console.log("= " + reg32[REG_EDX_INDEX] + " " + reg32[REG_EAX_INDEX]);
}

function imul32(source_operand)
{
    dbg_assert(source_operand < 0x80000000 && source_operand >= -0x80000000);

    var dest_operand = reg32s[REG_EAX_INDEX],
        high_result = source_operand * dest_operand / 0x100000000 | 0,
        low_result = multiply_low(source_operand, dest_operand);

    if(high_result === 0 && low_result < 0)
    {
        high_result = -1;
    }

    reg32[REG_EAX_INDEX] = low_result;
    reg32[REG_EDX_INDEX] = high_result;

    if(high_result === (reg32[REG_EAX_INDEX] < 0x80000000 ? 0 : -1))
    {
        flags &= ~1 & ~FLAG_OVERFLOW;
    }
    else
    {
        flags |= 1 | FLAG_OVERFLOW;
    }
    flags_changed = 0;


    //console.log(target_operand + " * " + source_operand);
    //console.log("= " + h(reg32[REG_EDX_INDEX]) + " " + h(reg32[REG_EAX_INDEX]));
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
        flags &= ~1 & ~FLAG_OVERFLOW;
    }
    else
    {
        flags |= 1 | FLAG_OVERFLOW;
    }
    flags_changed = 0;

    return result;

    //console.log(operand + " * " + source_operand);
    //console.log("= " + reg32[reg]);
}

function div8(source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand < 0x100);

    var target_operand = reg16[REG_AX_INDEX],
        result = target_operand / source_operand | 0;

    if(result > 0xFF || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg8[REG_AL_INDEX] = result;
        reg8[REG_AH_INDEX] = target_operand % source_operand;
    }
}

function idiv8(source_operand)
{
    dbg_assert(source_operand >= -0x80 && source_operand < 0x80);

    var target_operand = reg16s[REG_AX_INDEX],
        result = target_operand / source_operand | 0;

    if(result > 0x7F || result < -0x80 || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg8[REG_AL_INDEX] = result;
        reg8[REG_AH_INDEX] = target_operand % source_operand;
    }
}

function div16(source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand < 0x10000);

    var
        target_operand = (reg16[REG_AX_INDEX] | reg16[REG_DX_INDEX] << 16) >>> 0,
        result = target_operand / source_operand | 0;

    if(result > 0xFFFF || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg16[REG_AX_INDEX] = result;
        reg16[REG_DX_INDEX] = target_operand % source_operand;
    }
}

function idiv16(source_operand)
{
    dbg_assert(source_operand >= -0x8000 && source_operand < 0x8000);

    var target_operand = reg16[REG_AX_INDEX] | (reg16[REG_DX_INDEX] << 16),
        result = target_operand / source_operand | 0;

    if(result > 0x7FFF || result < -0x8000 || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg16[REG_AX_INDEX] = result;
        reg16[REG_DX_INDEX] = target_operand % source_operand;
    }
}

function div32(source_operand)
{
    dbg_assert(source_operand >= 0 && source_operand <= 0xffffffff);

    var
        dest_operand_low = reg32[REG_EAX_INDEX],
        dest_operand_high = reg32[REG_EDX_INDEX],

        // Wat? Not sure if seri??s ...
        mod = (0x100000000 * dest_operand_high % source_operand + dest_operand_low % source_operand) % source_operand,
        result = dest_operand_low / source_operand + dest_operand_high * 0x100000000 / source_operand;

    if(result > 0xFFFFFFFF || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg32[REG_EAX_INDEX] = result;
        reg32[REG_EDX_INDEX] = mod;
    }

    //console.log(h(dest_operand_high) + ":" + h(dest_operand_low) + " / " + h(source_operand));
    //console.log("= " + h(reg32[REG_EAX_INDEX]) + " rem " + h(reg32[REG_EDX_INDEX]));
}

function idiv32(source_operand)
{
    dbg_assert(source_operand < 0x80000000 && source_operand >= -0x80000000);

    var
        dest_operand_low = reg32[REG_EAX_INDEX],
        dest_operand_high = reg32s[REG_EDX_INDEX],
        mod = (0x100000000 * dest_operand_high % source_operand + dest_operand_low % source_operand) % source_operand,
        result = dest_operand_low / source_operand + dest_operand_high * 0x100000000 / source_operand;

    if(result > 0x7FFFFFFF || result < -0x80000000 || source_operand === 0)
    {
        trigger_de();
    }
    else
    {
        reg32[REG_EAX_INDEX] = result;
        reg32[REG_EDX_INDEX] = mod;
    }

    //console.log(h(dest_operand_high) + ":" + h(dest_operand_low) + " / " + h(source_operand));
    //console.log("= " + h(reg32[REG_EAX_INDEX]) + " rem " + h(reg32[REG_EDX_INDEX]));
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
    var old_al = reg8[REG_AL_INDEX],
        old_cf = getcf(),
        old_af = getaf();

    flags &= ~1 & ~FLAG_ADJUST

    if((old_al & 0xF) > 9 || old_af)
    {
        reg8[REG_AL_INDEX] += 6;
        flags |= FLAG_ADJUST;
    }
    if(old_al > 0x99 || old_cf)
    {
        reg8[REG_AL_INDEX] += 0x60;
        flags |= 1;
    }

    last_result = reg8[REG_AL_INDEX];
    last_op_size = OPSIZE_8;
    last_op1 = last_op2 = 0;
    flags_changed = FLAG_ALL_ARITHMETIC & ~1 & ~FLAG_ADJUST & ~FLAG_OVERFLOW;
}

function bcd_das()
{
    //dbg_log("das");
    // decimal adjust after subtraction
    var old_al = reg8[REG_AL_INDEX],
        old_cf = getcf();

    flags &= ~1;

    if((old_al & 0xF) > 9 || getaf())
    {
        reg8[REG_AL_INDEX] -= 6;
        flags |= FLAG_ADJUST;
        flags = flags & ~1 | old_cf | reg8[REG_AL_INDEX] >> 7;
    }
    else
    {
        flags &= ~FLAG_ADJUST;
    }

    if(old_al > 0x99 || old_cf)
    {
        reg8[REG_AL_INDEX] -= 0x60;
        flags |= 1;
    }

    last_result = reg8[REG_AL_INDEX];
    last_op_size = OPSIZE_8;
    last_op1 = last_op2 = 0;
    flags_changed = FLAG_ALL_ARITHMETIC & ~1 & ~FLAG_ADJUST & ~FLAG_OVERFLOW;
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
        var temp = reg8[REG_AL_INDEX];
        reg8[REG_AH_INDEX] = temp / imm8;
        reg8[REG_AL_INDEX] = temp % imm8;

        last_result = reg8[REG_AL_INDEX];
        flags_changed = FLAG_ALL_ARITHMETIC;
    }
}

function bcd_aad()
{
    // ascii adjust after division
    var imm8 = read_imm8();

    last_result = reg8[REG_AL_INDEX] + reg8[REG_AH_INDEX] * imm8;
    reg16[REG_AX_INDEX] = last_result & 0xFF;
    last_op_size = OPSIZE_8;
    flags_changed = FLAG_ALL_ARITHMETIC;
}

function bcd_aaa()
{
    if((reg8[REG_AL_INDEX] & 0xF) > 9 || getaf())
    {
        reg16[REG_AX_INDEX] += 6;
        reg8[REG_AH_INDEX] += 1;
        flags |= FLAG_ADJUST | 1;
    }
    else
    {
        flags &= ~FLAG_ADJUST & ~1;
    }
    reg8[REG_AL_INDEX] &= 0xF;

    flags_changed &= ~FLAG_ADJUST & ~1;
}


function bcd_aas()
{
    if((reg8[REG_AL_INDEX] & 0xF) > 9 || getaf())
    {
        reg16[REG_AX_INDEX] -= 6;
        reg8[REG_AH_INDEX] -= 1;
        flags |= FLAG_ADJUST | 1;
    }
    else
    {
        flags &= ~FLAG_ADJUST & ~1;
    }
    reg8[REG_AL_INDEX] &= 0xF;

    flags_changed &= ~FLAG_ADJUST & ~1;
}


/*                     \O
 * bitwise functions    |\
 *                     / \
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
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;

    return last_result;
}

function and16(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;

    last_op_size = OPSIZE_16;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;

    return last_result;
}

function and32(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;

    last_op_size = OPSIZE_32;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;

    return last_result;
}

function test8(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;

    last_op_size = OPSIZE_8;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
}

function test16(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;

    last_op_size = OPSIZE_16;
    flags &= ~1 & ~FLAG_OVERFLOW;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
}

function test32(dest_operand, source_operand)
{
    last_result = dest_operand & source_operand;

    last_op_size = OPSIZE_32;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
}

function or8(dest_operand, source_operand)
{
    last_result = dest_operand | source_operand;

    last_op_size = OPSIZE_8;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;

    return last_result;
}

function or16(dest_operand, source_operand)
{
    last_result = dest_operand | source_operand;

    last_op_size = OPSIZE_16;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;

    return last_result;
}

function or32(dest_operand, source_operand)
{
    last_result = dest_operand | source_operand;

    last_op_size = OPSIZE_32;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;

    return last_result;
}

function xor8(dest_operand, source_operand)
{
    last_result = dest_operand ^ source_operand;

    last_op_size = OPSIZE_8;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;

    return last_result;
}

function xor16(dest_operand, source_operand)
{
    last_result = dest_operand ^ source_operand;

    last_op_size = OPSIZE_16;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;

    return last_result;
}

function xor32(dest_operand, source_operand)
{
    last_result = dest_operand ^ source_operand;

    last_op_size = OPSIZE_32;
    flags &= ~1 & ~FLAG_OVERFLOW & ~FLAG_ADJUST;
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW & ~FLAG_ADJUST;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result & 1)
                | (result << 11 ^ result << 4) & FLAG_OVERFLOW;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result & 1)
                | (result << 11 ^ result >> 4) & FLAG_OVERFLOW;

    return result;
}

function rol32(dest_operand, count)
{
    if(!count)
    {
        return dest_operand;
    }

    var result = dest_operand << count | dest_operand >>> (32 - count);

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result & 1)
                | (result << 11 ^ result >> 20) & FLAG_OVERFLOW;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result >> 8 & 1)
                | (result << 3 ^ result << 4) & FLAG_OVERFLOW;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result >> 16 & 1)
                | (result >> 5 ^ result >> 4) & FLAG_OVERFLOW;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW) | (dest_operand >>> (32 - count) & 1);
    flags |= (flags << 11 ^ result >> 20) & FLAG_OVERFLOW;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result >> 7 & 1)
                | (result << 4 ^ result << 5) & FLAG_OVERFLOW;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result >> 15 & 1)
                | (result >> 4 ^ result >> 3) & FLAG_OVERFLOW;

    return result;
}

function ror32(dest_operand, count)
{
    if(!count)
    {
        return dest_operand;
    }

    var result = dest_operand >>> count | dest_operand << (32 - count);

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result >> 31 & 1)
                | (result >> 20 ^ result >> 19) & FLAG_OVERFLOW;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result >> 8 & 1)
                | (result << 4 ^ result << 5) & FLAG_OVERFLOW;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (result >> 16 & 1)
                | (result >> 4 ^ result >> 3) & FLAG_OVERFLOW;

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

    flags_changed &= ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (dest_operand >> (count - 1) & 1)
                | (result >> 20 ^ result >> 19) & FLAG_OVERFLOW;

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (last_result >> 8 & 1)
                | (last_result << 3 ^ last_result << 4) & FLAG_OVERFLOW;

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (last_result >> 16 & 1)
                | (last_result >> 5 ^ last_result >> 4) & FLAG_OVERFLOW;

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW;
    // test this
    flags = (flags & ~1 & ~FLAG_OVERFLOW) | (dest_operand >>> (32 - count) & 1);
    flags |= ((flags & 1) ^ (last_result >> 31 & 1)) << 11 & FLAG_OVERFLOW;

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (dest_operand >> (count - 1) & 1)
                | (dest_operand >> 7 & 1) << 11 & FLAG_OVERFLOW;

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (dest_operand >> (count - 1) & 1)
                | (dest_operand >> 4)  & FLAG_OVERFLOW;

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW)
                | (dest_operand >>> (count - 1) & 1)
                | (dest_operand >> 20) & FLAG_OVERFLOW;

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW) | (dest_operand >> (count - 1) & 1);
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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW) | (dest_operand >> (count - 1) & 1);

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~FLAG_CARRY & ~FLAG_OVERFLOW;
    flags = (flags & ~1 & ~FLAG_OVERFLOW) | (dest_operand >>> (count - 1) & 1);

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~1 & ~FLAG_OVERFLOW;
    flags = (flags & ~FLAG_OVERFLOW) | ((last_result ^ dest_operand) >> 4 & FLAG_OVERFLOW);

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~1 & ~FLAG_OVERFLOW;
    flags = (flags & ~1) | (dest_operand >>> (count - 1) & 1);
    flags = (flags & ~FLAG_OVERFLOW) | ((last_result ^ dest_operand) >> 20 & FLAG_OVERFLOW);

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~1 & ~FLAG_OVERFLOW;
    flags = (flags & ~FLAG_OVERFLOW) | ((flags & 1) ^ (last_result >> 15 & 1)) << 11;

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
    flags_changed = FLAG_ALL_ARITHMETIC & ~1 & ~FLAG_OVERFLOW;
    // test this
    flags = (flags & ~1) | (dest_operand >>> (32 - count) & 1);
    flags = (flags & ~FLAG_OVERFLOW) | ((flags & 1) ^ (last_result >> 31 & 1)) << 11;

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
        flags |= FLAG_ZERO;

        // not defined in the docs, but value doesn't change on my intel cpu
        return old;
    }
    else
    {
        flags &= ~FLAG_ZERO;

        return mod37_bit_position[((-bit_base & bit_base) >>> 0) % 37];
    }
}

function bsf32(old, bit_base)
{
    flags_changed = 0;

    if(bit_base === 0)
    {
        flags |= FLAG_ZERO;

        return old;
    }
    else
    {
        flags &= ~FLAG_ZERO;

        return mod37_bit_position[((-bit_base & bit_base) >>> 0) % 37];
    }
}

function bsr16(old, bit_base)
{
    flags_changed = 0;

    if(bit_base === 0)
    {
        flags |= FLAG_ZERO;
        return old;
    }
    else
    {
        flags &= ~FLAG_ZERO;

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
        flags |= FLAG_ZERO;
        return old;
    }
    else
    {
        flags &= ~FLAG_ZERO;

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


