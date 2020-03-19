var mongoose = require('mongoose')
var express = require('express')
var async = require('async')
var router = express.Router()
var _Obj = mongoose.Schema({
    prod_id: {
        type: String,
        unique: true,
        required: true
    },
    prod_name: String,
    prod_img: Array,
    prod_desc: String,
    prod_rating: Number,
    prod_category: String,
    prod_man: String,
    prod_yop: String,
    By_User: String,
    Status: Boolean,
    Lended_by: String,
    Expiry_date:Date,
    lend_date: Date
}, {
    collection: "borrow_box_inventory"
})

var _inventory = mongoose.model('_inventory', _Obj)
mongoose.connect('YOUR MONGOD CONNECTION STRING', {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

router.get('/borrow/:_param/:_category', function (req, res) {
    console.log('okay')
    if(req.params._category!='all'){
        _inventory.find({
        prod_name: {
            $regex: new RegExp(req.params._param, "i")
            },
        prod_category: req.params._category,
        Lended_by: null
    },'prod_name prod_img prod_desc prod_category prod_rating prod_man prod_yop').exec(function (err, data) {
        console.log(data)
        res.send(data)
    })
}
else{
    _inventory.find({
        prod_name: {
            $regex: new RegExp(req.params._param, "i")
            },
        Lended_by: null
    },'prod_name  prod_desc prod_category prod_rating ').exec(function (err, data) {
        console.log(data)
        res.send(data)
    })
}
})
router.get('/info/:_id', function (req, res) {
    _inventory.find({
        prod_id: req.params._id
    }).exec(function (err, data) {
        res.send(data)
    })
})
router.get('/search/:_prodName', function (req, res) {
    _inventory.find({
        prod_name: req.params._prodName
    }).exec(function (err, data) {
        res.send(data)
    })
})








module.exports.add_to_db = function (data, callback) {
    var temp = new _inventory(data);
    temp.save().then(() => callback('okay'))
}
module.exports._inventory = _inventory
module.exports.router = router
module.exports.add_to_db
