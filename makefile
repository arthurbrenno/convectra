.PHONY: run

.DEFAULT_GOAL := run

run:
	bun run index.ts

dbuild:
	docker compose up
