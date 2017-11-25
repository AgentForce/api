"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const UserSchema = new Mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        // unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});
exports.UserSchema = UserSchema;
function hashPassword(password) {
    if (!password) {
        return null;
    }
    return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8));
}
UserSchema.methods.validatePassword = function (requestPassword) {
    return Bcrypt.compareSync(requestPassword, this.password);
};
UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    user.password = hashPassword(user.password);
    return next();
});
UserSchema.pre('findOneAndUpdate', function () {
    const password = hashPassword(this.getUpdate().$set.password);
    if (!password) {
        return;
    }
    this.findOneAndUpdate({}, { password: password });
});
const UserModel = Mongoose.model('User', UserSchema);
exports.UserModel = UserModel;
//# sourceMappingURL=user.js.map