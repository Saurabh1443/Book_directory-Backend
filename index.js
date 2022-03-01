const express=require('express')
const cors =require('cors')
require('./Components/config')
const Booklist = require('./Components/Schema');
const user = require('./Components/Users')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Verify_token = require('./Components/Verifiction')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
const app = express();
app.use(cors());
app.use(express.json())

app.post('/register',async(req,res)=>{
    console.log(req.body)
    let check = await user.findOne({email:req.body.email}).lean();

    if(check)return res.json({status:"200",message:"user already registered"})

    else{
        try{
       req.body.password= await bcrypt.hash(req.body.password,10);

       let newUser = new user(req.body);
       let results = await newUser.save();
       const token = jwt.sign(
        {
            _id: req.body.password
        },
        JWT_SECRET,{expiresIn:"1h"}
    )
        return res.json({results:results,token:token,status:201});
        }catch(err){
            console.log(err,"yes");
        }
    }
})
app.post('/login',async(req,res)=>{
    let userExist = await user.findOne({email:req.body.email}).lean();

    if(!userExist) {return res.json({status:"402",message:"user not registered"})}

    else{
        try{
            let isPasswordValid = await bcrypt.compare(req.body.password,userExist.password);
            if(!isPasswordValid) { return res.json({status:"404",message :"Wrong password"})}
            else {
                const token = jwt.sign(
                    {
                        _id: userExist._id
                    },
                    JWT_SECRET,{expiresIn:"1h"}
                )
               return res.json({userExist,token,status:200})
            }
        }catch(err){
            console.log(err);
        }
    }
})
app.get('/getBooks',Verify_token, async(req,res)=>{
 
    const Books = await Booklist.find()
    if(!Books) return res.json({status501,message:"booklist is empty add some books"})

    else{
        return res.json(Books);
    }
 })

 app.post("/addBooks" ,Verify_token,async(req,res)=>{
    let bookAlreadyExist = await Booklist.findOne({isbn:req.body.isbn}).lean()
    if(bookAlreadyExist) return res.json({status:"402" ,message:"book already present"});
     
    else{
        let books = new Booklist(req.body);
    books = await books.save();
    return res.json(
        {
            status:200,books
        }
    );
    }
 })

 app.get('/getBooksByisbn/:id',Verify_token, async(req,res)=>{
     const bookAvailable = await Booklist.findOne({isbn:req.params.id}).lean(); 
     if(!bookAvailable) return res.json({status:"404",message:"Book not found"})

     else{
         console.log(bookAvailable,"nothing")
         return res.json(
            bookAvailable
         )
     }
 })

app.delete('/removeBook/:isbn' ,Verify_token,async(req,res)=>{
     let deletedItem = await Booklist.deleteOne({isbn:req.params.isbn});
    return res.json({message:"book deleted"})
    
})
app.put('/updateitem',Verify_token,async(req,res)=>{
    console.log(req.body);
    let result =await Booklist.updateOne({isbn: req.body.isbn}, {$set:{title:req.body.title}})
    console.log(result);
})
 module.exports = JWT_SECRET
app.listen(3002,(req,res)=>{console.log("listening")});