#!/bin/bash

make clean
make

echo "build success!"
npx serve . -p 80