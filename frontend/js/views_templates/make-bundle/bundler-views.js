BundlerLayout = BoundLayout.extend({

	template: '#bundlerLayoutTemplate',

	regions: {
		regionCollectionTitle : '.regionCollectionTitle',
		regionCollection: '.regionCollection',
		regionButton: '.regionButton',
		regionResults : '.regionResults'
	},

	initialize: function(options) {
		this.options = options;
	},

	onShow: function() {

		this.ui.urlInput.focus();

		this.regionCollectionTitle.show(new CollectionTitleView({ model: this.model, collection: this.collection }));
		this.regionCollection.show(new CollectionOfLinksView({ childView: LinkItemViewEdit, collection: this.collection, parentOptions: this.options }));
		this.regionButton.show(new BundleButtonView({ model: this.model, collection: this.collection }));
		this.regionResults.show(new ResultView({ model: this.model, collection: this.collection }))
	},

	events: {
		'click [data-action=add]' : 'addItem',
		'form submit' : 'addItem'
	},

	ui: {
		urlInput : 'input[type=text]'
	},

	addItem: function(e) {

		// some checks
		e.preventDefault();
		if (this.ui.urlInput.val().length == 0)
		return true;
		
		// create model
		var linkModel = new LinkModel()
		linkModel.set({ 
			url: this.ui.urlInput.val()
		});

		// add to collection
		this.collection.add(linkModel);

		// clear input
		this.ui.urlInput.val('');
	}

});

ViewBundle = BoundLayout.extend({
	template: '#viewBundle'
});

CollectionTitleView = BoundView.extend({
	template: '#bundleTitleTemplate',
	
	initialize: function(options) {
		this.listenTo(this.model, "change:title", function() { 
			// do something
		});
	}

});

LinkItemViewEdit = BoundLayout.extend({
	template : '#bundledLinkEditTemplate',
	tagName : 'li',
	className : 'bundled-link',

	initialize: function() {
		this.model.set({id : this.model.cid});
	},

	events: {
		'click [data-action=remove]' : 'removeModel',
		'click [data-action=more]' : 'contextMenu'
	},

	onRender: function() {
		this.$el.attr('data-id', this.model.id);
	},

	removeModel: function(e) {
		e.preventDefault();
		this.model.destroy();
	},

	contextMenu: function(e) {
		popContextMenuHere(e.currentTarget, this, LinkItemEditContextMenu, { model: this.model, collection: this.collection }, e);
	}

});

CollectionOfLinksView = Backbone.Marionette.CollectionView.extend({
	
	tagName: 'ul',
	className: 'bundled-links',

	initialize: function(options) {
		this.options = options;
	},

	onShow: function() {

		if (this.options.mode == undefined) {
			this.$el.sortable();
		}

		// detected sorting has changed, store the sort order.
		this.$el.on("sortupdate", function( event, ui ) {
			_.each(this.$el.children(), function(ui, i) {
				var cid = ($(ui).attr('data-id'));
				var model = this.collection.get({ cid : cid });
				model.set({ order: i+1 });
			}.bind(this));
		}.bind(this));
	}
});

BundleButtonView = BoundView.extend({
	
	template: '#bundleButtonTemplate',
	
	events: {
		'click button' : 'generate'
	},

	initialize: function() {

		this.disabled = this.collection.length < 2;
		this.ready = false;

		this.listenTo(this.collection, 'add remove', function() {
			this.disabled = this.collection.length < 2;
		}.bind(this));

	},

	onRender: function() {

		

	}

});

ResultView = BoundView.extend({

	template: '#bundleResultsTemplate',
	
	ui: {
		'textInput' : 'input'
	},

	events: {
		'click button[data-action=copy]' : 'copy',
		'click button[data-action=share]' : 'share',
	},

	initialize: function() {
		
		this.ready = false;
		this.listenTo(this.collection, 'add remove', function() {
			if (this.collection.length > 0) {
				this.generate();
			} else {
				this.ready = false;
			}
		}.bind(this));

		if (this.model.get('url')) {
			this.ready = true	
		}

	},

	generate: function() {

		var urlsById = _.map(this.collection.models, function(model) {return model.get('id'); });
		var urlsByValue = _.map(this.collection.models, function(model) {return model.get('url'); });
		var handle = this.model.get('url') || makeid();

		this.model.set({ 
			handle : handle,
			url : handle,
			fullUrl : handle,
			urlsById : urlsById,
			urlsByValue : urlsByValue,
			shortUrl : 'bund.ly/' + handle
		});

		setTimeout(function() {
			this.ready = true;
		}.bind(this), 1500)
	},

	copy: function() {
		copyToClipboard(this.ui.textInput.val());
	},

	share: function() {
		alert('share?');
	}

});

LinkItemEditContextMenu = BoundView.extend({
	template: '#contextMenuTemplate',
	className: 'cm-inner',
	events: {
		'click [data-action=edit]' : 'edit',
		'click [data-action=delete]' : 'delete',
	},

	initialize: function(options) {
		this.model = options.data.model;
		this.collection = options.data.collection;
	},
	
	edit: function() {
		popModalHere(EditLink, this.model, this.collection, { closable: true, title: 'Edit link'});
	},

	delete: function() {

	}

});

/* --------- UTILS --------- */

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
    return text;
};

function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
};

function popContextMenuHere(element, parentView, menuView, options, event) {
	
	/* -------------------------------------- *\
	  This function displays a context
	  menu just below the defined element
	  It injects a snippet of html, assigns
	  a region against the element and
	  shows the chosen view within the region.
	\* -------------------------------------- */
		
	// close all popups
	app.vent.trigger('close-context-menus');

	if (event) 
		event.preventDefault();
		event.stopPropagation();

	if (!parentView.regionContextMenu) {
		// add neighbouring element			
		$(element).append('<div class="cm"></div>');
		// add region to parent view
		parentView.addRegions({ regionContextMenu: '.cm' });
	}
	
	// show context menu in new region
	parentView.regionContextMenu.show(new menuView({ data: options }));

	// handle the closing of the view whenever needed.
	app.vent.on('close-context-menus', function() {
		if (parentView.regionContextMenu)
			parentView.regionContextMenu.empty();
	}.bind(this));

};