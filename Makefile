.DEFAULT_GOAL = install
.SILENT: install clean

# TODO parse uuid
ex_name = sports_notifications@tr.com
mkfile_path = $(abspath $(lastword $(MAKEFILE_LIST)))
mkfile_dir = $(dir $(mkfile_path))
link_path = ~/.local/share/gnome-shell/extensions/$(ex_name)

install:
	if ! [ -L $(link_path) ]; then \
		ln -s $(mkfile_dir)/src $(link_path); \
	else \
		echo "Already exist"; \
	fi

clean:
	if [ -L $(link_path) ]; then \
		unlink $(link_path); \
	else \
		echo "Doesn't exist"; \
	fi
	

.PHONY: install clean