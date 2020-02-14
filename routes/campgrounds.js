const express= require('express'),
      Campground= require('../models/campground');
const router = express.Router();

//middleware
const isLoggedIn = (req, res, next)=> {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

//INDEX - show all Campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds)=>{
        if(err){
            console.log(err);
        } else {
            console.log('campgrounds', campgrounds);
            res.render('campgrounds/index', {campgrounds: campgrounds, currentUser: req.user});
        }
    })
});

//CREATE - create a new campground
router.post('/', isLoggedIn, (req,res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author };
    Campground.create(newCampground, (err,campground)=>{
        if(err){
            console.log('err', err);
        } else {
            console.log("newly created")
            res.redirect("/campgrounds");
        }
    })
})

// NEW - form to create a new campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
});

//SHOW - show one particular campground
router.get("/:id", (req, res)=> {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

module.exports = router;