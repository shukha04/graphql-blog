const { GraphQLScalarType } = require('graphql')
const post = require('./post')
const user = require('./user')

module.exports = {
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar type',
		parseValue(value) {
			return new Date(value)
		},
		serialize(value) {
			return value
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.INT) {
				return Date
			}
			return null
		}
	}),

	Status: {
		0: 0,
		1: 1
	},

	Query: { ...user.Query, ...post.Query },
	Mutation: { ...user.Mutation, ...post.Mutation }
}
