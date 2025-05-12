const mongoose=require("mongoose")

const inputValidation=new mongoose.Schema({prop:{type:String,required:true},val:{type:String,required:true}})
const fields=new mongoose.Schema({mainLabel:{type: String},inputType: String,inputvalidation:{type:[{type:inputValidation}]},shortHand:{type:[{type:String}]}})
const select=new mongoose.Schema({mainLabel:String,options:{type:[{type:String}]},inputvalidation:{type:[{type:inputValidation}]},shortHand:{type:[{type:String}]}})
const radio=new mongoose.Schema({mainLabel:String,options:{type:[{type:String}]},inputValidation:{type:[{type:inputValidation}]},shortHand:{type:[{type:String}]}})
const checkbox=new mongoose.Schema({mainLabel:String,options:{type:[{type:String}]},inputvalidation:{type:[{type:inputValidation}]},shortHand:{type:[{type:String}]}})

const CounterSchema=new mongoose.Schema({
    _id: {type: String, required: true},
    seq: {type:Number,default:0}
})

const Counter=mongoose.model("Counter",CounterSchema);

const FormSchema= mongoose.Schema({
    formId:{type:Number,unique:true},   
    title: {required: true,type:String,unique: true},
    noOfFields:{required: true,type: Number},
    formFields:{type:[mongoose.Schema.Types.Mixed],required:true},
    formType: {type: String,required: true}
})

FormSchema.pre("save",async function(next){
    console.log("Hello")
    if(this.isNew){
        const counter=await Counter.findByIdAndUpdate({_id:"formId",},{$inc:{seq:1}},{new:true,upsert:true})
        this.formId=counter.seq;
    }
    
    next();
})

const FormModel=mongoose.model("Form",FormSchema);

module.exports=FormModel;