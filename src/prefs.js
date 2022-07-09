const {Gtk, GObject, Gio} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

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
    
    on_but_add_clicked(connectObject) {
        connectObject.set_label("Clicked");
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
    
    let code = false, f_path = null;
    if (arr_length != 0)
    {
        tree_model.append();
        [code, f_path] = tree_model.get_iter_first();
    }

    for (let idx = 0; idx < arr_length; idx++)
    {
        //log("Vals:" + Object.values(variant_arr[idx])[3].get_type_string());
        let g_array = variant_basic_types(Object.values(variant_arr[idx]));
        tree_model.set(f_path, [...Array(g_array.length).keys()], g_array);
    }

}

function variant_basic_types(array_of_variants) {
    let map_lamdas = new Map();
    map_lamdas.set("s", (element) => { return element.get_string(); });
    map_lamdas.set("i", (element) => { return element.get_int32(); });

    let array_of_types = array_of_variants.map((element) => {
        let type = element.get_type_string();
        let val = map_lamdas.get(type)(element);
        // Because get_string returns string and its length
        if (typeof val === 'object')
            return val[0];
        else
            return val;
      });

    return array_of_types;
}