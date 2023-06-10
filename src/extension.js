const { St, Clutter, GObject, Gio, Gtk} = imports.gi;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let myPopup;

function getSettings() {
  let GioSSS = Gio.SettingsSchemaSource;
  let schemaSource = GioSSS.new_from_directory(
    Me.dir.get_child("schemas").get_path(),
    GioSSS.get_default(),
    false
  );

  log("path:" + Me.dir.get_child("schemas").get_path());
  let schemaObj = schemaSource.lookup(
    "org.gnome.shell.extensions.sportsnotifications",
    true
  );
  if (!schemaObj) {
    throw new Error("cannot find schemas");
  }
  return new Gio.Settings({ settings_schema: schemaObj });
}

const MyPopup = GObject.registerClass(
  class MyPopup extends PanelMenu.Button {
    _init() {
      super._init(0);

      // Creation of base class with logo
      let icon = new St.Icon({
        //   icon_name : 'security-low-symbolic',
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
        style_class: 'message-list-clear-button button openweather-button-action',
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
      // let topBox = new St.BoxLayout({
      //   style_class: "panel-status-menu-box",
      // });

      // let th = new Gtk.IconTheme();
      // //th.append_search_path(Me.dir.get_path());
      // //log("path: " + th.get_search_path());
      // //let lol = th.load_icon_for_scale("detroit.svg", 225, 2, Gtk.IconLookupFlags.FORCE_SVG);
      // let lol = th.lookup_by_gicon_for_scale(
      //   Gio.icon_new_for_string(Me.dir.get_path() + "/detroit.svg"),
      //   225,
      //   2,
      //   Gtk.IconLookupFlags.FORCE_SVG
      // );
      // log("puf: " + lol.constructor.name);

      // let lol = GdkPixbuf.Pixbuf.new_from_file_at_scale(Me.dir.get_path() + "/detroit.svg",
      // 2 * 225, 2 * 225, false);
      // const pixels = lol.read_pixel_bytes();
      // log("pixels: " + pixels.constructor.name);
      // const content = St.ImageContent.new_with_preferred_size(
      //   lol.width,
      //   lol.height
      // );
      // content.set_bytes(
      //   pixels,
      //   Cogl.PixelFormat.RGB_888,
      //   lol.width,
      //   lol.height,
      //   lol.rowstride
      // );
      let team_icon = new St.Icon({
        gicon: Gio.icon_new_for_string(Me.dir.get_path() + "/detroit.svg"),
        x_expand: true,
      });
      team_icon.set_icon_size(300);

      this.box_content.add(team_icon);
      // topBox.add(this._weatherInfo);

      // this.menu.box.add_child(topBox);
      this.menu.box.add_child(this.box_content);

      // you can close, open and toggle the menu with
      // this.menu.close();
      // this.menu.open();
      // this.menu.toggle();
    }

    my_test_func() {
      log("my_test_clicked");
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
