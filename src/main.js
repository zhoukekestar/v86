"use strict";

Object.fromList = function(xs)
{
    var result = {};

    for(var i = 0; i < xs.length; i++)
    {
        result[xs[i][0]] = xs[i][1];
    }

    return result;
};



var dbg_names = Object.fromList([
    [1, ""],
    [LOG_CPU, "CPU"],
    [LOG_DISK, "DISK"],
    [LOG_FPU, "FPU"],
    [LOG_MEM, "MEM"],
    [LOG_DMA, "DMA"],
    [LOG_IO, "IO"],
    [LOG_PS2, "PS2"],
    [LOG_PIC, "PIC"],
    [LOG_VGA, "VGA"],
    [LOG_PIT, "PIT"],
    [LOG_MOUSE, "MOUS"],
    [LOG_PCI, "PCI"],
    [LOG_BIOS, "BIOS"],
    [LOG_CD, "CD"],
    [LOG_SERIAL, "SERI"],
    [LOG_RTC, "RTC"],
]);


/** 
 * @param {number=} level
 */
function dbg_log(stuff, level)
{
    if(!DEBUG) return;

    level = level || 1;

    if(level & LOG_LEVEL)
    {
        var level_name = dbg_names[level] || "";

        console.log("[" + String.pads(level_name, 4) + "] " + stuff);
    }
};

function dbg_trace()
{
    if(!DEBUG) return;

    dbg_log(Error().stack);
}

/** 
 * console.assert is fucking slow
 * @param {string=} msg
 */
function dbg_assert(cond, msg) 
{ 
    if(!DEBUG) return;

    if(!cond) 
    { 
        //dump_regs();
        console.log(Error().stack);
        console.trace();
        if(msg)
        {
            throw "Assert failed: " + msg;
        }
        else
        {
            throw "Assert failed";
        }
    } 
};


Object.extend = function(target, src)
{
    var keys = Object.keys(src);

    for(var i = 0; i < keys.length; i++)
    {
        target[keys[i]] = src[keys[i]];
    }
}


// pad string with spaces on the right
String.pads = function(str, len)
{
    str = str ? str + "" : "";

    while(str.length < len)
    {
        str = str + " ";
    }
    
    return str;
}

// pad string with zeros on the left
String.pad0 = function(str, len)
{
    str = str ? str + "" : "";

    while(str.length < len)
    {
        str = "0" + str;
    }
    
    return str;
}

Array.range = function(n)
{
    var a = [];

    for(var i = 0; i < n; i++)
    {
        a[i] = i;
    }

    return a;
}

/**
 * number to hex
 * @param {number=} len
 */
function h(n, len)
{
    //dbg_assert(typeof n === "number");

    if(!n) return String.pad0("", len || 1);

    if(len)
    {
        return String.pad0(n.toString(16).toUpperCase(), len);
    }
    else
    {
        return n.toString(16).toUpperCase();
    }
}

Number.bits = function(n)
{
    var result = [];

    for(var bit = 31; bit > -1; bit--)
    {
        if(n & 1 << bit)
        {
            result.push(bit);
        }
    }

    return result.join(', ');
}

String.chr_repeat = function(chr, count)
{
    var result = "";

    while(count--)
    {
        result += chr;
    }

    return result;
}


Math.bcd_pack = function(n)
{ 
    var i = 0, 
        result = 0,
        digit;
    
    while(n)
    {
        digit = n % 10; 
        
        result |= digit << (4 * i); 
        i++; 
        n = (n - digit) / 10;
    } 
    
    return result;
}

/** 
 * @param {string=} msg
 * */
function unimpl(msg)
{
    var s = "Unimplemented" + (msg ? ": " + msg : "");

    log(s);

    if(DEBUG)
    {
        console.trace();
        return s;
    }
    else
    {
        log("Execution stopped");
        return s;
    }
    //this.name = "Unimplemented";
}

/** 
 * Synchronous access to ArrayBuffer
 * @constructor
 */
function SyncBuffer(buffer)
{
    this.byteLength = buffer.byteLength;

    // warning: fn may be called synchronously or asynchronously
    this.get = function(start, len, fn)
    {
        fn(new Uint8Array(buffer, start, len));
    };

    this.set = function(start, slice, fn)
    {
        new Uint8Array(buffer, start, slice.byteLength).set(slice);
        fn();
    };

    this.get_buffer = function(fn)
    {
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
function CircularQueue(size, Proto)
{
    var data,
        index;

    this.add = function(item)
    {
        data[index] = item;

        index = (index + 1) % size;
    };

    this.toArray = function()
    {
        return [].slice.call(data, index).concat([].slice.call(data, 0, index));
    };

    this.clear = function()
    {
        if(Proto)
        {
            data = new Proto(size);
        }
        else
        {
            data = [];
        }

        index = 0;
    };

    this.set = function(new_data)
    {
        data = new_data;
        index = 0;
    };


    this.clear();
}



// switch number to big endian
Math.to_be32 = function(dword)
{
    return dword >>> 24 | 
        dword >> 8 & 0xff00 | 
        dword << 8 & 0xff0000 | 
        dword << 24;
}

Math.to_be16 = function(word)
{
    return word >>> 8 & 0xff | word << 8 & 0xff00;
}


// used in several places
// the first entry is -1
//   http://jsperf.com/integer-log2/2
var log2_table = (function()
{
    var t = new Int8Array(256);

    for(var i = 0, b = -2; i < 256; i++)
    {
        if(!(i & i - 1))
            b++;

        t[i] = b;
    }

    return t;
})();


// round away from zero, opposite of truncation
Math.roundInfinity = function(x)
{
    return x > 0 ? Math.ceil(x) : Math.floor(x);
};

