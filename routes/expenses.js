const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { expensesCtrl } = require("../controllers/expensesCtrl");

router.get("/getExpensesById/:_id", auth, expensesCtrl.getExpensesById)
// /expenses/search?s=
router.get("/search", auth, expensesCtrl.searchCtegory)
// /expenses/byAmount?min&max
router.get("/byAmount", auth, expensesCtrl.byAmount)
router.get("/byDate", auth, expensesCtrl.byDate)
router.get("/byMonthly", auth, expensesCtrl.byMonthly)
router.post("/", auth, expensesCtrl.postExpenses)
router.put("/idEtid/:_id", auth, expensesCtrl.idEtid)
router.delete("/delId/:_id", auth, expensesCtrl.deleteExpenses)
router.get("/infobycategory", auth, expensesCtrl.infoByCategory)
router.get("/incomeMinExpenses", auth, expensesCtrl.incomeMinExpenses)

module.exports = router;