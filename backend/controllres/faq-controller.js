const faqModel = require("../models/faq-model");

const deleteFaq= async(req,res) =>{
    try {
        const {faqId}=req.params;
        let query ={};
        if(faqId){
            query.faqs={
                $elemMatch:{
                    _id:faqId
                }
            }
        }
    const faq= await faqModel.findByIdAndDelete(query);
    if(faq){
        res.status(200).send('Deleted successfully');
    }else{
        res.status(400).send('Not found');
    }
    } catch (error) {
        
    }
    
}
const updateFaq= async(req,res) =>{
    try {
        const {faqId}=req.params;
    const faq= await faqModel.findByIdAndUpdate({_id:faqId},req.body);
    if(faq){
        res.status(200).send('Updated successfully');
    }else{
        res.status(400).send('Not found');
    }
    } catch (error) {
        res.status(500).send(error);
    }
    
}

const addFaq= async(req,res) =>{
    try {
    const faqParentId= req.params.faqParentId;
    const faqAdd=await faqModel.findByIdAndUpdate({_id:faqParentId},{$push:{
        faqs:req.body
    }})
    if(faqAdd){
        res.status(200).send('Created successfully');
    }else{
        res.status(400).send('canNot create');
    }
    } catch (error) {
        res.status(500).send(error);
    }
    
}

const getFaqs= async(req,res) =>{
    try {
        const faqDetails=await faqModel.find();
    if(faqDetails.length>0){
        res.status(200).send(faqDetails);
    }else{
        res.status(400).send('No faqs');
    }
    } catch (error) {
        res.status(500).send(error);
    }
    
}

module.exports ={
    getFaqs,updateFaq,deleteFaq,addFaq
}

