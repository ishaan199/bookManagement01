const express = require('express')
const router = express.Router();

//Authentication and authorization 
const auth = require('../authorization/auth');

//User Controller
const userCtrl = require('../controller/UserApi')
router.post("/register", userCtrl.userRegister);
router.post('/login',userCtrl.userLogin);


//Book Controller
const bookCtrl = require('../controller/BoookApi');
router.post('/books',auth.authentication,bookCtrl.createBook);
router.get('/books',auth.authentication,bookCtrl.getBook);
router.get('/books/:bookId',auth.authentication,bookCtrl.getBookId);
router.put('/books/:bookId',auth.authentication,bookCtrl.updateBook);
router.delete('/books/:bookId',auth.authentication,bookCtrl.deleteBook);


//Reviews Controller
const reviewCtrl = require('../controller/ReviewsApi');
router.post('/books/:bookId/review',auth.authentication,reviewCtrl.createReview);
router.put('/books/:bookId/review/:reviewId',auth.authentication,reviewCtrl.updateReview);
router.delete('/books/:bookId/review/:reviewId',auth.authentication,reviewCtrl.deletebookReview);
module.exports = router;