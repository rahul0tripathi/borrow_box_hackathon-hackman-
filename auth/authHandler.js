var express = require('express')
var mongoose = require('mongoose')
var fs = require('fs')
var _ = require('underscore')
var uniqid = require('uniqid');
var _users = require('../api_drivers/borrow_box_users').db
console.log(_users)
var router = express.Router()
var session = []
router.post('/login',function(req,res){
    var U_name = req.body.U_name;
    var pass = req.body.U_pass;
    console.log(req.body)
    _users.findOne({U_name:U_name}).exec(function(err,data){
        
        if(err || data == null){res.send({err:"USER_NOT_FOUND",data:null})}
       
        else{
            if(data.U_pass == pass){
                var temp_sid = uniqid()
                var index = _.findWhere(session, {name: data.U_name});
                if(!index){
                    var _obj = {name:data.U_name,sid:temp_sid}
                    session.push(_obj)

                    res.send(JSON.stringify({err:null,data:_obj}))
                }
                else{
                    res.send({err:"USR_ALREADY_LOGGED_IN",data:null})
                }
            }
            else{
                res.send({err:"PASS_DO_NOT_MATCH",data:null})
            }
        }
    })
})

module.exports.router = router
module.exports.session = function(){return session}
module.exports.removeUser = function(uname) {
    for(var i = 0; i < session.length; i++) {
        if(session[i].name == uname) {
            session.splice(i, 1);
            break;
        }
    }
}