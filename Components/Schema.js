const mongoose = require('mongoose')

const BookList = new mongoose.Schema({
    
    title:{
        type:String,
        required:true,
        max:20,
        min:1,      
     },
     author:{
         type:String,
         required:true
     },
     price:{
         type:Number,
         required:true
     },
     isbn:{
        type:String,
         required:true
      },
}
)
module.exports = mongoose.model("Directory", BookList);