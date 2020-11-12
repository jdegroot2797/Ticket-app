import mongoose from 'mongoose';

// Enforce type checking since TS and Mongoose don't talk to each other
interface UserAttributes {
    email: String;
    password: String;
}

// interface that describes properties of the user model has
interface UserModel extends mongoose.Model<UserDoc> {
    createUser(attrs: UserAttributes): UserDoc;
}

//interface that describes the properties of a User document
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
// custom function to create a mongoose user object with type checking
userSchema.statics.createUser = (attrs: UserAttributes) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };