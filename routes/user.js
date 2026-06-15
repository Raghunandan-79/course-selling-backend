require("dotenv").config()
const { Router } = require("express")
const { z } = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { userMiddleware } = require("../middleware/user")
const { UserModel, PurchaseModel } = require("../db")
const JWT_USER_SECRET = process.env.JWT_USER_SECRET
const userRouter = Router()

userRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30).regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            {
                message:
                    "Password must contain 1 uppercase, 1 lowercase, 1 number and 1 special character"
            }
        ),
        firstName: z.string().min(3).max(30),
        lastName: z.string().min(1).max(30)
    }).strict()

    const parsedDataWithSuccess = requiredBody.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {
        return res.json({
            message: "Incorrect form",
            error: parsedDataWithSuccess.error
        })
    }

    const { email, password, firstName, lastName } = req.body

    let errorThrown = false

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        await UserModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
    } catch (e) {
        res.status(400).json({
            message: "User with email already exits"
        })

        errorThrown = true
    }

    if (!errorThrown) {
        res.json({
            message: "Signup successfull"
        })
    }
})

userRouter.post("/signin", async (req, res) => {
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

    const user = await UserModel.findOne({
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
        }, JWT_USER_SECRET)

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

userRouter.get("/purchases", userMiddleware, async (req, res) => {
    const userId = req.userId

    const courses = await PurchaseModel.find({
        userId
    })


    res.json({
        courses
    })
})

module.exports = {
    userRouter: userRouter
}