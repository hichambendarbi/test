const express = require('express')
const router = express.Router()
const User = require('../Models/User')
const auth = require('../middleware/auth')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwtSecret = config.get('jwtSecret')
const jwt = require('jsonwebtoken')

//  @route    GET api/auth
//  @desc     Get User by ID_Token middleware
//  @access   Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.send(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


//  @route    POST api/auth
//  @desc     Authenticate user & get token
//  @access   Public
router.post('/', [
    check('email','Name user is required').isEmail(),
    check('password','Pssword not exists').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
    }

    const {email, password} = req.body;

    try {
        let user =  await User.findOne({email})
        if(!user) {
           return res.status(400).json({ errors: [ {msg: 'Email not exists'}]})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ errors: [ {msg: 'Password incorect'}]})
        }

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