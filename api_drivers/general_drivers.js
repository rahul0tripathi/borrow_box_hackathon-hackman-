var express = require('express')
var router = express.Router()
var path = require('path')
var fs = require('fs')
var _latest = fs.readFileSync(path.join(__dirname, '../cache/_latest.json'))

router.get('/get_latest',function(req,res){
    res.send(_latest)
})
module.exports.router = router
module.exports.add_to_latest = function(data,callback){

}