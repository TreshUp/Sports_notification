.DEFAULT_GOAL = install
.SILENT: install clean

# TODO remake make after moving schemas away from src (add targets before install)
# TODO use copy instead of link
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

schemas:
	glib-compile-schemas $(link_path)/schemas --strict

gnome_ui:
	gtk4-builder-tool simplify --3to4 $(mkfile_dir)/utils/sports.glade > $(mkfile_dir)/utils/sports.ui
	python3 $(mkfile_dir)/utils/ui_converter.py
	rm $(mkfile_dir)/utils/sports.ui

.PHONY: install clean