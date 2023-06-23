const express = require('express')
const router = express.Router();

//Authentication and authorization 
const auth = require('../authorization/auth');

//User Controller
const userCtrl = require('../controller/UserApi')
router.post('/createuser',userCtrl.userRegister);
router.post('/login',userCtrl.userLogin);


//Book Controller
const bookCtrl = require('../controller/BoookApi');
router.post('/createbook',auth.authentication,bookCtrl.createBook);
router.get('/getbook',auth.authentication,bookCtrl.getBook);
router.get('/:bookId',auth.authentication,bookCtrl.getBookId);
router.put('/updateBook/:bookId',auth.authentication,bookCtrl.updateBook);
router.delete('/deleteBook/:bookId',auth.authentication,bookCtrl.deleteBook);


//Reviews Controller
const reviewCtrl = require('../controller/ReviewsApi');
router.post('/createReview/:bookId',auth.authentication,reviewCtrl.createReview);
router.put('/updateReview/:bookId/:reviewId',auth.authentication,reviewCtrl.updateReview);
router.delete('/deleteReview/:bookId/:reviewId',auth.authentication,reviewCtrl.deletebookReview);
module.exports = router;