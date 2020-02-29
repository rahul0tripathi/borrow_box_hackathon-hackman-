var express =require('express')
var app = express();
var bodyParser = require('body-parser')
var multer = require('multer')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
const searchUpload = multer({
    dest: 'searchUploads/' // this saves your file into a directory called "uploads"
  }); 
var session = []
const user_route = require('./api_drivers/borrow_box_users').router
const inventory_route = require('./api_drivers/borrow_box_inventory').router
const general_route = require('./api_drivers/general_drivers').router
const auth_route = require('./auth/authHandler').router
app.use('/static',express.static('public'))
app.use('/user_image_uploads',express.static('user_image_uploads'))
app.use('/searchUploads',express.static('searchUploads'))
app.use(express.json());       // to support JSON-encoded bodies
 // to support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/api/users/',user_route)
app.use('/api/inventory/',inventory_route)
app.use('/api/home/',general_route)
app.use('/api/auth/',auth_route)
app.get('/',function(req,res){
    res.sendFile(__dirname+'/views/home.html')

})
app.get('/dashboard',function(req,res){
    res.sendFile(__dirname+'/views/dashboard.html')
});
app.post('/searchUpload',searchUpload.single('prod_image'),function(req,res){
   res.send(req.file)
})
app.get('/api/*',function(req,res){
    res.sendStatus(404)
})

app.listen(3000)