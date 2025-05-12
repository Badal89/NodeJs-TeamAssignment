const User = require("../models/users");
const FormModel = require("../models/forms");
const ResponseModel = require("../models/responses");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose=require("mongoose")
exports.register = async (req, res) => {
  try {
    console.log("Register request received:", req.body); // Debugging log
    const { name, email, password } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
 
    console.log("User registered successfully:", newUser); 
 
  
    res.status(201).json({ redirect: "/login.html" });
  } catch (error) {
    console.error("Registration error:", error); 
    res.status(500).json({ error: "Internal server error" });
  }
};
 

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
 

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found"); 
      return res.status(401).json({ error: "Invalid credentials" });
    }
 
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password Valid:", isPasswordValid);
    if (!isPasswordValid) {
      console.log("Invalid password"); 
      return res.status(401).json({ error: "Invalid credentials" });
    }
 
  
    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
 

    if (user.roles === "admin") {
      res.status(200).json({ redirect: "/admin", token, userId: user._id });
    } else {
      res.status(200).json({ redirect: "/dashboard", token, userId: user._id });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
 
exports.getAllForms = async (req, res) => {
  try {
    const forms = await FormModel.find();
    if (forms.length === 0) {
      return res.status(404).json({ message: "No forms found" });
    }
    res.status(200).json({ forms });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

 
exports.getUserForms = async (req, res) => {
  try {
    const { userId } = req.params;
 
   
    let titlesArray=[];
    const responses = await ResponseModel.find({ userId }).populate("formId");
    console.log(responses)
    for(let i=0;i<responses.length;i++){
        console.log(i);
        const loadedForm=await FormModel.findOne({formId:responses[i]["formId"]})
        if(loadedForm!==null){
          console.log(loadedForm)
          const obj={title:loadedForm["title"],noOfFields:loadedForm["noOfFields"]};
          titlesArray.push(obj);
          console.log(titlesArray)
        }
       
    }
    console.log(titlesArray);
    res.status(200).json({ formData:titlesArray });
  } catch (error) {
    console.error("Error fetching user forms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
 
exports.getFormById=async (req,res)=>{
  console.log(req.params.id);
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
 
 
exports.submitFormResponse = async (req, res) => {
  try {
    const { formId } = req.params; 
    const { responses } = req.body; 
    console.log(responses)
    console.log(req.params.formId)
    console.log(req.user.id)
  
    const existingField=await ResponseModel.findOne({formId:formId,userId:req.user.id});
    if(existingField){
        await ResponseModel.findOneAndUpdate({formId:formId,userId:req.user.id},{ formId: Number(formId), 
          userId:(req.user.id) , 
          responses:responses})
    }
    
    else{

     ResponseModel.create({
      formId: Number(formId), 
      userId:(req.user.id) , 
      responses:responses,
    }).then(data=>console.log(data)).catch(err=>console.log(err));
  }
    res.status(200).json({ message: "Form response submitted successfully" });
  } catch (error) {
    console.error("Error submitting form response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
 