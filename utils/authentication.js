const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { SECRET } = process.env

module.exports = (context) => {
	const header = context.req.headers.authorization

	if (header) {
		const token = header.split('Bearer ')[1]

		if (token) {
			try {
				const user = jwt.verify(token, SECRET)
				return user
			} catch (error) {
				throw new AuthenticationError('Неверный или недействительный токен.')
			}
		}
		throw new Error('Токен должен иметь следующий вид: "Bearer [token]".')
	}
	throw new Error('Вы должны быть авторизованы.')
}
