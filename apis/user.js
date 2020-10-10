const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const config = require('config')
const jwtSecret = config.get('jwtSecret')

//  @route    POST api/users
//  @desc     Register user
//  @access   Public
router.post('/', [
    check('name','Name user is required').not().isEmpty(),
    check('email','Use a valid email').isEmail(),
    check('password','password not valid').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
    }

    const {name, email, password} = req.body;

    try {
        let user =  await User.findOne({email})
        if(user) {
           return res.status(400).json({ errors: [ {msg: 'User exist'}]})
        }

        user = new User({
            name, email, password
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user._id
            }
        }

        jwt.sign(payload, jwtSecret, {expiresIn: 36000}, (err, token)=> {
             if(err) throw err;
             res.json({token});
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})

module.exports = router;