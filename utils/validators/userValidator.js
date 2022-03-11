const validator = require('validator').default

const alphaWithSpaces = /^[a-zA-Zа-яА-Я-,](\s{0,1}[a-zA-Zа-яА-Я-, ])*[^\s]$/

const alphaNumericWithUnderscore = /[a-z A-Z0-9\\_\\-]+$/

module.exports.RegisterValidation = (name, username, email, password, confirmPassword) => {
	const errors = {}

	//*===NAME VALIDATORS===
	validator.isEmpty(name) ? (errors.name = 'Введите имя.') : null

	!alphaWithSpaces.test(name) ? (errors.name = 'Имя должно состоять только из букв.') : null
	//*===name validators===

	//*===USERNAME VALIDATORS===
	validator.isEmpty(username) ? (errors.username = 'Введите имя пользователя.') : null

	!alphaNumericWithUnderscore.test(username) ? (errors.username = 'Имя пользователя должно содержать только латинские буквы и цифры.') : null

	!validator.isLength(username, { min: 6, max: 20 }) ? (errors.username = 'Имя пользователя должно состоять из более 8 и менее 20 символов') : null
	//*===username validators===

	//*===EMAIL VALIDATORS===
	validator.isEmpty(email) ? (errors.email = 'Введите электронную почту.') : null

	!validator.isEmail(email) ? (errors.email = 'Введите корректную электронную почту.') : null
	//*===email validators===

	//*===PASSWORD VALIDATORS===
	validator.isEmpty(password) ? (errors.password = 'Введите пароль.') : null

	!validator.isLength(password, { min: 8 }) ? (errors.password = 'Пароль должен состоять из более 8 символов.') : null
	//*===password validators===

	//*===PASSWORD CONFIRM VALIDATORS===
	validator.isEmpty(confirmPassword) ? (errors.confirmPassword = 'Подтвердите пароль.') : null

	!validator.equals(confirmPassword, password) ? (errors.confirmPassword = 'Пароли не совпадают.') : null
	//*===password confirm validators===
	return {
		errors,
		valid: Object.keys(errors).length < 1
	}
}

module.exports.LoginValidation = (username, password) => {
	const errors = {}

	//*===USERNAME VALIDATORS===
	validator.isEmpty(username) ? (errors.username = 'Введите имя пользователя.') : null

	!alphaNumericWithUnderscore.test(username) ? (errors.username = 'Имя пользователя должно содержать только латинские буквы и цифры.') : null

	!validator.isLength(username, { min: 6, max: 20 }) ? (errors.username = 'Имя пользователя должно состоять из более 8 и менее 20 символов') : null
	//*===username validators===

	//*===PASSWORD VALIDATORS===
	validator.isEmpty(password) ? (errors.password = 'Введите пароль.') : null

	!validator.isLength(password, { min: 8 }) ? (errors.password = 'Пароль должен состоять из более 8 символов.') : null
	//*===password validators===

	return {
		errors,
		valid: Object.keys(errors).length < 1
	}
}

module.exports.EditAccountValidation = (name, username, email) => {
	const errors = {}

	//*===NAME VALIDATORS===
	validator.isEmpty(name) ? (errors.name = 'Введите имя.') : null

	!alphaWithSpaces.test(name) ? (errors.name = 'Имя должно состоять только из букв.') : null
	//*===name validators===

	//*===USERNAME VALIDATORS===
	validator.isEmpty(username) ? (errors.username = 'Введите имя пользователя.') : null

	!alphaNumericWithUnderscore.test(username) ? (errors.username = 'Имя пользователя должно содержать только латинские буквы и цифры.') : null

	!validator.isLength(username, { min: 6, max: 20 }) ? (errors.username = 'Имя пользователя должно состоять из более 8 и менее 20 символов') : null
	//*===username validators===

	//*===EMAIL VALIDATORS===
	validator.isEmpty(email) ? (errors.email = 'Введите электронную почту.') : null

	!validator.isEmail(email) ? (errors.email = 'Введите корректную электронную почту.') : null
	//*===email validators===

	return {
		errors,
		valid: Object.keys(errors).length < 1
	}
}

module.exports.EditPasswordValidation = (pastPassword, newPassword, confirmNewPassword) => {
	const errors = {}

	//*===PAST PASSWORD VALIDATORS===
	validator.isEmpty(pastPassword) ? (errors.pastPassword = 'Введите старый пароль.') : null

	!validator.isLength(pastPassword, { min: 8 }) ? (errors.pastPassword = 'Пароль должен состоять из более 8 символов.') : null
	//*===past password validators===

	//*===NEW PASSWORD VALIDATORS===
	validator.isEmpty(newPassword) ? (errors.newPassword = 'Введите новый пароль.') : null

	!validator.isLength(newPassword, { min: 8 }) ? (errors.newPassword = 'Пароль должен состоять из более 8 символов.') : null
	//*===new password validators===

	//*===NEW PASSWORD CONFIRM VALIDATORS===
	validator.isEmpty(confirmNewPassword) ? (errors.confirmNewPassword = 'Подтвердите пароль.') : null

	!validator.equals(confirmNewPassword, newPassword) ? (errors.confirmNewPassword = 'Пароли не совпадают.') : null
	//*===new password confirm validators===

	return {
		errors,
		valid: Object.keys(errors).length < 1
	}
}
