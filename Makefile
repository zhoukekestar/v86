CLOSURE=../closure-compiler/closure-compiler-v20210302.jar
# CPP=/opt/homebrew/Cellar/llvm/15.0.6/bin/clang-cpp
CPP=cpp-12

all: v86_all.js

src/cpu.js: src/*.macro.js
	# build cpu.macro.js using cpp
	$(CPP) -P -undef -Wundef -std=c99 -nostdinc -Wtrigraphs -fdollars-in-identifiers -C src/cpu.macro.js src/cpu.js

CLOSURE_FLAGS=\
		--compilation_level BUNDLE\
		--externs externs.js


CORE_FILES=const.js io.js cpu.js main.js disk.js pci.js floppy.js memory.js dma.js pit.js vga.js ps2.js pic.js rtc.js uart.js
BROWSER_FILES=browser/main.js browser/screen.js browser/keyboard.js browser/mouse.js

v86_all.js: src/*.js src/browser/*.js src/cpu.js
	-cd src &&\
	java -jar $(CLOSURE) \
		--js_output_file "../v86_all.js"\
		$(CLOSURE_FLAGS)\
		--js $(CORE_FILES)\
		--js $(BROWSER_FILES)

clean:
	rm -f v86-latest.tar.gz v86_all.js src/v86_all.js.map
