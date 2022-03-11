const { gql } = require('apollo-server')

module.exports = gql`
	scalar Date

	enum Status {
		0
		1
	}

	input PageQueries {
		sort: String
		limit: Int
		skip: Int
	}

	type Comment {
		id: ID!
		author: User!
		body: String!
		createdAt: Date!
	}

	type Like {
		author: User!
	}

	type Name {
		firstName: String!
		lastName: String
	}

	input UserInput {
		name: Name!
		username: String!
		email: String!
		birthDate: String
		password: String!
		confirmPassword: String!
		private: Boolean!
	}

	input LoginInput {
		usernameOrEmail: String!
		password: String!
	}

	input PostInput {
		title: String!
		description: String
		body: String!
	}

	type User {
		id: ID!
		name: Name!
		username: String!
		email: String!
		birthDate: Date
		private: Boolean!
		role: Status!
		createdAt: Date!
		updatedAt: Date
		token: String!
	}

	type Post {
		id: ID!
		title: String!
		description: String
		body: String!
		author: User!
		comments: [Comment]
		likes: [Like]
		views: Int!
		status: Status!
		createdAt: Date!
		updatedAt: Date
	}

	type Query {
		getUsers(name: String, role: Roles, private: Boolean, input: PageQueries): [User!]!
		getUser(userId: ID!): User!
		searchUsers(keyWord: String!): [User!]!

		getPosts(input: PageQueries): [Post!]!
		getPost(postId: ID!, view: Boolean): Post!
		searchPosts(keyWord: String!): [Post!]!
	}

	type Mutation {
		register(input: RegisterInput!): User!
		login(input: LoginInput!): User!
		editAccount(input: EditAccountInput): User!
		editPassword(userId: ID!, input: EditPasswordsInput!): User!
		deleteAccount: String!

		createPost(input: CreatePostInput!): Post!
		updatePost(postId: ID!, input: UpdatePostInput): Post!
		deletePost(postId: ID!): String
	}
`
