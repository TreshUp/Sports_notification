const { St, Clutter, GObject, Gio, Gtk } = imports.gi;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const MyPopup = GObject.registerClass(
  class MyPopup extends PanelMenu.Button {
    _init() {
      super._init(0);

      // Creation of base class with logo
      let icon = new St.Icon({
        gicon: Gio.icon_new_for_string(Me.dir.get_path() + "/sports.svg"),
        style_class: "system-status-icon",
      });
      this.add_child(icon);

      // this.menu.addMenuItem( new PopupMenu.PopupSeparatorMenuItem() );a

      // this.menu.connect("open-state-changed", (menu, open) => {
      //   if (open) {
      //     log("opened");
      //     const gtkVersion = Gtk.get_major_version();

      //     log(`GTK version is ${gtkVersion}`);
      //   } else {
      //     log("closed");
      //   }
      // });

      // Layout creation
      this.box_content = new St.BoxLayout({
        style_class: "content-box",
        vertical: true,
      });

      let prefs_button = new St.Button({
        x_align: Clutter.ActorAlign.END,
        reactive: true,
        can_focus: true,
        track_hover: true,
        accessible_name: "accessibleName",
        style_class:
          "message-list-clear-button button openweather-button-action",
      });

      prefs_button.child = new St.Icon({
        icon_name: "preferences-system-symbolic",
      });
      prefs_button.connect("clicked", this.my_test_func.bind(this));
      this.box_content.add(prefs_button);

      this._weatherInfo = new St.Label({
        /*style_class: "openweather-label",*/
        text: _("Loading"),
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
      });

      let team_icon = new St.Icon({
        gicon: Gio.icon_new_for_string(Me.dir.get_path() + "/detroit.svg"),
        x_expand: true,
      });
      team_icon.set_icon_size(300);

      this.box_content.add(team_icon);
      this.menu.box.add_child(this.box_content);

      // you can close, open and toggle the menu with
      // this.menu.close();
      // this.menu.open();
      // this.menu.toggle();
    }

    my_test_func() {
      this.menu.close();
      log("closed");
      ExtensionUtils.openPrefs();
      return 0;
    }
  }
);

function init() {}

function enable() {
  myPopup = new MyPopup();
  Main.panel.addToStatusArea("myPopup", myPopup, 1);
}

function disable() {
  myPopup.destroy();
}
