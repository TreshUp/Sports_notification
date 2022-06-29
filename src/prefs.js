const {Gtk, GObject} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const MyBuilderScope = GObject.registerClass({
    Implements: [Gtk.BuilderScope],
}, class MyBuilderScope extends GObject.Object {

    vfunc_create_closure(builder, handlerName, flags, connectObject) {
        if (flags & Gtk.BuilderClosureFlags.SWAPPED)
            throw new Error('Unsupported template signal flag "swapped"');
        
        if (typeof this[handlerName] === 'undefined')
            throw new Error(`${handlerName} is undefined`);
        
        return this[handlerName].bind(connectObject || this);
    }
    
    on_btn_click(connectObject) {
        connectObject.set_label("Clicked");
    }
});

function init () {}

function buildPrefsWidget () {

    let builder = new Gtk.Builder();

    builder.set_scope(new MyBuilderScope());
    //builder.set_translation_domain('gettext-domain');
    builder.add_from_file(Me.dir.get_path() + '/gtk4.ui');
    return builder.get_object('settings_page');
}