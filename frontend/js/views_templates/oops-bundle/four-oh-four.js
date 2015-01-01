FourOhFour = BoundView.extend({
	template: '#four-oh-four',
	initialize: function() {
		this.fragment = Backbone.history.fragment;
	}
});