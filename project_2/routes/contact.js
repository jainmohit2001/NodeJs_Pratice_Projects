const express = require('express');
const router = express.Router(); //this helps us to modularise or in simple terms, make the code general
const nodeMailer = require('nodemailer'); //helps to use mailing system

/* GET users listing. */
router.get('/', (req, res, next) => { //on get method
  res.render('contact', { title: 'Contact' });  // render the template 'contact.jade' with title: 'Contact'
});

router.post('/send', (req, res, next) => { // on post method
	let transporter = nodeMailer.createTransport({ //create a transporter object
		service: 'Gmail',
		auth: {
			user: '', //put your gmail account details here
			pass: ''
		}
	});
	// mailOptions set how the receiver will view the mail
	let mailOptions = {
		from: req.body.email,
		to: 'jainmohit2001@gmail.com',
		subject: 'Website Submission',
		text: 'You have a new submission with the following details... Name: ' + req.body.name + ' Email: ' + req.body.email + ' Message: ' + req.body.message,
		html: '<p>You got a new submission with the following details.</p><ul><li>Name: '+ req.body.name + '</li><li>Email: ' + req.body.email + '</li><li>Message: ' + req.body.message + '</li></ul>'
	};

	transporter.sendMail(mailOptions, (error, info) => { //callback with mailOptions
		if(error){
			console.log(error);
			res.redirect('/');
		}
		else{
			console.log("Message Sent" + info.response);
			res.redirect('/');
		}
	});
});

module.exports = router;
