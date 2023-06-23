const BookModel = require('../model/BookModel');
const UserModel = require('../model/UserModel')
const validation = require('../validation/validation');
const mongoose = require('mongoose');
const moment = require("moment");
const ReviewModel = require('../model/ReviewModel')
const createBook = async (req,res) => {
    try{
        let data = req.body;
        const {title, excerpt, userId, ISBN, category, subcategory, reviews} = req.body;
        const allBookData = await BookModel.find();

        //checking user id is valid or not
        let checkId = validation.isValidObjectId(userId);
        if(!checkId){
            return res.status(400).send({status:false,msg:"Please provide valid user id in the body"})
        }
        // console.log(req.userId.toString())
        // console.log(userId)
        if(!(userId === req.userId)){
            return res.status(400).send({status:false,msg:"Your are not authorize to create this book with this userId"})
        }

        //Checking the request body is empty or not
        if(Object.keys(req.body).length < 1){
            return res.status(400).send({status:false,mssg:"Please Provide the data to process"});
        };
        //title Validation
        //checking id the title field is empyt or not and trim();
        if(!validation.isEmpty(title)){
            return res.status(400).send({status:false,msg:"Please enter the title"})
        };
        if(title){
            let titledup = allBookData.map(ele => ele.title === title);
            if(titledup[0]){
                return res.status(400).send({status:false,msg:'This title is already present'})
            };
        };
        //Check the Field is empty or not
        if(!validation.isEmpty(excerpt)){
            return res.status(400).send({status:false,msg:"Please enter the excerpt"});
        };
        //checking the empty field or not and duplication
        if(!validation.isEmpty(ISBN)){
            return res.status(400).send({status:false,msg:'Please enter the ISBN'});
        };
        if(ISBN){
            let isbnDup = allBookData.map(ele => ele.ISBN === ISBN);
            if(isbnDup[0]){
                return res.status(400).send({status:false,msg:"This ISBN is already present"})
            };
        };
        if(!validation.isEmpty(category)){
            return res.status(400).send({status:false,msg:"Please Enter the category"});
        };
        if(!validation.isEmpty(subcategory)){
            return res.status(400).send({status:false,msg:"Please Enter the subcategory"});
        };

        let user = await UserModel.findOne({_id : userId});
        
        if(!user){
            return res.status(400).send({status:false,msg:"This user id doesn't exist"})
        }
        else{
                let releasedAt = new Date();
                let bookCreated = { title, excerpt, userId, ISBN, category, subcategory, releasedAt, reviews };
                let saveData = await BookModel.create(bookCreated);
                return res.status(201).send({status:true,data:saveData});
        };
    }catch(error){
        res.status(500).send({status:false,msg:"error",error:error.message})
    };
};


const getFilterbooks = async (req,res) => {
    try{
       let filterBook = req.query
        if (filterBook.userId) {
            if (!mongoose.Types.ObjectId.isValid(filterBook.userId)) 
            return res.status(400).send({ status: false, message: 'Invalid UserId Format' })
        }
        if (filterBook.subcategory) {
            filterBook.subcategory = { $in: filterBook.subcategory.split(',') };
        }
        let data = await BookModel.find({ $and: [filterBook, { isDeleted: false }] }).select({ title: 1, excerpt: 1, category: 1, releasedAt: 1, userId: 1, reviews: 1 }).sort({ title: 1 })
        if (Object.keys(data).length == 0) 
        return res.status(404).send({ status: false, message: 'Book not found' })
        res.status(200).send({ status: true, message: 'Book list', data: data })
    }catch(error){
        return res.status(400).send({status:false,msg:"error",error:error.message})
    };
};

//books/:booksId
const getBookId = async (req,res) => {
    try{
            const bookId = req.params.bookId;
           
            if(!bookId){
                return res.status(400).send({ status: false, message: "Please enter bookId" })
            };
            if(!validation.isValidObjectId(bookId)){
                return res.status(400).send({ status: false, message: "Invalid bookId" })
            };
            const bookData = await BookModel.findOne({ _id: bookId });
            if (!bookData) {
            return res.status(404).send({ status: false, msg: "this bookId is not found inside the bookModel" })
        }
        if (bookData.isDeleted == true) {
            return res.status(404).send({ status: false, msg: " this Book is Deleted" })
        }
        const reviewsData = await ReviewModel.find({ bookId: bookId });

        const data = {...bookData, reviewsData: reviewsData }
        bookData._doc["reviewsData"] = reviewsData;

        return res.status(200).send({ status: "true", data: bookData });
    }catch(error){
        return res.status(400).send({status:false,msg:"error",error:error.message});
    }
};

const updateBook = async (req,res) => {
    try{
        const data = req.body;
        const {title, excerpt, ISBN} = req.body;
        const bookid = req.params.bookId;

        if(Object.keys(data).length < 1){
            return res.status(400).send({status:false,msg:"Please Provide some data  to update the document"});
        };
        
        //checking mongoose object book id

       if(excerpt){if(!validation.isEmpty(excerpt)){
            return res.status(400).send({status:false,msg:"please provide some excerpt for blog"});
        };}
        
        if(title){
            if(!validation.isEmpty(title)){
                return res.status(400).send({status:false,msg:"please provide title for updation"})
            };
        };

        if(ISBN){
            if(!validation.isEmpty(ISBN)){
                return res.status(400).send({status:false,msg:"please provide ISBN for updation"})
            };
        };

        const bookData = await BookModel.findById({_id:bookid});
        if(bookData.isDeleted === true){
            return res.status(404).send({status:false,msg:"This book is already deleated"});
        };
        const checkTitle = await BookModel.findOne({title:title});
        if(checkTitle){
            return res.status(400).send({status:false,msg:"this title is already exists"});
        };

        const checkISBN = await BookModel.findOne({ISBN:ISBN});
        if(checkISBN){
            return res.status(400).send({status:false,msg:"Book is already present with this ISBN"});
        };

        const updateBook  = await BookModel.findOneAndUpdate(
            {_id:bookid,isDeleted:false},{$set:{title:title,excerpt:excerpt,ISBN}},
            {new :true}
        );
        return res.status(200).send({status:true,msg:"Update Successful",data:updateBook});
    }catch(error){
        res.status(500).send({status:false,msg:"error",error:error.message});
    };
};

const deleteBook = async (req,res) => {
    try{
        const bookid = req.params.bookId;
        const checkBook = await BookModel.findOne({_id:bookid});
        if(!checkBook.isDeleted === false){
            return res.status(400).send({status:false,msg:"This book is already deleted"});
        };
        if(checkBook.isDeleted === false){
            let deleteDoc = await BookModel.findOneAndUpdate({_id:bookid},{$set:{isDeleted:true, deletedAt:new Date()}},{new:true});
            return res.status(400).send({status:true,msg:"delete succcessfull",data:deleteDoc});
        }
    }catch(error){
        return res.status(500).send({status:false,msg:"error",error:error.meassage})
    }
}

module.exports.createBook = createBook;
module.exports.getBook = getFilterbooks;
module.exports.getBookId = getBookId;
module.exports.updateBook = updateBook;
module.exports.deleteBook = deleteBook;