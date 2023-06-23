const mongoose = require("mongoose");
const objId = mongoose.Schema.Types.ObjectId;

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    userId: { type: objId, ref: "Book_User" },
    ISBN: { type: String, required: true, uniqe: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    reviews: { type: Number, default: 0 },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, requried: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Books_List", BookSchema);
