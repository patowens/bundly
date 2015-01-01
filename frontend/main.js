var App = Backbone.Marionette.Application.extend({
	
	regions: {
		regionApp     : '#app',
		regionHeader  : '#header',
		regionMain    : '#main',
		regionFooter  : '#footer',
		regionModal   : '#modal'
	},

	initialize: function() {

		// Prevent internal links from causing a page refresh.
	    $(document).on('click', 'a', function(event) {
	        var fragment = Backbone.history.getFragment($(this).attr('href'));
	        var matched = _.any(Backbone.history.handlers, function(handler) {
	            return handler.route.test(fragment);
	        });
	        if (matched) {
	            event.preventDefault();
	            Backbone.history.navigate(fragment, { trigger: true });
	        }
	    });


	    /* -------------------------- *\
	       ----- CONTEXT MENUS ------ 
	    \* -------------------------- */
	    $(document).click(function() {
	    	app.vent.trigger('close-context-menus');
	    });

	    $('.cm').click(function(e) {
	    	e.stopPropagation();
	    });

		this.regionModal.on('show', function (view) {
      		$('#modal').show();
	    });
	    
	    this.regionModal.on('empty', function (view) {
	    	$('#modal').hide();
	    });

	}
});

AppController = Backbone.Marionette.Controller.extend({

	index: function() {
		
		var m1 = new LinkModel({ url: 'http://wikipedia.com/research', order: 3 });
		var m2 = new LinkModel({ url: 'http://youtube.com/video', order: 1 });
		var m3 = new LinkModel({ url: 'http://uni.com/class', order: 2 });

		var linkCollection = new LinkCollection([]);
		linkCollection.sort();

		var bundleModel = new BundleModel();

		// var handle = 'kT3a4'
		// var bundleModel = new BundleModel({ 
		// 	handle : handle,
		// 	url : handle,
		// 	fullUrl : 'http://bund.ly/' + handle,
		// 	urlsById : ['c4','c6','c8'],
		// 	urlsByValue : ['http://wikipedia.com/research', 'http://youtube.com/video', 'http://uni.com/class'],
		// 	shortUrl : 'bund.ly/' + handle
		// });

		app.regionMain.show(new BundlerLayout({ model: bundleModel, collection: linkCollection, mode: 'edit' }));
		// this.regionMain.show(new BundlerLayout({ model: bundleModel, collection: linkCollection }));

	},
	
	viewBundle: function(bundle) {
		
		// fetch bundle
		var bundle = new BundleModel({ id: Backbone.history.fragment });
		bundle.fetch({
			success: function() {
				app.regionMain.show(new FourOhFour());
			},
			error: function() {
				/* --- TEMPORARY BEFORE BACKEND --- */
				var handle = 'kT3a4'
				var bundleModel = new BundleModel({ 
					handle : handle,
					url : handle,
					shortUrl : 'bund.ly/' + handle,
					title: 'Pre-reading pack'
				});
				app.regionMain.show(new ViewBundle({ model: bundleModel, mode: 'view' }));
			}
		});

	},

	editBundle: function() {
		
	}

});

var AppRouter = Backbone.Marionette.AppRouter.extend({
	
	controller: new AppController,

	appRoutes: {
		"" : "index",
    	":handle" : "viewBundle",
    	":handle/edit" : "editBundle"
  	}

});

// Start app.
var app = new App();
app.appRouter = new AppRouter();
Backbone.history.start({ pushState: true });
app.start();

// Going somewhere?
if (getParameterByName('redirect').length > 0) {
	Backbone.history.navigate(getParameterByName('redirect'), { trigger: true });
}