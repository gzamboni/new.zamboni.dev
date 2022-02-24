SHELL := bash
VERSION ?= latest
TAG ?= $(VERSION)

HUGO_VERSION ?= "0.92.2"

BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD | tr '/' '-' | cut -c -25)
COMMIT ?= $(shell git rev-parse --short=10 HEAD)
FULL_COMMIT ?= $(shell git rev-parse HEAD)
check_defined = \
    $(strip $(foreach 1,$1, \
        $(call __check_defined,$1,$(strip $(value 2)))))
__check_defined = \
    $(if $(value $1),, \
      $(error Undefined $1$(if $2, ($2))))
.PHONY: help

help: ## Show this help message
	@echo "zamboni.dev Makefile help.\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install all nodejs dependencies
	@echo "Installing nodejs dependencies..."
	@npm install

fetchposts: ## Fetch all posts from the zamboni.dev server
	$(call check_defined, NOTION_KEY)
	@echo "Fetching posts..."
	@npx motionlink $(NOTION_KEY)
	@echo "Cleanup..."
	@bin/unescape.sh 

hugobuild: ## Build all static files using Hugc CMS
	@echo "Building hugo static files..."
	@hugo --gc --minify

ci: fetchposts hugobuild ## Build hole thing

server: fetchposts ## Start the hugo server
	@echo "Starting hugo server..."
	@hugo server 