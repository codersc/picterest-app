var Pic = require('../models/pics');
var User = require('../models/users.js');

module.exports = (app, passport) => {
	var redirectIfUnauthenticated = (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	};
	
	var isAuthenticated = (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.status(403).send({
				success: false,
				msg: 'Authentication failed.'
			});
		}
	};

    app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));
		
    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
            res.redirect('/');
		});

	app.route('/')
		.get((req, res) => {
			res.sendFile(process.cwd() + '/public/index.html');
		});
		
	app.route('/login')
	    .get((req, res) => {
	        res.sendFile(process.cwd() + '/public/login.html');
	    });
	    
	app.route('/my-pics')
		.get(redirectIfUnauthenticated, (req, res) => {
			res.sendFile(process.cwd() + '/public/my-pics.html')	
		});
	
	app.route('/api/add-pic')
		.post(isAuthenticated, (req, res) => {
			if (!req.body.title || !req.body.link) {
				res.json({
					success: false,
					msg: 'Title and link fields are required.'
				});
			} else {
				var newPic = new Pic({
					title: req.body.title,
					link: req.body.link,
					owner: req.user.twitter.displayName,
					ownerId: req.user.twitter.id
				});
				
				newPic.save((err) => {
					if (err) {
						throw err;
					} else {
						res.json({
							success: true,
						})
					}
				});
			}
		});
		
	app.route('/api/pics')
		.get((req, res) => {
			Pic
				.find()
				.exec(function(err, docs) {
					if (err) { 
						throw err; 
					}
					
					res.json(docs);
				});
		});
		
	app.route('/api/my-pics')
		.get(isAuthenticated, (req, res) => {
			Pic
				.find({ 'ownerId': req.user.twitter.id })
				.exec((err, docs) => {
					if (err) {
						throw err;
					}
					
					res.json(docs);
				});
		});
		
	app.route('/api/get-profile')
		.get(isAuthenticated, (req, res) => {
			User
				.findOne({ 'twitter.id': req.user.twitter.id })
				.exec((err, doc) => {
					if (err) {
						throw err;
					}
					
					res.json({
						user: doc	
					});
				});
		});
		
	app.route('/api/delete-pic/:id')
		.post(isAuthenticated, (req, res) => {
			Pic
				.findOne({ '_id': req.params.id })
				.exec((err, doc) => {
					if (err) {
						throw err;
					}	
					
					doc.remove();
					
					console.log('twitter.id', req.user.twitter.id, 'doc.ownerId', doc.ownerId);
					
					if (req.user.twitter.id=== doc.ownerId) {
						res.json({
							pic: doc	
						});
					} else {
						res.json({
							success: false,
							msg: 'pic not deleted'
						});
					}
				});
		});
}
