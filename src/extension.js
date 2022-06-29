const {St, GObject, Gio, Gtk, GLib} = imports.gi;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let myPopup;

function getSettings () {
  let GioSSS = Gio.SettingsSchemaSource;
  let schemaSource = GioSSS.new_from_directory(
    Me.dir.get_child("schemas").get_path(),
    GioSSS.get_default(),
    false
  );


  log("path:" + Me.dir.get_child("schemas").get_path())
  let schemaObj = schemaSource.lookup(
    'org.gnome.shell.extensions.sportsnotifications', true);
  if (!schemaObj) {
    throw new Error('cannot find schemas');
  }
  return new Gio.Settings({ settings_schema : schemaObj });
}

const MyPopup = GObject.registerClass(
class MyPopup extends PanelMenu.Button {

  _init () {
  
    super._init(0);
    
    // Creation of base class with logo

    let icon = new St.Icon({
    //   icon_name : 'security-low-symbolic',
      gicon : Gio.icon_new_for_string( Me.dir.get_path() + '/sports.svg' ),
      style_class : 'system-status-icon',
    });
   
    this.add_child(icon);

    
    
    // this.menu.addMenuItem( new PopupMenu.PopupSeparatorMenuItem() );a
    
    this.menu.connect('open-state-changed', (menu, open) => {
      if (open) {
        log('opened');
      } else {
        log('closed');
      }
    });
    
    // image item
    let popupImageMenuItem = new PopupMenu.PopupImageMenuItem(
      'Menu Item with Icon',
      'security-high-symbolic',
    );
    this.menu.addMenuItem(popupImageMenuItem);

    // Layout creation
    this.box_content = new St.BoxLayout({ style_class: 'timepp-content-box', vertical: true});
    
    // ??
    this.box_content._delegate = this;

    let prefsButton = this.createButton('preferences-system-symbolic', _("Weather Settings"));
    prefsButton.connect('clicked', this.my_test_func.bind(this));
    this.box_content.add_actor(prefsButton);

    this.menu.box.add_child(this.box_content);
  
    
    // you can close, open and toggle the menu with
    // this.menu.close();
    // this.menu.open();
    // this.menu.toggle();


    let settings = getSettings();
  
    // my array
    //settings.set_strv('my-array', ['new', 'new2']);
    let arr = settings.get_value('array-of-sports');
    log("Type" + arr.get_type());
    const shallowDictUnpacked = arr.deepUnpack();
    log("len:" + Object.keys(shallowDictUnpacked).length);
    log("Index:" + Object.values(shallowDictUnpacked)[0])
    log("Vals:" + Object.values(shallowDictUnpacked));
    log("Keys:" + Object.keys(shallowDictUnpacked));
    // log("arr" + arr.print(true));

    let el_arr = Object.values(shallowDictUnpacked)[0];
    log("Keys:" + Object.keys(el_arr));
    log("string:" + el_arr['delta_h'].get_int32());

    const variant = new GLib.Variant('aa{sv}', [{
      name: GLib.Variant.new_string('Mario'),
      lives: GLib.Variant.new_uint32(3),
      active: GLib.Variant.new_boolean(true),
  },
  {
    name: GLib.Variant.new_string('2'),
    lives: GLib.Variant.new_uint32(22),
    active: GLib.Variant.new_boolean(false),
  }]);
    log("example" + variant.print(true))
    log("example len:" + Object.keys(variant.deepUnpack()).length)
    log("example Index:" + Object.values(variant.deepUnpack())[0])
    log("Keys:" + Object.keys(variant.deepUnpack()));
    log(Me.path)
    const gtkVersion = Gtk.get_major_version();

    log(`GTK version is ${gtkVersion}`);
  }

  createButton(iconName, accessibleName) {
    let button;

    button = new St.Button({
        reactive: true,
        can_focus: true,
        track_hover: true,
        accessible_name: accessibleName,
        style_class: 'message-list-clear-button button openweather-button-action'
    });

    button.child = new St.Icon({
        icon_name: iconName
    });

    return button;
}

my_test_func(){
  log('my_test_clicked');
}


});

function init() {
}

function enable() {
  myPopup = new MyPopup();
  Main.panel.addToStatusArea('myPopup', myPopup, 1);
}

function disable() {
  myPopup.destroy();
}