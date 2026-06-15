const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    firstName: String,
    lastName: String
})

const AdminSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    firstName: String,
    lastName: String
})

const CourseSchema = new Schema({
    title: {
        type: String,
        unique: true
    },

    description: String,
    price: Number,
    imageUrl: String,

    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
        required: true
    }
})

const PurchaseSchema = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
})

const UserModel = mongoose.model("users", UserSchema)
const AdminModel = mongoose.model("admins", AdminSchema)
const CourseModel = mongoose.model("courses", CourseSchema)
const PurchaseModel = mongoose.model("purchases", PurchaseSchema)

module.exports = {
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}