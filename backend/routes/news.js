const express = require("express");

const News = require("../models/news");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// ------------ POST ---- CREATE NEWS ARTICLE
router.post("", checkAuth, (req, res, next) => {
    console.log("POST @ /api/news");

    const newNews = new News({
        title: req.body.title,
        content: req.body.content,
        postedDate: req.body.postedDate
    });

    newNews.save().then(createdNews => {
        console.log("Saved News Article to DB: ");
        console.log(createdNews);
        res.status(200).json({
            message: 'News article added successfully!',
            newsId: createdNews._id
        });
    });

});

// ----------- GET ALL NEWS ARTICLES -------- GET
router.get("", (req,res, next) => {
    console.log('GET @ /api/news');

    News.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'All News Articles fetched successfully',
                news: documents
            });
        });
});

// ------------------ UPDATE ONE NEWS ARTICLE
router.put("/:id", checkAuth, (req, res, next) => {
    const updateNews = new News({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        postedDate: req.body.postedDate
    })

    News.updateOne({ _id: req.params.id}, updateNews).then(result => {
        console.log(result);
        if(result.n == 0) {
            console.log("no UpDaTe occured!");
            return res.status(401).json({ message: "User not authorized to edit News!"});
        } else {
            console.log('update todo successful');
            return res.status(200).json({ message: "Update Successful!"});
        }
    })
});


// -------------------- DELETE ONE NEWS ARTICLE
router.delete("/:id", checkAuth, (req, res, next) => {
    console.log('DELETE @ /api/news/');
    console.log(req.params.id);

    News.findOneAndDelete({ _id: req.params.id})
        .then(result => {
            console.log("within delete news ");
            console.log(result);
            if(!result) {
                console.log("find and delete failed");
                return res.status(401).json({message: 'user not owner of todo!'});
            } else {
                console.log("todo delete successful");
                return res.status(200).json({message: 'user not owner of todo!'});
            }
        
    });
})


module.exports = router;