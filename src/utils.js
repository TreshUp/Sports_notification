const { Gio, GLib, Gtk } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const [ok, contents] = GLib.file_get_contents(Me.dir.get_path() + "/db.json");
if (ok) {
  var json_data = JSON.parse(contents);
}

/**
 * @returns {Gio.Settings} Saved user settings
 */
function get_settings() {
  let GioSSS = Gio.SettingsSchemaSource;
  let schemaSource = GioSSS.new_from_directory(
    Me.dir.get_child("schemas").get_path(),
    GioSSS.get_default(),
    false
  );
  let schemaObj = schemaSource.lookup(
    "org.gnome.shell.extensions.sportsnotifications",
    true
  );

  if (!schemaObj) {
    throw new Error("cannot find schemas");
  }
  return new Gio.Settings({ settings_schema: schemaObj });
}

/**
 * Function which converts Vatiants into ints and strings
 * @param  {Map of Gtk.Variants} array_of_variants    Single object from schema
 */
function variant_basic_types(array_of_variants) {
  // A little hack for converting variants to strings and ints
  // upd can be done with recursiveUnpack instead deepUnpack
  let map_lamdas = new Map();
  map_lamdas.set("s", (element) => {
    return element.get_string();
  });
  map_lamdas.set("i", (element) => {
    return element.get_int32();
  });

  let array_of_types = array_of_variants.map((element) => {
    let type = element.get_type_string();
    let val = map_lamdas.get(type)(element);
    // Because get_string returns string and it's length
    if (typeof val === "object") return val[0];
    else return val;
  });

  // Because of index system of db we need to get values from json
  let tmp_f = Object.keys(json_data)[array_of_types[0]];
  array_of_types[0] = tmp_f;

  // key -> el of array -> first el of array of strings
  array_of_types[1] = Object.keys(json_data[tmp_f][array_of_types[1]])[0];
  return array_of_types;
}

/**
 * Function which creates model, sets type and render
 * @param  {Gtk.ComboBox} combo     Current combobox
 * @param  {GObject} cmb_type       Type of objects in this combo
 */
function prepare_combo(combo, cmb_type) {
  let tree_combo = new Gtk.ListStore();
  tree_combo.set_column_types([cmb_type]);

  combo.set_model(tree_combo);
  let renderer = new Gtk.CellRendererText();
  combo.pack_start(renderer, true);
  combo.add_attribute(renderer, "text", 0);
  return tree_combo;
}
