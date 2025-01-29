import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
export var UserRole;
(function (UserRole) {
    UserRole["EVALUATOR"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (UserRole = {}));
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email']
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'Unit',
        validate: {
            validator: function () { //unit is required for user role
                return this.role !== UserRole.USER || this.unit != null;
            },
            message: 'Unit is required for users'
        }
    }
}, {
    toJSON: {
        virtuals: true,
    },
    timestamps: true
});

// hash user password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});
// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
// Remove unit if user is Evaluator
userSchema.pre('save', function (next) {
    if (this.role === UserRole.EVALUATOR && this.unit) {
        this.unit = undefined;
    }
    next();
});
const User = model('User', userSchema);
export default User;