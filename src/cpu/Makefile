CPP=cpp-12

all: *.macro.js
	$(CPP) -P -undef -Wundef -std=c99 -nostdinc -Wtrigraphs -fdollars-in-identifiers -C cpu.macro.js cpu.js
