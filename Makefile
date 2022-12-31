CLOSURE=../closure-compiler/compiler-20141120/compiler.jar
CPP=cpp


all: v86_all.js
browser: v86_all.js

src/cpu.js: src/*.macro.js
	# build cpu.macro.js using cpp
	$(CPP) -P -undef -Wundef -std=c99 -nostdinc -Wtrigraphs -fdollars-in-identifiers -C src/cpu.macro.js src/cpu.js


# Used for nodejs builds and in order to profile code.
# `debug` gives identifiers a readable name, make sure it doesn't have any side effects.
CLOSURE_READABLE=--formatting PRETTY_PRINT --debug

CLOSURE_SOURCE_MAP=\
		--source_map_format V3\
		--create_source_map

CLOSURE_FLAGS=\
		--compilation_level ADVANCED_OPTIMIZATIONS\
		--externs externs.js\
		--warning_level VERBOSE\
		--jscomp_off uselessCode\
		--use_types_for_optimization\
		--summary_detail_level 3\
		--language_in ECMASCRIPT5_STRICT


CORE_FILES=const.js io.js cpu.js main.js disk.js pci.js floppy.js memory.js dma.js pit.js vga.js ps2.js pic.js rtc.js uart.js
BROWSER_FILES=browser/main.js browser/screen.js browser/keyboard.js browser/mouse.js

v86_all.js: src/*.js src/browser/*.js src/cpu.js
	-ls -lh v86_all.js
	cd src &&\
	java -jar $(CLOSURE) \
		--js_output_file "../v86_all.js"\
		--define=DEBUG=false\
		$(CLOSURE_SOURCE_MAP) v86_all.js.map\
		$(CLOSURE_FLAGS)\
		--js $(CORE_FILES)\
		--js $(BROWSER_FILES)

	echo "//# sourceMappingURL=src/v86_all.js.map" >> v86_all.js
	ls -lh v86_all.js


clean:
	rm -f v86-latest.tar.gz v86_all.js src/v86_all.js.map
