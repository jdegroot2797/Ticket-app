import mongoose from 'mongoose';
import { Password } from '../services/password';

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
}, {
    toJSON:{
        // doc is the mongodb document, ret is what will be returned
        // since mongo will try to use toJSON we can edit ret
        transform(doc, ret){
            delete ret.password;
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// access the middleware, this will run before mongoose
// executs a save() on a schema object
// must use 'function' keyword or the context is lost to the document 
// and will look at this files context instead of db's document
userSchema.pre('save', async function(done) {
    // only attempt to hash password if password has been modified
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

// custom function to create a mongoose user object with type checking
userSchema.statics.createUser = (attrs: UserAttributes) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };