PATH := node_modules/.bin:$(PATH)

.PHONY: help setup update-toc update-markdown build

help:
	@echo "Note: Following commands need to be called with Makefile, such as make dev"
	@echo "***************************************************************************"
	#@cat man.txt

setup:
	pnpm i

update-toc:
	ts-node src/index.ts update-toc

update-markdown:
	ts-node src/index.ts update-markdown

build:
	@export PATH=node_modules/.bin:$(PATH); \
	rollup -c ./rollup.config.js