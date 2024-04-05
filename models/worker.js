import mongoose from "mongoose";

const {Schema} = mongoose;

const workerSchema = new Schema({
firstName: {
    type: String
},
lastName: {
    type:String
},
phone:{
    type:Number,
    required:true
},
gender:{
    type:String,
    enum: ['male', 'female', 'other'] 
},
services: {
    type:String
},
yearsOfExp: {
    type:Number,
    required:true
},
address:{
    type:String
},
state: {
    type:String
},
pincode: {
    type: Number
}
})

const worker = mongoose.model("worker",workerSchema);

export default worker;