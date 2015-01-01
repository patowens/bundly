(function(global) {
    var Backbone = global.Backbone;

    // Configure Rivets.js
    global.rivets.adapters[':'] = {
        observe: function(obj, keypath, callback) {
            obj.on('change:' + keypath, callback);
        },
        unobserve: function(obj, keypath, callback) {
            obj.off('change:' + keypath, callback);
        },
        get: function(obj, keypath) {
            return obj.get(keypath);
        },
        set: function(obj, keypath, value) {
            obj.set(keypath, value);
        }
    };

    var mixin = {
        render: function() {
            Backbone.Marionette.ItemView.prototype.render.apply(this, arguments);
            this.bindingView = global.rivets.bind(this.el, { model: this.model, view: this });
            return this;
        },
        remove: function() {
            this.bindingView.unbind();
            Backbone.Marionette.ItemView.prototype.remove.apply(this, arguments);
        }
    };

    global.bound = {};
    global.bound.ItemView   = global.BoundView   = Backbone.Marionette.ItemView.extend(mixin);
    global.bound.LayoutView = global.BoundLayout = Backbone.Marionette.LayoutView.extend(mixin);
}(this));