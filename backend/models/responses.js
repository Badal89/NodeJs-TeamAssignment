const mongoose = require("mongoose");
 
const responseSchema = new mongoose.Schema({
  formId: {
    type: Number, 
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  responses:[{type:Object,requird:true}],
});
 
module.exports = mongoose.model("Response", responseSchema);
 