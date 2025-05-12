const express = require("express");
const path = require("path");
const app = express();
 
app.set("view engine", "ejs"); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 

app.use("/static", express.static(path.join(__dirname, "public")));
 

app.get("/", (req, res) => {
    res.render("index.ejs");
});
 
app.get("/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views/register.html"));
});
 
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views/login.html"));
});
 

app.get("/admin", (req, res) => {
    res.render("admin-dashboard.ejs");
});
 

app.get("/dashboard", (req, res) => {
    res.render("user-dashboard.ejs");
});
 

app.get("/all-forms", (req, res) => {
    res.render("all-forms.ejs"); // Render the all-forms.ejs file
});
 

app.get("/forms", (req, res) => {
    res.render("createform.ejs");
});
 

app.get("/forms/:id", (req, res) => {
    if(req.query.role==="user"){
        console.log("user")
        res.render("user-viewform.ejs");
    }
    else if (req.query.edit) {
        console.log("Inside Here");
        res.render("createform.ejs");
    } else {
        res.render("viewform.ejs", { formId: req.params.id });
    }
});


app.get("/form/:id/responses",(req,res)=>{
    console.log("Here")
    res.render("all-responses.ejs")

})
app.get("/form/:id/responses/:userId",(req,res)=>{
    console.log("Here")
    res.render("response.ejs")
})
  
 

app.listen(4000, () => {
    console.log("Frontend server is running on port 4000");
});
 