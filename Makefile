PATH := node_modules/.bin:$(PATH)

.PHONY: help setup dev develop build_github build deploy clean build

help:
	@echo "Note: Following commands need to be called with Makefile, such as make dev"
	@echo "***************************************************************************"
	#@cat man.txt

setup:
	yarn

dev:
	# export GITHUB_TOKEN=
	export GITHUB_API_URL=https://api.github.com ;\
	export GITHUB_REPOSITORY=wangpin34/blog ;\
	ts-node packages/index.ts

build:
	babel packages --out-dir lib \
		--ignore "*.stories.*","__tests__/*" \
		--extensions ".ts" \
		--copy-files \
		--no-copy-ignored