const Main = imports.ui.main;
const St = imports.gi.St;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let myPopup;

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
  }

  createButton(iconName, accessibleName) {
    let button;

    button = new St.Button({
        reactive: true,
        can_focus: true,
        track_hover: true,
        accessible_name: accessibleName,
        //style_class: 'message-list-clear-button button openweather-button-action'
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