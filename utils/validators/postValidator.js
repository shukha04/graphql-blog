const validator = require('validator').default

module.exports.CreatePostValidator = (title, description, markdown) => {
	const errors = {}

	validator.isEmpty(title) ? (errors.title = 'Введите название публикации.') : null

	validator.isEmpty(description) ? (errors.description = 'Введите описание публикации.') : null

	validator.isEmpty(markdown) ? (errors.markdown = 'Введите текст публикации.') : null

	return {
		errors,
		valid: Object.keys(errors).length < 1
	}
}

module.exports.UpdatePostValidator = (title, description, markdown) => {
	const errors = {}

	validator.isEmpty(title) ? (errors.title = 'Введите название публикации.') : null

	validator.isEmpty(description) ? (errors.description = 'Введите описание публикации.') : null

	validator.isEmpty(markdown) ? (errors.markdown = 'Введите текст публикации.') : null

	return {
		errors,
		valid: Object.keys(errors).length < 1
	}
}
