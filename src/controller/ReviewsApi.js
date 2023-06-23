const ReviewModel = require('../model/ReviewModel');
const BookModel = require('../model/BookModel');
const moment = require("moment");
let { isEmpty, isValidObjectId, isValidRating, isValidName } = require('../validation/validation')
const createReview = async (req,res) => {
    try{
        const bookId = req.params.bookId;
        const data = req.body;

        const { rating, review, reviewedAt, reviewedBy } = req.body;

        //Check the mongoDB ObjectId
        let book = await BookModel.findById({_id:bookId});
        if(!book || book.isDeleted === true){
            return res.status(400).send({status:false,msg:"No book Found"});
        };
        if(!isEmpty(data)){
            return res.status(400).send({status:false,msg:"Invalid request parameters. Please provide book details"});
        };
        if(!isEmpty(reviewedBy) && !isValidName(reviewedBy)){
            return res.status(400).send({status:false,msg:"Please provide valid reviews"})
        };
        if (review && !isEmpty(review)) {
          return res.status(400).send({ status: false, message: "review is in wrong format" });
        };
        if (!rating) {
          return res.status(400).send({ status: false, message: "please provide rating " });
        };
        if (!isValidRating(rating)) {
          return res.status(400).send({ status: false, message: "please provide valid rating " });
        };
        data.reviewedAt = new Date();
        data.bookId = bookId;

        let reviewDoc = await ReviewModel.create(data);
        let updateBook = await BookModel.findOneAndUpdate(
          { _id: bookId },
          { $inc: { review: 1 } },
          { new: true }
        );

        updateBook = updateBook.toObject();
        updateBook["reviewsData"] = [reviewDoc];

        return res.status(201).send({status:true,msg:"Review created successfully",data:updateBook})

    }catch(error){
        res.status(500).send({status:false,msg:"error",error:error.message});
    };
};


const deletebookReview = async (req,res) => {
    try{
        const bookid = req.params.bookId;
        const reviewid = req.params.reviewId;

        //checking mongoose object id book id
        
        const bookExist = await BookModel.findOne({_id:bookid,isDeleted:false}).select({deletedAt:0});
        if(!bookExist){
            return res.status(400).send({status:false,msg:"book not found"})
        }

        //chekcing mongoose object id review id

        const reviewExist = await ReviewModel.findOne({_id:reviewid,bookId:bookid});
        if(!reviewExist){
            return res.status(400).send({status:false,msg:"review not found..."});
        };

        if(reviewExist.isDeleted === true){
            return res.status(400).send({status:false,msg:"review is already deleted"})
        };

        await ReviewModel.findOneAndUpdate(
            {_id:reviewid,bookId:bookid, isDeleted:false},
            {$set:{isDeleted:true}},
            {new:true}
        );

        await BookModel.findOneAndUpdate(
            {_id:bookid,isDeleted:false},
            {$inc:{reviews:-1}},
            {new:true}
        );

        res.status(201).send({status:true,msg:"deleted successfully...!"})
    }catch(error){
        return res.status(500).send({status:false,msg:"error",error:error.message})
    };
};

const updateReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const reviewID = req.params.reviewId;
    const updateBody = req.body;
    const { review, rating, reviewedBy } = updateBody;

    //validation
    if (!isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Incorrect bookId format" });
    }
    if (!isValidObjectId(reviewID)) {
      return res
        .status(400)
        .send({ status: false, msg: "Incorrect reviewId format" });
    }
    if (!isEmpty(updateBody)) {
      return res.status(400).send({
        status: false,
        message:
          "Invalid request parameters. Please provide review details to update.",
      });
    }

    // -------------------------checking review validation.--------------->>
    if (review) {
      if (!isEmpty(review)) {
        return res.status(400).send({
          status: false,
          message:
            "Review is missing ! Please provide the review details to update.",
        });
      }
    }
    // ------------------------checking reviewedBy validation-------------->>
    if (reviewedBy) {
      if (!isEmpty(reviewedBy)) {
        return res.status(400).send({
          status: false,
          message:
            "Reviewer's name is missing ! Please provide the name to update.",
        });
      }
      if (!isValidName(reviewedBy)) {
        return res
          .status(400)
          .send({ status: false, message: "reviewedBy is in wrong format" });
      }
    }

    // ----------- checking whether the rating is number or character------->>
    if (rating) {
      if (typeof rating != "number") {
        return res
          .status(400)
          .send({ status: false, message: "rating is in wrong format" });
      }
      if (!isValidRating(rating)) {
        return res
          .status(400)
          .send({ status: false, message: "rating must be between 1 and 5" });
      }
    }
    const searchBook = await BookModel
      .findOne({ _id: bookId, isDeleted: false })
      .select({ createdAt: 0, updatedAt: 0, __v: 0 });
    if (!searchBook) {
      return res.status(404).send({
        status: false,
        message: `Book does not exist by this ${bookId}. `,
      });
    }
    const searchReview = await ReviewModel.findOne({
      _id: reviewID,
      isDeleted: false,
    });
    if (!searchReview) {
      return res.status(404).send({
        status: false,
        message: `Review does not exist by this ${reviewID}.`,
      });
    }
    if (searchReview.bookId != bookId) {
      return res
        .status(404)
        .send({ status: false, message: "Review not found for this book" });
    }

    const updateReviewDetails = await ReviewModel.findOneAndUpdate(
      { _id: reviewID },
      { review: review, rating: rating, reviewedBy: reviewedBy },
      { new: true }
    ); //.select({review:1,rating:1,reviewedBy:1})

    let destructureForResponse = searchBook.toObject();
    destructureForResponse["reviewsData"] = [updateReviewDetails];

    return res.status(200).send({
      status: true,
      message: "Successfully updated the review of the book.",
      data: destructureForResponse,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {deletebookReview,createReview,updateReview}