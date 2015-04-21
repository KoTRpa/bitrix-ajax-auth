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
			var 
				url = '', 
				data = {}, 
				method = 'get', 
				msg = '', 
				callback = function(){}, 
				request_type = 'get';

			switch (arguments.length)
			{
				case 1: // just url
					url = arguments[0];
					break;
				case 2: // url and data
					url = arguments[0];
					data = arguments[1];
					break;
				case 3: // url, data, and callback
					url = arguments[0];
					data = arguments[1];
					callback = arguments[2];
					break;
				case 4: // url, data, method, and callback
					url = arguments[0];
					data = arguments[1];
					method = arguments[2];
					callback = arguments[3];
					break;
				case 5: // url, data, method, msg and callback
					url = arguments[0];
					data = arguments[1];
					method = arguments[2];
					msg = arguments[3];
					callback = arguments[4];
					break;
			}

			showLoader(msg);
			
			if (method != 'get')
				data.method = request_type = method;

			$.ajax({
				url: url,
				type: request_type,
				data: data,
				success: function (res) {
					hideLoader();
					callback(res);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					hideLoader();
					callback({ajax_error: textStatus}, errorThrown);
				}
			});
		},

		uploadFilesAjax = function(url, data, callback) {
			showLoader('Загрузка файлов');
			// @TODO: upload progress bar
			$.ajax({
				url: url,
				type: 'POST',
				data: data,
				cache: false,
				dataType: 'json',
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				success: function(response)
				{
					if(response.success)
					{
						callback();
					}
					else
					{
						// Handle errors here
						console.log('ERRORS: ' + response.error);
						callback(response);
						hideLoader();
					}
				},
				error: function(jqXHR, textStatus, errorThrown)
				{
					// Handle errors here
					console.log('ERRORS: ' + textStatus);
					callback(textStatus);
					hideLoader();
				}
			});
		},

		showLoader = function(msg){
			if(msg != undefined)
				$('.ajax-loader .ajax-info').html(msg);
			else
				$('.ajax-loader .ajax-info').html('');

			$('.ajax-loader').addClass('active');
		},

		hideLoader = function(){
			$('.ajax-loader .ajax-info').html('');
			$('.ajax-loader').removeClass('active');
		},

		showAlert = function(msg, status, $cont) {
			if (status == undefined)
				status = 'error';

			if (msg instanceof Array)
				msg = new EJS({url: '/include/ejs/errors_list.ejs'}).render({errors:msg});

			if ($cont != undefined)
				$cont.find('.alert').addClass('alert-' + status).html(msg);
			else
				$('.alert').addClass('alert-' + status).html(msg);
		};

	// public api
	context.getAjax = function(url, data, callback){
		sendAjax(url, data, 'get', callback);
	}

	context.getAjaxMsg = function(url, data, msg, callback){
		sendAjax(url, data, 'get', msg, callback);
	}

	context.postAjax = function(url, data, callback){
		sendAjax(url, data, 'post', callback);
	}

	context.uploadFiles = function(url, data, callback){
		uploadFilesAjax(url, data, callback);
	}

	context.validate = function(val) {
		return ($.trim(val).length > 0);
	}

	context.validateEmail = function(email) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	context.setLoaderText = function(txt){
		if(typeof txt === 'undefined')
			txt = '';

		$('.ajax-loader .ajax-info').html(txt);
	}

	context.showError = function(msg, $cont) {
		showAlert(msg, 'error', $cont);
	}

	context.showSuccess = function(msg, $cont) {
		showAlert(msg, 'success', $cont);
	}

	context.hideAlert = function($cont) {
		var $alert;

		if ($cont != undefined)
			$alert = $cont.find('.alert');
		else
			$alert = $('.alert');

		// clear all classes alert-*
		$alert.attr('class', function(i, c) { 
			return c.replace(/\balert-.+\b/gi, ''); 
		}).html('');
	}

})(Service);