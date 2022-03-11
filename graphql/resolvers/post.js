const { CreatePostValidator, UpdatePostValidator } = require('../../utils/validators/post')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/authentication')
const { Error } = require('mongoose')

module.exports = {
	Query: {
		getPosts: async (_, { input: { sort, limit, skip } }) => {
			const posts = await Post.find(_, null, { sort: sort || 'title', limit: limit || 15, skip: skip || 0 })
				.populate('author comments.author likes.author edits.author')
				.exec()

			if (posts.length < 1) {
				throw new Error('Пока что нет публикаций.')
			}

			return posts
		},

		getPost: async (_, { postId, view = false }) => {
			const post = await Post.findById(postId).populate('author comments.author likes.author edits.author').exec()

			if (view === true) {
				post.views += 1

				await post.save()
			}

			if (!post) {
				throw new Error('Публикаций не найдено.')
			}

			return post
		},

		searchPosts: async (_, { keyWord }) => {
			const regExp = new RegExp(`(?:${keyWord})`, 'g')

			const posts = await Post.find({ $or: [{ title: { $regex: regExp } }, { description: { $regex: regExp } }, { markdown: { $regex: regExp } }] })

			if (posts.length > 1) {
				throw new Error('Публикаций не найдено.')
			}
		}
	},

	Mutation: {
		createPost: async (_, { input: { title, description, markdown } }, context) => {
			const user = checkAuth(context)

			const { errors, valid } = CreatePostValidator(title, description, markdown)

			if (!valid) {
				throw new UserInputError(`Errors in ${Object.keys(errors)}`, { errors })
			}

			const newPost = new Post({
				title,
				description,
				markdown,
				author: user.id
			})

			const post = await newPost.save()

			return post.populate('author comments.author likes.author edits.author').execPopulate()
		},

		updatePost: async (_, { postId, input: { title, description, markdown } }, context) => {
			const user = checkAuth(context)

			const post = await Post.findById(postId)

			if (!post) {
				throw new Error('Публикация не найдена.')
			}

			if (user.id.toString() !== post.author.toString()) {
				throw new Error('Вы не можете изменить эту публикацию.')
			}

			title ? (post.title = title) : null
			description ? (post.description = description) : null
			markdown ? (post.markdown = markdown) : null

			const edit = {
				author: user.id,
				updatedAt: new Date()
			}

			post.edits.push(edit)

			const updated = await post.save()

			return updated.populate('author comments.author likes.author edits.author').execPopulate()
		},

		deletePost: async (_, { postId }, context) => {
			const user = checkAuth(context)

			const post = await Post.findById(postId)

			if (!post) {
				throw new Error('Публикация не найдена.')
			}

			if (user.id.toString() !== post.author.toString()) {
				throw new Error('Вы не можете изменить эту публикацию.')
			}

			await post.deleteOne()

			return 'Публикация успешно удалена.'
		}
	}
}
