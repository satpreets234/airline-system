const mongoose=require('mongoose');
const faq=new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
})
const faqSchema=new mongoose.Schema({
    faqs:[faq]
});

module.exports =mongoose.model('faqs',faqSchema);