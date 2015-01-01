ModalView = BoundLayout.extend({

	template: '#modalLayout',
	className: 'modal-outer',

	initialize: function(options) {
		this.specificView = options.specificView;
		this.specificViewOptions = options.options;

		app.vent.on('close-modals', function() {
			app.regionModal.empty();			
		});

	},
	
	regions: { 
		regionModalHeader : '.region-modal-header',
		regionModalContent : '.region-modal-content'
	},

	onShow: function() {
		this.$el.append('<div class="full-blanket"></div>');
		this.regionModalHeader.show(new ModalHeader({ specificViewOptions: this.specificViewOptions }));
		this.regionModalContent.show(new this.specificView({ model: this.model, collection: this.collection, specificViewOptions: this.specificViewOptions }));		
		this.$el.find('.modal-inner').draggable();
	},

	events: {
		'click [data-action=close]' : 'closeModal'
	},

	closeModal: function() {
		app.regionModal.empty();
	}

});

ModalHeader = BoundView.extend({
	template: '#modalHeader',
	initialize: function(options) {
		if (options.specificViewOptions) {
			this.closable = options.specificViewOptions.closable;
			this.title = options.specificViewOptions.title;
		}
	}
});

function popModalHere(specificView, model, collection, options, event) {
	
	if (event) {
		event.stopPropogation();
		event.preventDefault();
	}

	app.regionModal.show(new ModalView({ 
		specificView : specificView,
		model: model,
		collection: collection,
		options: options
	}));
}

EditLink = BoundView.extend({
	template : '#editLink'
});