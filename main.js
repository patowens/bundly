var App = Backbone.Marionette.Application.extend({
	regions: {regionApp: '#app'}
});

var app = new App();
app.regionApp.show(new RootView());
app.start();