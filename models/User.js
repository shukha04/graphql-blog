const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
	{
		name: {
			firstName: {
				type: String,
				required: [true, "Введите имя."],
			},
			lastName: String,
		},
		username: {
			type: String,
			required: [true, "Введите имя пользователя."],
			unique: true,
			min: [6, "Имя пользователя должно содержать минимум 6 символов."],
			validate: {
				validator: username => {
					return /^(?![_.])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$/.test(username);
				},
				message: "Имя пользователя может содержать только латинский буквы и цифры.",
			},
		},
		email: {
			type: String,
			required: [true, "Введите электронную почту."],
			unique: true,
			validate: {
				validator: mail => {
					return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
						mail
					);
				},
				message: "{VALUE} не является электронной почтой.",
			},
		},
		birthDate: Date,
		password: {
			type: String,
			required: [true, "Введите пароль."],
			min: [8, "Пароль должен содержать минимум 8 символов."],
		},
		private: {
			type: Boolean,
			default: false,
		},
		role: {
			type: Number,
			default: 0,
			enum: [0, 1],
		},
	},
	{ timestamps: true }
);

UserSchema.pre("save", next => {
	this.isModified("password")
		? bcrypt.genSalt(10, (err, salt) => {
				if (err) return next(err);

				bcrypt.hash(this.password, salt, (err, hash) => {
					if (err) return next(err);

					this.password = hash;

					next();
				});
		  })
		: next();
});

UserSchema.methods.comparePassword = (potentialUser, cb) => {
	bcrypt.compare(potentialUser, this.password, (err, isMatch) => {
		if (err) return cb(err);

		cb(null, isMatch);
	});
};

UserSchema.methods.generateToken = cb => {
	jwt.sign({ userId: this._id }, process.env.SECRET, { expiresIn: "3h" }, (err, token) => {
		if (err) return cb(err);
		this.token = token;

		this.save((err, user) => {
			if (err) return cb(err);

			cb(null, user);
		});
	});
};

module.exports = model("user", UserSchema);
