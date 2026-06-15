const { Router } = require("express")
const adminRouter = Router()
const { AdminModel } = require("../db")

adminRouter.post("/signup", (req, res) => {

    res.json({
        message: "Admin signup endpoint"
    })
})

adminRouter.post("/signin", (req, res) => {
    
    res.json({
        message: "Admin signin endpoint"
    })
})

adminRouter.post("/course", (req, res) => {
    
    res.json({
        message: "Add course endpoint"
    })
})

adminRouter.put("/course", (req, res) => {
    
    res.json({
        message: "update course endpoint"
    })
})

adminRouter.get("/course/bulk", (req, res) => {

    res.json({
        message: "See all created courses"
    })
})

module.exports = {
    adminRouter: adminRouter
}