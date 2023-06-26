const multer= require('multer');
const express=require('express');
const storage =  multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/images')
    },filename:(req,file,cb)=>{
        console.log(file);
        cb(null,file.originalname+'a1b2c3' + Date.now() )
    }
})
const upload= multer({storage});

module.exports =upload;

