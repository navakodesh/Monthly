const express = require("express");
const router = express.Router();
const { adminCtrl } = require("../controllers/adminCtrl");
const { authCtrl } = require("../controllers/authCtrl");
const { userCtrl } = require("../controllers/userCtrl");
const { authAdmin } = require("../middlewares/auth")

router.get("/", (req, res) => {
  res.json({ msg: "admin work" })
})

router.post('/login' ,adminCtrl.login)
router.get("/usersList", authAdmin, adminCtrl.AdminUsersList)
router.get("/myInfo", authAdmin, userCtrl.myInfo)
//?_id=...{למציאת הוצאות לפי משתמש}
router.get("/expenses", authAdmin, adminCtrl.AdminGetExpenses)
///admin/search?s=category&_id=...
router.get("/search", authAdmin, adminCtrl.AdminSearchCategory)
router.delete("/delete/:_id", authAdmin, adminCtrl.deleteUser)
router.delete("/deleteUserExpenses/:_id", authAdmin, adminCtrl.deleteUserExpenses)
router.patch("/changeRole/:_id", authAdmin, adminCtrl.changeRole)
// //byAmount?min&max
router.get("/byAmount", authAdmin, adminCtrl.AdminByAmount)
router.get("/UserInfoById/:_id", authAdmin, adminCtrl.UserInfoById)
router.get("/infoByCategoryById/:_id", authAdmin, adminCtrl.infoByCategoryById)
router.get("/incomeMinExpensesById/:_id", authAdmin, adminCtrl.incomeMinExpensesById)



module.exports = router;