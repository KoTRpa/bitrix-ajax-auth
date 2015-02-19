"use strict";

// requere ejs and jquery!

// @TODO: documentation
//
 
var log = function(){
	if (console != undefined && console.log != undefined)
		console.log(arguments);

	return false;
}

var Service = {};

// @TODO: check JQuery or alter methods
// 

(function(context){
	var
		// private methods
		sendAjax = function(url, data, method, callback) {// @TODO: errors handling
			showLoader();
			switch (method){
				case 'post':
				case 'put':
				case 'delete': 
					data.method = method;
					$.ajax({
						url: url,
						type: 'post',
						data: data,
						success: function (res) {
							hideLoader();
							callback(res);
						}
					});
					break;

				default:
					$.getJSON(url, data, function(res){
						hideLoader();
						callback(res);
					});
			}
		},

		showLoader = function(){
			$('.ajax-loader').addClass('active');
		},
		hideLoader = function(){
			$('.ajax-loader').removeClass('active');
		},

		showAlert = function(msg, status, cont) {
			if (status == undefined)
				status = 'error';

			if (msg instanceof Array)
				msg = new EJS({url: '/include/ejs/errors_list.ejs'}).render({errors:msg});

			if (cont != undefined)
				cont.find('.alert').addClass('alert-' + status).html(msg);
			else
				$('.alert').addClass('alert-' + status).html(msg);
		};

	// public api
	context.getAjax = function(url, data, callback){
		sendAjax(url, data, 'get', callback);
	}

	context.postAjax = function(url, data, callback){
		sendAjax(url, data, 'post', callback);
	}

	context.validate = function(val) {
		return ($.trim(val).length > 0);
	}

	context.validateEmail = function(email) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	context.showError = function(msg, cont) {
		showAlert(msg, 'error', cont);
	}

	context.showSuccess = function(msg, cont) {
		showAlert(msg, 'success', cont);
	}

	context.hideAlert = function(cont) {
		var $alert;

		if (cont != undefined)
			$alert = cont.find('.alert');
		else
			$alert = $('.alert');

		// clear all classes alert-*
		$alert.attr('class', function(i, c) { 
			return c.replace(/\balert-.+\b/gi, ''); 
		}).html('');
	}

})(Service);