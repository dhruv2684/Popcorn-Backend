const bcrypt = require("bcrypt")
const { generateToken } = require("../service/tokenAuthentication")
const Admin = require("../model/admin")


class AdminController {


  handleCreateAdmin = async (req, res) => {
    try {
      const { firstName, lastName, emailAddress, password, phoneNumber } = req.body;

      // Check if the account already exists
      const existingUser = await Admin.findOne({
        $or: [{ emailAddress }, { phoneNumber }],
      });
      if (existingUser) {
        return res.status(409).json({ message: "Your Account Already Exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin
      const admin = await Admin.create({
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        phoneNumber,
      });

      // Generate token
      const token = generateToken(admin, "Admin");

      return res.status(201).json({
        message: "Admin created successfully",
        token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  handleSignIn = async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
      if (!phoneNumber || !password) {
        return res
          .status(400)
          .json({ message: "Both phoneNumber and password are required" });
      }
      if (isNaN(phoneNumber)) {
        return res.status(400).json({ message: "PhoneNumber must be number" });
      }

      if (phoneNumber.toString().length !== 10) {
        return res.status(400).json({ message: "PhoneNumber must be 10 digit" });
      }

      const token = await Admin.matchPasswordAndGenerateToken(phoneNumber, password);


      res.status(200).json({ message: "Signin in SucessFully", token });

    }
    catch (error) {
      if (error.message === "Admin not found") {
        return res
          .status(401)
          .json({ message: "Please sign up before accessing your account" });
      } else if (error.message === "Incorrect Password") {
        return res.status(401).json({ message: "Incorrect Password" });
      }
      return res
        .status(500)
        .json({ message: "Error logging in admin" });
    }
  }

  getAdmin = async (req, res) => {
    try {
      const adminId = req.user.id;

      const admin = await Admin.findById(adminId).select("-__v -password -createdAt -updatedAt");

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json(admin);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateAdmin = async (req, res) => {
    try {
      const adminId = req.user.id;
      const updateData = req.body;

      // Optional: restrict certain fields from being updated
      if (updateData.password) {
        return res.status(400).json({ message: "Password update not allowed from this endpoint" });
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(
        adminId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password -__v -createdAt -updatedAt");

      if (!updatedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json({
        message: "Admin updated successfully",
        admin: updatedAdmin
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };



}
module.exports = new AdminController();