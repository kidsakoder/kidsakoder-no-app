.PHONY: start stop clean down restart build init logs

init:
	@./scripts/init.sh

build:
	@./scripts/run.sh

start:
	@./scripts/run.sh

restart:
	@./scripts/redeploy.sh

clean:
	@docker-compose rm --force

stop:
	@./scripts/stop.sh

logs:
	@./scripts/logs.sh
