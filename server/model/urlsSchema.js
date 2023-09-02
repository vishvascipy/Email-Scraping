import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const UrlsSchema = new Schema({
    urls: [String],
    emailLinks: [String]
})
const Multiple = mongoose.model("multipleurl", UrlsSchema)
export { Multiple };

// import mongoose from 'mongoose'
// const Schema = mongoose.Schema;
// const emailSchema = new Schema({
//     emailLinks: {
//         type: String
//     }
// })
// const websiteSchema = new Schema({
//     urls: [String],
//     email: [emailSchema],
// })
// const Multiple = mongoose.model("multipleurl", websiteSchema)
// export { Multiple };
