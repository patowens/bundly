ViewBundle = BoundLayout.extend({

	template: '#viewBundleTemplate',

	regions: {
		regionCollectionTitle : '.regionCollectionTitle',
		regionCollection: '.regionCollection',
		regionButton: '.regionButton',
		regionResults : '.regionResults'
	},

	initialize: function() {

		/* --- TEMPORARY BEFORE BACKEND --- */
		var m1 = new LinkModel({ url: 'http://wikipedia.com/research', order: 3 });
		var m2 = new LinkModel({ url: 'http://youtube.com/video', order: 1 });
		var m3 = new LinkModel({ url: 'http://uni.com/class', order: 2 });

		var linkCollection = new LinkCollection([m1, m2, m3]);
		linkCollection.sort();
		this.collection = linkCollection;

	},

	onShow: function() {
		this.regionCollectionTitle.show(new CollectionTitleView({ model: this.model, collection: this.collection }));
		this.regionCollection.show(new CollectionOfLinksView({ childView: LinkItemView, collection: this.collection, mode: this.options.mode }));
		this.regionButton.show(new BundleButtonView({ model: this.model, collection: this.collection }));
		this.regionResults.show(new ResultView({ model: this.model, collection: this.collection, mode: this.options.mode }))
	}

});

LinkItemView = BoundLayout.extend({
	template : '#bundledLinkTemplate',
	tagName : 'li',
	className : 'bundled-link',

	initialize: function() {
		this.model.set({id : this.model.cid});
	},

	onRender: function() {
		this.$el.attr('data-id', this.model.id);
	},

	events: {
		'click [data-action=more]' : 'contextMenu'
	},

	contextMenu: function(e) {
		popContextMenuHere(e.currentTarget, this, LinkItemViewContextMenu, { model: this.model, collection: this.collection }, e);
	}

});

LinkItemViewContextMenu = BoundView.extend({
	template: '#contextMenuViewModeTemplate',
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