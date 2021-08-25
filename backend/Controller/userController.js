import bcrypt from 'bcryptjs';
import user from '../model/userSchema.js';
import log from '../model/logSchema.js'

export const addUser = async (req, res) => {
    console.log("hello")

    console.log(req.body)

    const { name, email, city, field, password } = req.body;

    if (!name || !email || !city || !field || !password) {
        console.log("if form not filled")
        return res.json({ error: "please filled form properly" });
    }
    try {
        const userExist = await user.findOne({ email: email })
        console.log(userExist)

        if (userExist) {
            console.log("email already exit")
            return res.status(422).json({ error: "Email already Exist" });
        }

        const User = new user({ name, email, city, field, password });
        console.log("Users", User);
        // hasing
        const a = await User.save();
        console.log(a)
        res.json(a);


    } catch (err) {
        console.log(err);
        res.json({ message: err.message })
    }

}

export const loginUser = async (req, res) => {
    console.log("login")
    console.log(req.body)

    try {
        let token;
        const { email, password, date, time } = req.body;
        console.log(req.body)
        if (!email || !password) {

            console.log("fill the form");
            return res.status(400).json({ error: "fill form" })
        }

        const userLogin = await user.findOne({ email: email });
        // console.log(userLogin);

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)
            console.log(isMatch);

            token = await userLogin.generateAuthToken();
            console.log(token);
            const id = userLogin._id;
            const name = userLogin.name;
            console.log(name)
            console.log(id);

            if (!isMatch) {
                console.log("error");
                res.status(400).json({ error: "error" })
            }

            else {
                console.log("password is matched")
                const User = new log({date});
                console.log("date", User);
               
                await User.save();
                
                res.json({ message: "Successfully Login", token: token, id: userLogin._id, name: userLogin.name, date:User });
            }

        }
        else {
            res.status(400).json({ message: "error" })
        }

    } catch (err) {
        console.log("not correct")
        console.log(err);
    }

};