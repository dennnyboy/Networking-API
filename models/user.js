const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    username: {
        type: String,
        Unique: true,
        required: true,
        trim: true

    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
     thoughts: [
         {
             type: Schema.Types.ObjectId,
             ref: 'Thought'
         }
     ],
     friends: [
         {
             type: Schema.Types.ObjectId,
             ref: 'User'
         }
     ]
    
    

});
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
 })

const User = model('User', userSchema);

module.exports = User;