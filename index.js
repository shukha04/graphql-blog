const mongoose = require('mongoose')
const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')
const { ApolloServer } = require('apollo-server')
require('dotenv').config()

const { PORT, DATABASE } = process.env

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req }),
	formatError: (error) => {
		if (error.message.startsWith('Database error: ')) {
			return new Error('Внутренняя ошибка сервера.')
		}
		return error
	}
})

async function start(port, database) {
	await mongoose
		.connect(database, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})
		.then(console.log('База данных подключена!'))

	server.listen(port).then(({ url }) => console.log('Сервер запущен по ссылке: ' + url))
}

start(PORT, DATABASE)
