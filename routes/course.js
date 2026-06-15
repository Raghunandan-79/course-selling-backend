const { Router } = require("express")
const courseRouter = Router()

courseRouter.post("/purchase", (req, res) => {

    res.json({
        message: "Purchase course endpoint"
    })
})


courseRouter.get("/preview", (req, res) => {

    res.json({
        message: "Preview endpoint"
    })
})

module.exports = {
    courseRouter: courseRouter
}