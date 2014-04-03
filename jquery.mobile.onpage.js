(function( $, undefined ) {
	var globalPagecontainer,
		events = {},
		from = [ "pagecontainerbeforechange", "pagecontainerbeforeload", "pagecontainerbeforehide", "pagecontainerhide", "pagecontainerremove" ],
		deffered = $.Deferred(function( defer ){
			$.widget( "mobile.pagecontainer", $.mobile.pagecontainer, {
				_create: function(){
					globalPagecontainer = this.element;
					defer.resolve();
					this._super();
				}
			});
		}).promise();

	$.fn.onPage = function( eventName, element, callback ) {
		var pagecontainer,
			delegated = ( callback ),
			eventNames = eventName.split( " " );

		if( this.length === 0 ) {
			return;
		}
		if ( !delegated ) {
			callback = element;
			element = this.selector;
			pagecontainer = $( this ).closest( ":mobile-pagecontainer" );
			if( pagecontainer.length === 0 ) {
				return;
			}
		}
		$.each( eventNames, function( index, event ) {
			deffered.done( function(){
				console.log( "process" );
				if( delegated ) {
					pagecontainer = globalPagecontainer;
				}
				processEvent( event, element, callback );
			});
		});
		function processEvent( event, element, callback ) {
			if ( typeof events[ event ] === "undefined" ) {
				events[ event ] = [];
				events[ event ].push({
					element: element,
					callback: callback
				});
				var options = {};
				options[ event ] = handleEvent;
				pagecontainer.pagecontainer(options);
			} else {
				events[ event ].push({
					element: element,
					callback: callback
				});
			}
		}
		function handleEvent( event, ui ){
			var args = arguments;
			$.each( events[ event.type.replace( /pagecontainer/, "" ) ], function( index, callback ) {
				if ( from.indexOf( event.type ) !== -1 && ui.prevPage.is( callback.element ) && ui.prevPage !== undefined ) {
					callback.callback.apply( ui.prevPage, args );
				} else if ( ui.toPage.is( callback.element ) ){
					callback.callback.apply( ui.toPage, args );
				}
			});
		}
	};
})( jQuery, this );
