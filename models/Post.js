const { Schema, model, Types } = require('mongoose')

const PostSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Введите заголовок поста.'],
			min: 10
		},
		description: {
			type: String,
			min: 15
		},
		body: {
			type: String,
			required: [true, 'Пост не может быть пустым.'],
			min: 25
		},
		author: {
			type: Types.ObjectId,
			ref: 'user',
			required: true
		},
		comments: [
			{
				_id: Types.ObjectId,
				author: {
					type: Types.ObjectId,
					ref: 'user',
					required: true
				},
				body: {
					type: String,
					required: [true, 'Комментарий пустой.']
				},
				createdAt: {
					type: Date,
					default: Date.now
				}
			}
		],
		likes: [
			{
				author: {
					type: Types.ObjectId,
					required: true,
					ref: 'user'
				}
			}
		],
		views: {
			type: Number,
			default: 0
		},
		status: {
			type: Number,
			default: 0,
			enum: [0, 1]
		}
	},
	{ timestamps: true }
)

module.exports = model('post', PostSchema)
