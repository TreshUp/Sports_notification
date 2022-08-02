const {GLib, Gtk, GObject, Gio} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const [ok, contents] = GLib.file_get_contents(Me.dir.get_path() + '/db.json');
if (ok) {
    var json_data = JSON.parse(contents);
}

const SportsScope = GObject.registerClass({
    Implements: [Gtk.BuilderScope],
}, class SportsScope extends GObject.Object {

    vfunc_create_closure(builder, handlerName, flags, connectObject) {
        if (flags & Gtk.BuilderClosureFlags.SWAPPED)
            throw new Error('Unsupported template signal flag "swapped"');
        
        if (typeof this[handlerName] === 'undefined')
            throw new Error(`${handlerName} is undefined`);
        
        return this[handlerName].bind(connectObject || this);
    }
    
    on_but_add_clicked(widget, button) {
        let dialog = dialog_creation(widget);
        dialog.show();
        // TODO reopen bag
    }
    
    on_sports_changed(sports_cmb, league_cmb, button) {
        log("Type1:" + league_cmb.get_model());
        let model = sports_cmb.get_model();
        let [success, iter] = sports_cmb.get_active_iter();
        // todo exception
        let value = model.get_value(iter, 0);
        // array of objects
        let arr_leagues = json_data[value];
        let tree_league_combo = league_cmb.get_model();
        tree_league_combo.clear();

        for (let item of arr_leagues) {
            tree_league_combo.set(tree_league_combo.append(), [0], Object.keys(item));          
        }
    }
});

function init () {}

function buildPrefsWidget () {

    {
        let GioSSS = Gio.SettingsSchemaSource;
        let schemaSource = GioSSS.new_from_directory(
            Me.dir.get_child("schemas").get_path(),
            GioSSS.get_default(),
            false
          );
        let schemaObj = schemaSource.lookup(
            'org.gnome.shell.extensions.sportsnotifications', true);

        this.settings = new Gio.Settings({ settings_schema: schemaObj });
    }

    this.builder = new Gtk.Builder();

    this.builder.set_scope(new SportsScope());
    //builder.set_translation_domain('gettext-domain');
    this.builder.add_from_file(Me.dir.get_path() + '/gtk4.ui');
    this.bind_settings();
    return this.builder.get_object('settings_page');
}

function bind_settings () {
    let tree_model = this.builder.get_object('list_sports');

    let arr = this.settings.get_value('array-of-sports');
    const variant_arr = arr.deepUnpack();
    let arr_length = Object.keys(variant_arr).length;

    for (let idx = 0; idx < arr_length; idx++)
    {
        let g_array = variant_basic_types(Object.values(variant_arr[idx]));
        tree_model.set(tree_model.append(), [...Array(g_array.length).keys()], g_array);
    }

    fill_in_combos();

    let but_add = this.builder.get_object('but_add');
    let scope = this.builder.get_scope();
    but_add.connect('clicked', scope.on_but_add_clicked.bind(this, 
        this.builder.get_object('view_base_settings')));
}

function variant_basic_types(array_of_variants) {
    let map_lamdas = new Map();
    map_lamdas.set("s", (element) => { return element.get_string(); });
    map_lamdas.set("i", (element) => { return element.get_int32(); });

    let array_of_types = array_of_variants.map((element) => {
        let type = element.get_type_string();
        let val = map_lamdas.get(type)(element);
        // Because get_string returns string and it's length
        if (typeof val === 'object')
            return val[0];
        else
            return val;
    });
    
    let tmp_f = Object.keys(json_data)[array_of_types[0]];
    array_of_types[0] = tmp_f;
    
    // key -> el of array -> first el of array of strings
    array_of_types[1] = Object.keys(json_data[tmp_f][array_of_types[1]])[0];
    return array_of_types;
}

function prepare_combo(combo, cmb_type) {
    let tree_combo = new Gtk.ListStore();
    tree_combo.set_column_types([cmb_type]);

    combo.set_model(tree_combo);
    let renderer = new Gtk.CellRendererText();
    combo.pack_start(renderer, true);
    combo.add_attribute(renderer, 'text', 0);
    return tree_combo;
}

function fill_in_combos() {
    // log("Type2:" + Object.keys(json_data));
    sports_combo = this.builder.get_object('cmb_sports');
    tree_sports_combo = prepare_combo(sports_combo, GObject.TYPE_STRING);
    for (let item of Object.keys(json_data)) {
        tree_sports_combo.set(tree_sports_combo.append(), [0], [item]);    
    }      
    
    // TODO exceptions
    league_combo = this.builder.get_object('cmb_league');
    tree_league_combo = prepare_combo(league_combo, GObject.TYPE_STRING);
    let scope = this.builder.get_scope();
    sports_combo.connect('changed', scope.on_sports_changed.bind(this, 
        sports_combo, league_combo));
}

function dialog_creation(widget) {
    let dialog = new Gtk.Dialog({
        title: ("Base settings"),
        default_width: 350,
        default_height: 300,
        // TODO
        // transient_for
        modal: true
    });
    let dialogArea = dialog.get_content_area();
    dialogArea.append(widget);
      
    dialog.connect('close-request', () => {
        dialog.destroy();
    });
    return dialog;
}