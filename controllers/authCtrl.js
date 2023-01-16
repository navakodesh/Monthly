const { validateUserSignUp, validateUserLogin } = require("../validations/userValid");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.authCtrl = {
    SignUp: async(req, res) => {
        let validBody = validateUserSignUp(req.body);
        if (validBody.error) {
            return res.status(401).json({ msg_err: validBody.error.details })
        }

        try {
            let user = new UserModel(req.body);
            user.password = await bcrypt.hash(user.password, 10);
            await user.save();
            user.password = "*********"
            return res.json(user);

        } catch (err) {

            if (err.code == 11000) {
                return res.status(401).json({ msg_err: "User already exists" });
            }

            return res.status(500).json({ msg_error: "There is problem , try again later..." })
        }
    },
    login: async(req, res) => {
        const validBody = validateUserLogin(req.body);
        if (validBody.error) {
            return res.status(401).json({ msg_err: validBody.error.details })
        }

        try {
            const user = await UserModel.findOne({ email: req.body.email })
            if (!user) {
                return res.status(401).json({ msg_err: "User not found" })
            }
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if (!validPass) {
                return res.status(401).json({ msg_err: "Invalid password" })
            }

            const token = jwt.sign({ role: user.role, _id: user._id }, config.tokenSecret, { expiresIn: '60min' })
          
            return res.json({ token })
        } catch (err) {
          
            return res.status(500).json({ msg_err: "There was an error signing" });
        }
    }
   
    
      
      
}