BundleModel = Backbone.Model.extend({});
LinkCollection = Backbone.Collection.extend({});
LinkModel = Backbone.Model.extend({});

BundlerLayout = window.BoundLayout.extend({

	template: '#bundlerLayoutTemplate',

	initialize: function(options) {
		this.model = new BundleModel();
	},

	regions: {
		regionCollectionTitle : '.regionCollectionTitle',
		regionCollection: '.regionCollection',
		regionButton: '.regionButton',
	},

	onShow: function() {
		this.regionCollectionTitle.show(new CollectionTitleView({ model: this.model, collection: this.collection}));
		this.regionCollection.show(new CollectionOfLinksView({ collection: this.collection}));
		this.regionButton.show(new BundleButtonView({ model: this.model, collection: this.collection}));
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

CollectionTitleView = BoundView.extend({
	template: '#bundleTitleTemplate',
	
	initialize: function(options) {
		this.listenTo(this.model, "change:title", function() { 
			// do something
		});
	}

});

LinkItemView = BoundView.extend({
	template : '#bundledLinkTemplate',
	tagName : 'li',
	className : 'bundled-link',

	events: {
		'click [data-action=remove]' : 'removeModel'
	},

	removeModel: function(e) {
		e.preventDefault();
		this.model.destroy();
	} 	


});

CollectionOfLinksView = Backbone.Marionette.CollectionView.extend({
	childView: LinkItemView,
	tagName: 'ul',
	className: 'bundled-links',

	onRender: function() {
		this.$el.sortable();
	}
});

BundleButtonView = BoundView.extend({
	
	template: '#bundleButtonTemplate',
	
	events: {
		'click button' : 'generate'
	},

	initialize: function() {

		this.disabled = true;

		this.listenTo(this.collection, 'add remove', function() {
			this.disabled = this.collection.length < 2;
		}.bind(this));
	},

	generate: function() {
		var urls = _.map(this.collection.models, function(model) {return model.get('url'); });
		console.log(urls);
	}

});
