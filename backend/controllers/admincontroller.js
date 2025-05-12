const express=require("express")
const mongoose=require("mongoose")
const FormModel=require("../models/forms.js")
const Responses=require("../models/responses.js");
const UserModel=require("../models/users.js")
async function getDashboard(req,res){
    try{
        const forms= await FormModel.find();
        console.log(forms)
        res.json(forms)

    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}


async function createForm(req,res){
    const arr=[];
    const obj=req.body;
    console.log(req.body);
    try {

        let formData=await FormModel.create(obj);
        res.status(200).json({data:formData})
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"});
        return;
    }
}

async function updateFormById(req,res){

    if(req.body!==undefined && req.params!==undefined){

        const obj=req.body;
        try {
            const response = await FormModel.findOneAndUpdate({formId:req.params.id},obj);
            res.status(200).json({message:"Form Updated Successfully"});
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"Internal Server Error"});
        }

    }
}

async function deleteFormById(req,res){
    if(req.params.id!==undefined){
        try {
            await FormModel.findOne({formId:req.params.id})
            await FormModel.deleteOne({formId:req.params.id});
            res.status(200).json({message:"Data Deleted"});
        } catch (error) {
            res.status(500).json({message:"Internal Server Error"})
        }
    }
}

async function getForms(req,res){
    if(req.body){
        try {
            const forms= await FormModel.find();
            const user=await UserModel.findOne({_id:req.user._id})
            const arr=[]
            forms.forEach(element => {
                if(!user.forms.contains(element._id)){
                    arr.push(element);
                }
            });
            res.status(200).json({data:arr});
            return;

        } catch (error) {
            res.status(400).json({message:"Submit User Data"});
            return;
        }
    }

    else{
        res.status(500).json({message:"Internal Server Error"});
        return;

    }

}

async function getFormByTitle(req,res){

    if(req.body){
        try{
            const formData=await FormModel.findOne({title: req.body.title})
            res.status(200).json({data:formData})
            return;
        }
        catch(error){
            console.log(error)
            res.status(500).json({message:"Internal Server Error"});
            return;
        }
     
    }
    else{
        res.status(400).json({message:"Data Not Found"})

    }

}
async function getFormById(req,res){
    console.log(req.params.name);
    if(req.params.id!==undefined){

        try{
            console.log("Printed")
            const formData=await FormModel.findOne({formId: req.params.id})
            console.log(formData)
            res.status(200).json({data:formData})
            return;
        }
        catch(error){
            console.log(error)
            res.status(500).json({message:"Internal Server Error"});
            return;
        }
    
    }
}


async function getResponses(req,res){

    if(req.params.id){
        const userArray=[]
        try{
            const responses=await Responses.find({formId:req.params.id});
            for(let i=0;i<responses.length;i++){
                const user=await UserModel.findOne({_id:responses[i]["userId"]})
                userArray.push(user)
            }
            res.status(200).json({data:userArray})
            return;
        }
        catch(error){

            console.log(error);
            res.status(500).json({message:"Internal Server Error"});
        }
      
    }
    else{
        res.status(400).json({message:"Please Send Form Id"});
        return;
    }

}


async function getResponsesForUser(req,res){

    if(req.params){
        try{
            const responses=await Responses.find({userId:req.params.userId,formId:req.params.id});
            console.log(responses);
            res.status(200).json({data:responses});
            return;
        }
        catch(error){
            res.status(500).json({message:"Error While retrieving Responses"})
            return;
        }

    }
    else{

        res.status(400).json({message:"User Details Empty"})
        return;
    }

}

module.exports={getDashboard,createForm,getForms,getResponses,getResponsesForUser,getFormByTitle,getFormById,updateFormById,deleteFormById}