var  nodemailer = require('nodemailer');

var User = require('./models/user');
var Form = require('./models/form');
//var Form = require('./models/form');
fs = require('fs')
url = require('url');
const crypto = require('crypto');

module.exports = function(app, passport) {

    
    app.get('/receive',isLoggedIn,isVerified,reqAdmin, function(request, respond) {
        respond.render('createForms.html')
    
});

    app.post('/receive',isLoggedIn,isVerified,reqAdmin, function(request, respond) {
    

                // if there is no user with that email
                // create the user
                var unique_token = createRandomToken(request.body[1].name);

                console.log('checkpoint-1');
                console.log(unique_token);
                console.log(request.body);
                var newForm            = new Form();
               
                // set the user's local credentials
                newForm.token    = unique_token;
                newForm.name     =  request.body[1].name;
                newForm.array = request.body[0];
                newForm.namesarr = request.body[2];
                newForm.values = request.body[3];
                console.log(request.body[2]);   
                // save the user
                
                      var a = function (callback) {
                        newForm.save(function(err,done) {
                        if (err)
                            throw err;
                        else{
                            console.log('checkpoint-2');
                            if(callback) callback();
                            //return;
                         }
                    //return done(null, newForm);
                    });
                    }
                    
                    a(function(){
                    var urltag = 'http:localhost:8080/form?token=' + newForm.token;
                    console.log(urltag);
                    console.log("ITS HERE!!");
                    respond.render('datanow.html');
                    respond.end();
                    //respond.redirect('/form?token=' + newForm.token);
                    //respond.redirect('/');        
                /*var urltag = 'http:localhost:8080/form?token=' + newForm.token;
                console.log(urltag);
                respond.redirect('/form?token=' + newForm.token);
                */
                console.log('checkpoint-3');
            });
               //console.log('checkpoint-4');
                    
});    


app.post('/submitdetails',isLoggedIn,isVerified,function(req,res) {
    console.log(req.body);
    res.end('Data received');
});


app.get('/form',isLoggedIn,isVerified,function(req,res) {
    console.log(req.query.token);
    //res.redirect('/');
    //link = "http://"+req.get('host')+"/verify?id="+temp;
    var data = 'datanow.html';
    filePath = 'views/' + data;
    Form.findOne({token: req.query.token},function(err,formdetails) {
        console.log('#############');
        console.log(formdetails);
        var arr = [];
        arr = formdetails.array;
        var names = [];
        names = formdetails.namesarr;
        var values = [];
        values = formdetails.values;

        fbody = '<html><head><title>' + formdetails.name + '</title></head><body>';
        fbody += '<style> body { padding-top:80px;padding-left:100px; } </style>';
        fbody += '<div class="container"><div class="col-sm-6 col-sm-offset-3">';
        fbody += '<h1><span class="fa fa-sign-in"></span>'+formdetails.name +'</h1>';
        fbody += '<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css">'; 
        fbody += '<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">';
        fbody += '<form action="/submitdetails" method="post">';
        for(var i = 0;i < arr.length;i= i + 1){
            if(arr[i].type == 'text box'){
                fbody += '<div class = "form-group">';
                if(names[i] != null) {
                    fbody += '<label>'+ names[i]   +'</label>';
                }
                fbody += "<input type='"+ values[i] +"' name= '"+names[i] +"' class = 'form-control' >";
                fbody += '</div>';
            }
            else if(arr[i].type == 'Check boxes'){
                fbody += '<div class = "form-group">';
                if(names[i] != null) {
                    fbody += '<label>'+ names[i]   +'</label>';
                }
                fbody += "<input type='checkbox' class = 'form-control' name='"+ names[i] +"' value='" + values[i] + "'>" + values[i];
                fbody += '</div>';
            }
            else if(arr[i].type == 'Radio button'){
                fbody += '<div class = "form-group">';
                if(names[i] != null) {
                    fbody += '<label>'+ names[i] +'</label>';
                }
                fbody += "<input type='radio' name='"+names[i] +"' value='"+ values[i] +"' class = 'form-control' >"+values[i]+" ";
                fbody += '</div>';
            }
            else if(arr[i].type == 'Text area'){
                fbody += '<div class = "form-group">';
                if(names[i] != null) {    
                    fbody += '<label>'+ names[i]   +'</label>';
                 }   
                fbody += "<textarea type='text' name='"+names[i] +"' value='"+ values[i] +"' class = 'form-control' ></textarea>";
                fbody += '</div>';
            }
        }
        fbody += '<button type="submit" class="btn btn-warning btn-lg">Submit</button>';
        fbody += '</form>';
        fbody += '</div></div>';
        fbody += '</body>';
        fbody += '</html>';
        /*fs.writeFileSync( filePath, body, function (err) {
            if (err) return console.log(err);
            console.log('Hello World > helloworld.txt');
        });*/

        fs.writeFileSync( filePath,fbody);
        res.render('datanow.html');
    });



});



    // LOGIN 
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));




