.PHONY: start stop clean down restart build init

init:
	@./scripts/init.sh

build:
	@./scripts/run.sh

start:
	@./scripts/run.sh

restart:
	@./scripts/redeploy.sh

clean: stop
	@docker-compose rm --force
