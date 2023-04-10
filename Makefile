PATH := node_modules/.bin:$(PATH)

.PHONY: help setup dev develop build_github build deploy clean build

help:
	@echo "Note: Following commands need to be called with Makefile, such as make dev"
	@echo "***************************************************************************"
	#@cat man.txt

setup:
	pnpm i

dev:
	ts-node src/index.ts update-toc

build:
	PATH := node_modules/.bin:$(PATH); \
	rollup -c ./rollup.config.js