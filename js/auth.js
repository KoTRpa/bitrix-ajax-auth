"use strict";

// requere ejs and jquery!

$(function(){
	// auth
	$('#auth-form').on('submit', function(e){
		e.preventDefault();

		var 
			self = $(this),
			data = {},
			login = self.find('[name="login"]').val(),
			password = self.find('[name="password"]').val(),
			error = false,
			msg = '';

		self.find('.error').removeClass('error');
		Service.hideAlert(self);

		if (!Service.validate(login)/* || !Service.validateEmail(login)*/)
		{
			self.find('[name="login"]').addClass('error');
			error = true;
		}

		if (!Service.validate(password))
		{
			self.find('[name="password"]').addClass('error');
			error = true;
		}

		if (error) 
		{
			Service.showError('Поля не заполнены', self);
			return false;
		}

		data = {
			mode:     'auth',
			login:    login,
			password: password,
			sessid:   self.find('[name="sessid"]').val()
		};

		Service.postAjax('/ajax/auth_register.php', data, function(res){
			if (res.success)
			{
				$('.popup_login').fadeOut(300);
				location.reload();
			}
			else
			{
				if (res.error_code = 12)
					res.fields.forEach(function(e,i){
						$('#auth-form [name="' + e + '"]').addClass('error');
						Service.showError(res.error, self);
					});
			}
		});

		return false;
	});

	// register
	$('#register-form').on('submit', function(e){
		e.preventDefault();

		var 
			self = $(this),
			data = {},
			login = self.find('[name="login"]').val(),
			password = self.find('[name="password"]').val(),
			password_confirm = self.find('[name="password_confirm"]').val(),
			error = false,
			msg = [];

		self.find('.error').removeClass('error');
		Service.hideAlert(self);

		if (!Service.validate(login) || !Service.validateEmail(login))
		{
			self.find('[name="login"]').addClass('error');
			msg.push('"Эл. почта" не заполнено или заполнено неверно');
		}

		if (!Service.validate(password))
		{
			self.find('[name="password"]').addClass('error');
			msg.push('"Пароль" не заполнено');
		}

		if (!Service.validate(password_confirm))
		{
			self.find('[name="password_confirm"]').addClass('error');
			msg.push('"Пароль еще раз" не заполнено');
		}

		if (password !== password_confirm)
		{
			self.find('[name="password_confirm"]').addClass('error');
			msg.push('Значения "Пароль" и "Пароль еще раз" не совпадают');
		}

		if (msg.length) 
		{
			Service.showError(msg, self);
			return false;
		}

		data = {
			mode:     'register',
			login:    login,
			password: password,
			password_confirm: password_confirm,
			sessid:   self.find('[name="sessid"]').val()
		};

		Service.postAjax('/ajax/auth_register.php', data, function(res){
			log('register' , res);
			if (res.success)
			{
				$('.popup_login').fadeOut(300);
				location.reload();
			}
			else
			{
				if (res.error_code = 12)
					res.fields.forEach(function(e,i){
						self.find('[name="' + e + '"]').addClass('error');
						Service.showError(res.error, self);
					});
			}
		});

		return false;
	});


	// password reset
	$('#reset-password-form').on('submit', function(e){
		e.preventDefault();

		var 
			self = $(this),
			data = {},
			login = self.find('[name="login"]').val(),
			error = false,
			msg = '';

		self.find('.error').removeClass('error');
		Service.hideAlert(self);

		if (!Service.validate(login)/* || !Service.validateEmail(login)*/)
		{
			self.find('[name="login"]').addClass('error');
			error = true;
		}

		if (error) 
		{
			Service.showError('Поле не заполнены', self);
			return false;
		}

		data = {
			mode:     'password_reset',
			login:    login,
			sessid:   self.find('[name="sessid"]').val()
		};

		Service.postAjax('/ajax/auth_register.php', data, function(res){
			log('pass reset', res);
			
			if (res.success)
			{
				$('#reset-password-form .login_block_item').remove();
				Service.showSuccess(res.msg, self);
			}
			else
			{
				if (res.error_code = 12)
					res.fields.forEach(function(e,i){
						$('#reset-password-form [name="' + e + '"]').addClass('error');
						Service.showError(res.error, self);
					});
			}
			
		});

		return false;
	});
})