app.post("/update",isLoggedIn,isVerified,function(req,res) {
   // console.log(req.body);
    newUser = new User();
    newUser.email = req.body.email;
    newUser.password = newUser.generateHash(req.body.password);
    // console.log(newUser;);
    User.findOne({email: req.body.email},function(err,user) {
        if(user) {
            user.set({password: user.generateHash(req.body.password)});
            user.save();
            res.redirect('/');
        }
     //   console.log(user);
    });

})


var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sowrya1682@gmail.com",
        pass: "aspirine@1234"
    }
});
var rand,mailOptions,host,link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

// app.get('/',function(req,res){
//     res.sendfile('index.html');
// });

app.get('/send',function(req,res){



    var rand = function() {
         return Math.random().toString(36).substr(2); // remove `\0.`
    };

    var token = function() {
        return rand() + rand(); // to make it longer
    };

     
    var temp = token();
    //rand = Math.floor((Math.random() * 100) + 54);
    host = req.get('host');
    link = "http://"+req.get('host')+"/verify?id="+temp;
    console.log(temp);

    mailOptions={
        to : req.user.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            res.end(req.body.email);
            console.log(error);
        res.end("error");
     }
     else{

        User.findOne({email: req.user.email},function(err,userr) {
            if(userr) {
                //console.log('sdjkbfsjkbgj');
                //console.log(userr);
                //userr.set({token: rand.toString()});
                userr.set({token: temp});
                 userr.save(function(err,resp){
                    if(err) console.log(err);
                    else console.log(resp);
                 });
                 //console.log(userr);
            }
         //   console.log(user);
        });  


            //console.log("Message sent: " + Json(response.message);
        //res.end("Please verify email to proceed further.");
        //res.flash('message',"Please verify email to proceed further.");
        res.redirect('/signup');/*
        res.render('signup.html', {
            message : "Please verify email to proceed further."
        });*/



         }
});
});

// app.get('/success',function(req,res){
//     res.render('Email has been verified.');

//       setTimeout(function () {
//      // after 2 seconds
//      window.location = "/profile";
//   }, 10000)

// });


