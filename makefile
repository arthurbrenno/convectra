.PHONY: run

.DEFAULT_GOAL := run

run:
	bun run index.ts

drun:
	docker compose up

dbuild:
	docker compose up --build

ddown:
	docker compose down
