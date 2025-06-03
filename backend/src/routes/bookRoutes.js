import express from "express";
import protectRoute from "../middleware/auth.middleware.js";


const router = express.Router();
// create
router.post("/", protectRoute, async (req, res) => {
    try {
        const {title, caption, image, rating} = req.body;
        if (!title || !caption || !image || !rating) {
            return res.status(400).json({msg: "Fill all the fields"});
        }

        // upload the image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image,);
        const imageUrl = uploadResponse.secure_url;
        // save to the database

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        })

        await newBook.save();

        res.status(201).json(newBook);

    } catch (error) {
        console.log('Error', error);
        res.status(500).json({msg: error.message});
    }

});

// get
// infinite fetch
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book
        .find()
        .sort({createdAt: -1}) //descending
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.send({
        books,
        currentPage: page,
        totalBooks: totalBooks,
        totalPages: Math.ceil(totalBooks / limit)
    });
  } catch (error) {
    console.log('Error in get all books route', error);
    res.status(500).json({message: "Internal server error" });
  }
});

// get recommended books by the logged in user
router.get("/user", protectRoute, async (req, res) => {
    try {
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1});
        res.json(books);
    } catch (error) {
        console.log('Error in getting recommended books', error);
        res.status(500).json({message: "Internal server error" });
    }
});


// delete
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        // const deletedBook = await Book.findByIdAndDelete(req.params.id);
        const book = await Book.findById(req.params.id);

        //check if book exists
        if(!book) return res.status(404).json({message: "Book not found"});

        //check if user is the creator of the book
        if (book.user.toString() !== req.user._id.toString())
            return res.status(401).json({message: "User not authorized"});

        // delete image from cloudinary as well
        if (book.image && book.image.includes("cloudinary")) {
            try {
                //https://res.cloudinary.com/.../qyup61eji0.jpg
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log('Error in deleting image from cloudinary', deleteError);
            }
        }
        await book.deleteOne();
        res.json({message: "Book deleted successfully"});
    } catch (error) {
        console.log('Error in deleting book', error);
        res.status(500).json({message: "Internal server error" });
    }
});





export default router;
