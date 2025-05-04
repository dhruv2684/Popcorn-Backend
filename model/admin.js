const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const {generateToken} = require("../service/tokenAuthentication")


const adminSchema = new mongoose.Schema({
    firstName :{
        type:String,
        require:true
    },
    lastName :{
        type:String,
        require:true
    },
    emailAddress :{
        type:String,
        require:true
    },
    phoneNumber :{
        type:Number,
        require:true,
    
    },
    password :{
        type:String,
        require:true
    },
    profileImage :{
        type:String,
        require:true
    }
},{timestamps:true})

adminSchema.statics.matchPasswordAndGenerateToken = async function(phone , password){
    try {
        const admin = await this.findOne({phoneNumber:phone})
        if(!admin) {
            throw new error("admin not found")
        }
        const IsPasswordCorrect = await bcrypt.compare(password , admin.password)
        if(!IsPasswordCorrect){
            throw new error("Incorrect Password")
        }
        const token = generateToken(admin , "Admin")
        return token
    } catch (error) {
       throw error; 
    }
}

const Admin = mongoose.model("Admin",adminSchema)
module.exports = Admin