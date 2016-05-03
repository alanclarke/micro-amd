.PHONY: test

BIN = node_modules/.bin

test:
	$(BIN)/standard
	$(BIN)/karma start --single-run
