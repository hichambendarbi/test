const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Book = require('../Models/Book');
const User = require('../Models/User');

// @route    POST api/book
// @desc     Create a book
// @access   Private
router.post('/', [
    auth,
    [
        check('titleBook', 'book title is require').not().isEmpty(),
        check('priceBook', 'book price is require').not().isEmpty(),
        check('status', 'book status is require').not().isEmpty()
    ]
] , async (req, res) => {
 const errors = validationResult(req);
 if(!errors.isEmpty()){
     return res.status(400).json({erros: errors.array()})
 }

 try {
     
 const user = await User.findById(req.user.id).select('-password');

 const newBook = new Book
(    {
        titleBook: req.body.titleBook,
        createdBy: user.name,
        priceBook: req.body.priceBook,
        status: req.body.status,
        user: req.user.id
    })
 

 const book = await newBook.save()
 res.json(book);

 } catch (err) {
     console.error(err.message);
     res.status(500).send('Server Error');

 }
});

// @route    GET api/book
// @desc     Get all books
// @access   Private

router.get('/', auth, async (req, res) => {
try {
    const books = await Book.find().sort({ date: -1});
    res.json(books);
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
})

// @route    GET api/book/:id
// @desc     Get book by ID
// @access   Private

router.get('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if(!book) {
            return res.status(404).json({ msg: 'Book not found' })
        }
        res.json(book);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' })
        }
        res.status(500).send('Server Error');
    }
    })


// @route    GET api/book/bookPrivate
// @desc     Get book by status (private or public)
// @access   Public

router.get('/bookPrivate', auth, async (req, res) => {
    try {
        const book = await Book.findOne({status: "private"})

        if(!book) {
            return res.status(404).json({ msg: 'Book not found' })
        }
        res.json(book);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' })
        }
        res.status(500).send('Server Error');
    }
    })

// @route    GET api/book/bookPublic
// @desc     Get book by status (private or public)
// @access   Public

router.get('/bookPublic', auth, async (req, res) => {
    try {
        const book = await Book.findOne({status: "public"})

        if(!book) {
            return res.status(404).json({ msg: 'Book not found' })
        }
        res.json(book);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' })
        }
        res.status(500).send('Server Error');
    }
    })

// @route    DELETE api/book/:id
// @desc     Delete a book
// @access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if(!book) {
            return res.status(404).json({ msg: 'Book not found' })
        }
        
        // Check user
        if(book.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'});
        }

        await book.remove();
        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' })
        }
        res.status(500).send('Server Error');
    }
    })

    module.exports = router;