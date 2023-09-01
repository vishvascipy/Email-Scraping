import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const UrlSchema = new Schema({
    url:{
        type:String
    },
    emailLinks: [String]
})
const Single = mongoose.model("singleurl", UrlSchema)
export { Single };    
