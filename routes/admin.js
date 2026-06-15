require("dotenv").config()
const { Router } = require("express")
const { z } = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET
const adminRouter = Router()
const { AdminModel, CourseModel } = require("../db")
const { adminMiddleware } = require("../middleware/admin")
const course = require("./course")

// adminRouter.post("/signup", async (req, res) => {
//     const requiredBody = z.object({
//         email: z.string().min(3).max(100).email(),
//         password: z.string().min(3).max(30).regex(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
//             {
//                 message:
//                     "Password must contain 1 uppercase, 1 lowercase, 1 number and 1 special character"
//             }
//         ),
//         firstName: z.string().min(3).max(30),
//         lastName: z.string().min(3).max(30)
//     }).strict()

//     const parsedDataWithSuccess = requiredBody.safeParse(req.body)

//     if (!parsedDataWithSuccess.success) {
//         return res.json({
//             message: "Incorrect form",
//             error: parsedDataWithSuccess.error
//         })
//     }

//     const { email, password, firstName, lastName } = req.body

//     let errorThrown = false

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10)

//         await AdminModel.create({
//             email: email,
//             password: hashedPassword,
//             firstName: firstName,
//             lastName: lastName
//         })
//     } catch (e) {
//         res.status(400).json({
//             message: "User with email already exits"
//         })

//         errorThrown = true
//     }

//     if (!errorThrown) {
//         res.json({
//             message: "Admin signup endpoint"
//         })
//     }
// })

adminRouter.post("/signin", async (req, res) => {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30)
    }).strict()

    const parsedDataWithSuccess = requiredBody.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {
        return res.json({
            message: "Incorrect form",
            error: parsedDataWithSuccess.error
        })
    }

    const { email, password } = req.body

    const user = await AdminModel.findOne({
        email: email
    })

    if (!user) {
        return res.status(400).json({
            message: "User doesnt exists"
        })
    }

    const passwordMatched = await bcrypt.compare(password, user.password)

    if (passwordMatched) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_ADMIN_SECRET)

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

adminRouter.post("/course", adminMiddleware, async (req, res) => {
    const adminId = req.userId

    const { title, description, price, imageUrl } = req.body

    const course = await CourseModel.create({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async (req, res) => {
    const adminId = req.userId

    const { title, description, price, imageUrl, courseId } = req.body

    const course = await CourseModel.updateOne( {
        _id: courseId,
        creatorId: adminId
    },{
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl
    })

    res.json({
        message: "Course edited successfully",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
    const adminId = req.userId

    const courses = await CourseModel.find({
        creatorId: adminId
    })

    console.log(courses)

    res.json({
        message: "Your courses",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}