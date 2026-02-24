ARGS := $(filter-out generate,$(MAKECMDGOALS))

all:
	bash ./scripts/generate.sh

generate:
	bash ./scripts/generate.sh $(ARGS)

%:
	@: