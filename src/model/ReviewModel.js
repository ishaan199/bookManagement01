const mongoose = require("mongoose");

const objId = mongoose.Schema.Types.ObjectId;

const ReviewSchema = new mongoose.Schema(
  {
    bookId: { type: objId, ref: "Book_List" },
    reviewedBy: { type: String, required: true, default: "Guest" },
    reviewedAt: { type: Date, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book_Review", ReviewSchema);
