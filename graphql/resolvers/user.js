const { UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const { RegisterValidation, LoginValidation, EditAccountValidation, EditPasswordValidation } = require('../../utils/validators/user')
require('dotenv').config()
const checkAuth = require('../../utils/authentication')

const { SECRET } = process.env

module.exports = {
	Query: {
		getUsers: async (_, { name, role, private, input: { sort, limit, skip } }) => {
			const queries = {}
			name ? (queries.name = name) : queries
			role ? (queries.role = role) : queries
			private !== undefined ? (queries.private = private) : queries

			const users = await User.find(
				{
					...queries
				},
				null,
				{
					sort: sort || 'name',
					limit: limit || 15,
					skip: skip || 0
				}
			)

			if (users.length < 1) {
				return new Error('Пользователей не найдено.')
			}

			return users
		},

		getUser: async (_, { userId }) => {
			const user = await User.findById(userId)

			if (!user) {
				return new Error('Пользователь не найден.')
			}

			return user
		},

		searchUsers: async (_, { keyWord }) => {
			const regExp = new RegExp(`(?:${keyWord})`, 'g')

			const users = await User.find({ $or: [{ name: { $regex: regExp } }, { username: { $regex: regExp } }, { email: { $regex: regExp } }] })

			if (users.length > 1) {
				return new Error('Пользователей не найден.')
			}

			return users
		}
	},
	Mutation: {
		register: async (_, { input: { name, username, email, birthDate, password, confirmPassword, private } }) => {
			const { errors, valid } = RegisterValidation(name, username, email, password, confirmPassword)

			if (!valid) {
				throw new UserInputError(`Errors in ${Object.keys(errors)}`, { errors })
			}

			const exists = await User.findOne({ $or: [{ username }, { email }] })
			if (exists) {
				if (exists.username.toString() === username.toString()) {
					return new UserInputError('Данное имя пользователя уже зарегистрировано.', {
						username: 'Данное имя пользователя уже зарегистрировано.'
					})
				} else if (exists.email.toString() === email.toString()) {
					return new UserInputError('Данная электронная почта уже зарегистрирована.', {
						email: 'Данная электронная почта уже зарегистрирована.'
					})
				}
			}

			password = await bcrypt.hash(password, 12)

			const user = new User({
				name,
				username,
				email,
				birthDate,
				password,
				private
			})

			await user.save()

			const token = await jwt.sign(
				{
					id: user.id,
					username: user.username,
					email: user.email
				},
				SECRET,
				{ expiresIn: '1h' }
			)

			return {
				id: user.id,
				...user.toJSON(),
				token
			}
		},

		login: async (_, { input: { username, password } }) => {
			const { errors, valid } = LoginValidation(username, password)

			if (!valid) {
				throw new UserInputError(`Errors in ${Object.keys(errors)}`, { errors })
			}

			const user = await User.findOne({ username })

			if (!user) {
				throw new UserInputError('Пользователь не найден.', {
					username: 'Пользователь не найден.'
				})
			}

			const rightPassword = await bcrypt.compare(password, user.password)

			if (!rightPassword) {
				throw new UserInputError('Неверный пароль.', {
					password: 'Неверный пароль.'
				})
			}

			const token = await jwt.sign(
				{
					id: user.id,
					username: user.username,
					email: user.email
				},
				SECRET,
				{ expiresIn: '1h' }
			)

			return {
				id: user.id,
				...user.toJSON(),
				token
			}
		},

		editAccount: async (_, { userId, input: { name, username, email, birthDate, private } }) => {
			const authUser = checkAuth(context)

			const { errors, valid } = EditAccountValidation(name || user.name, username || user.username, email || user.email)

			if (!valid) {
				throw new UserInputError(`Errors in ${Object.keys(errors)}`, { errors })
			}

			const user = await User.findById(authUser.id)

			if (!user) {
				throw new Error('Пользователь не найден.')
			}

			name ? (user.name = name) : null
			username ? (user.username = username) : null
			email ? (user.email = email) : null
			birthDate ? (user.birthDate = birthDate) : null
			private ? (user.private = private) : null

			const edited = await user.save()

			const token = await jwt.sign(
				{
					id: edited.id,
					username: edited.username,
					email: edited.email
				},
				SECRET,
				{ expiresIn: '1h' }
			)

			return {
				id: edited.id,
				...edited.toJSON(),
				token
			}
		},

		editPassword: async (_, { input: { pastPassword, newPassword, confirmNewPassword } }, context) => {
			const authUser = checkAuth(context)

			const { errors, valid } = EditPasswordValidation(pastPassword, newPassword, confirmNewPassword)

			if (!valid) {
				throw new UserInputError(`Errors in ${Object.keys(errors)}`, { errors })
			}

			const user = await User.findById(authUser.id)

			const matched = await bcrypt.compare(pastPassword, user.password)

			if (!matched) {
				throw new UserInputError('Неверный пароль.', {
					pastPassword: 'Неверный пароль.'
				})
			}

			user.password = newPassword

			const edited = await user.save()

			const token = await jwt.sign(
				{
					id: edited.id,
					username: edited.username,
					email: edited.email
				},
				SECRET,
				{ expiresIn: '1h' }
			)

			return {
				id: edited.id,
				...edited.toJSON(),
				token
			}
		},

		deleteAccount: async (_, __, context) => {
			const authUser = checkAuth(context)

			const user = await User.findByIdAndDelete(authUser.id)

			if (!user) {
				throw new Error('Пользователь не найден.')
			}

			return 'Пользователь удален.'
		}
	}
}
