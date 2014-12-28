var RootView = Marionette.LayoutView.extend({ 
	
	template: '#rootTemplate',
	
	regions: {
		regionHeader: '#header',
		regionMain: '#main',
		regionFooter: '#footer',
	},

	onRender: function() {

		var m1 = new LinkModel({ url: 'one' });
		var m2 = new LinkModel({ url: 'two' });
		var m3 = new LinkModel({ url: 'three' });

		var bundle = new LinkCollection([m1]);
		this.regionMain.show(new BundlerLayout({ collection: bundle }));
	}

});