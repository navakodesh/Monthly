const express = require("express");
const router = express.Router();
const { authCtrl } = require("../controllers/authCtrl");
const { userCtrl } = require("../controllers/userCtrl");
const { auth } = require("../middlewares/auth");

router.get("/", (req, res) => {
    res.json({ msg: "users work" })
})

router.post('/SignUp', authCtrl.SignUp)
router.post('/login', authCtrl.login)
router.get("/myInfo", auth, userCtrl.myInfo)
router.patch("/income", auth, userCtrl.income)


module.exports = router;