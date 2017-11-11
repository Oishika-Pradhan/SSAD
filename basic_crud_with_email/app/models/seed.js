var User = require('./user.js');

var user = {
	password : "$2a$08$gxR9TPrCXM8bMW.fhqjQTes3olgbKeqTgbdvM5IDTPNWtQaqPf4Bu", 	
	email : "sowrya1682@gmail.com", 
	token : null, 
	Verified : true, 
	isAdmin : true
}

User.create(user, function(e) {
    if (e) {
        throw e;
    }
});

var userone = {
	password : "$2a$08$gxR9TPrCXM8bMW.fhqjQTes3olgbKeqTgbdvM5IDTPNWtQaqPf4Bu", 	
	email : "sowrya@gmail.com",
	token : null, 
	Verified : true, 
	isAdmin : true
}

User.create(userone, function(e) {
    if (e) {
        throw e;
    }
});