app.get('/verify',function(req,res){
console.log(req.protocol+"://"+req.get('host'));
if((req.protocol+"://"+req.get('host')) == ("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");



    //User.findOne({email: req.body.email},function(err,userr) {
    User.findOne({token: req.query.id}, function(err,userind) {


    /*if(req.query.id == rand)*/
    if(userind && (req.query.id != null) && !userind.hasExpired(userind.joindate)) 
    {
        
        //user.isVerified = true;
        //res.end("Email has been verified.");
/*
        req.user.Verified = true;
        res.redirect('/');*/

        /*user.set({verified: true});
        user.save();
        res.redirect('/');
*/
    ;
             userind.set({Verified: true});
             userind.set({token: null});
             userind.save();
             res.redirect('/');
            console.log("email is verified");       

   /* User.findOne({email: req.user.email},function(err,userr) {
        if(userr) {
            console.log('sdjkbfsjkbgj');
            console.log(userr);
            userr.set({Verified: true});
             userr.save();
             console.log(userr);
             res.redirect('/');
        }
     //   console.log(user);
    });
    */    


    }
    else
    {
        if(userind.hasExpired(userind.joindate))
        {
                res.render('signup.html' ,{
                    message: "Your token has been expired please register again."
                })
        }
        else
        {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
});
}
else
{
    res.end("<h1>Request is from unknown source");
}
});
    
    // SIGNUP 
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.html', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/send', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });




    // =====================================
    // HOME =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/', isLoggedIn,isVerified, function(req, res) {
        res.render('profile.html', {
            user : req.user // get the user out of session and pass to template
        });
    });

    
    
    app.get('/my_tasks',isLoggedIn,isVerified,function(req,res) {
        var Allusers=[];
  //  async: false;    
    //console.log(req.user);
    User.find({},function(err,users) {
       if(err){
        console.log(err);
       } else {
            if(req.user.isAdmin == true) {
                /*fs.appendFile('views/datanow.html', users, function(err,resp) {
                    //console.log('body');
                    //resp.end('DONE');
                });*/
               res.render('mytasks.html',{
               allusers : users //get all the users
             });
            }
            else {
                res.redirect('/');
            }

       }

    });
        
    app.post('/deleteuser',isLoggedIn,isVerified,function(req,res) {
            //console.log(req.body._id);
            User.remove({ _id: req.body._id }, function(err) {
                 if (!err) {
                    //console.log('DONE SUCCESSFULLY');
                    /*var resp = 'notification!';*/

                    res.redirect('/my_tasks');
                 }
                 else {
                     /*var resp = 'error';*/
                     //console.log('ERROR!!');
                 }
            });
            


    });   
});

app.post("/updateuser",isLoggedIn,isVerified,function(req,res) {
    //console.log('req.body');
    //console.log(req.body);
    newUser = new User();
    newUser.email = req.body.email;
    newUser.password = newUser.generateHash(req.body.password);
    // console.log(newUser;);
    User.findOne({email : req.body.email},function(err,user) {
        if(user) {
            //console.log('alkshfkjsdhgjkhdv');
            user.set({password: user.generateHash(req.body.password)});
            user.save();
            res.redirect('/my_tasks');
        }
        else {
            //console.log('errorroorrorr!!!!');
            res.redirect('/');
        }
     //   console.log(user);
    });

});


app.post("/makeadmin",isLoggedIn,isVerified,function(req,res) {
    //console.log(req.body);
    User.findOne({_id: req.body._id},function(err,user) {
        if(user) {
            //console.log('found the user with the id');
            user.set({isAdmin: true});
            user.save();
            //res.redirect('/');
            res.render('profile.html', {
                user: req.user
            });
        }
        else{
            //console.log('Got into an error:(');
            res.redirect('/my_tasks');
        }
    })
})



app.post("/unmakeadmin",isLoggedIn,isVerified,function(req,res) {
    //console.log(req.body);
    User.findOne({_id: req.body._id},function(err,user) {
        if(user) {
           // console.log('found the user with the id');
            user.set({isAdmin: false});
            user.save();
            //res.redirect('/');
            res.render('profile.html', {
                user: req.user
            });
        }
        else{
            //console.log('Got into an error:(');
            res.redirect('/my_tasks');
        }
    })
})



    app.get('/search',isLoggedIn,isVerified,function(req,res) {

        var a = [];
        Form.find({},function(err,formdetails) {
            if(err){
                //do nothing
            }
            else{
                a.push(formdetails);
                //console.log(a);
                res.render('search.html', {
                 user : req.user,
                 link : a
                });
            }

        });
        //console.log(a);
        
    });

    app.post('/search',isLoggedIn, isVerified,function(req,res) {
        res.redirect('/feature/'+req.body.search);
    });

};


function createRandomToken(string) {
  var seed = crypto.randomBytes(20);
  const secret = 'Thisisnotasecret';
  return crypto.createHmac('sha256',secret).update(seed + string).digest('hex');
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the login page
    req.flash('loginMessage', 'Please login to continue')
    res.redirect('/login');
}

/*to make sure that the user has been verified*/

function isVerified(req, res, next) {

    if(req.user.Verified)
        return next();

    req.flash('Please verify your account to proceed.');
    res.redirect('/send');
}


function reqAdmin(req,res,next) {
    if (req.isAuthenticated() && req.user.isAdmin)
        return next();

    // if they aren't redirect them to the login page
    req.flash('loginMessage', 'Please log in as an Admin')
    res.redirect('/login');
}