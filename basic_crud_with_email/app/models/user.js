var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	email		: {
		type: String,
		required: true,
		unique: true
	},
    password    : {
    	type: String,
    	required: true
    },
    isAdmin		: {
    	type: Boolean,
    	default: false
    },
    Verified : {
        type: Boolean,
        default: false
    },
    token : {
        type: String,
        default: null
    },
    joindate : {
        type: Date,
        default: Date.now
    }
});

/*var formSchema = mongoose.Schema({
    data   : [],
    
    urlspec :  {
        type: String,
        default: null
    }    

});*/

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
// checking if the users token has expired
userSchema.methods.hasExpired = function(joindate) {
    var now = new Date();
    //return (now - joindate) > 7;
    return (((new Date().getMinutes()) - joindate.getMinutes()) > 2);
};
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

//module.exports = mongoose.model('Form', formSchema);
