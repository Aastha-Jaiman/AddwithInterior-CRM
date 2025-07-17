const AdminModel = require("../model/admin.model");
// const ClientModel = require("../model/client.model")
const { uploadOnCloudinary } = require("../utils/cloudinary");
const fs = require("fs");
const Jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendMail');

exports.createAdmin = async (req, res) => {
  try {

    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password || !phone || !address || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["admin"].includes(role)) {
      return res.status(400).json({ message: "Only Admin can create " });
    }

    const emailExists = await AdminModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const phoneExists = await AdminModel.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const uploaded = await uploadOnCloudinary(req.file.path, "profile");
    let profiledata = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id
    }

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const newAdmin = new AdminModel({
      name,
      email,
      password,
      phone,
      address,
      role,
      isVerified: true,
      isactive: true,
      profile: profiledata
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully", admin: newAdmin });


  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.registerStaffByAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, address, role, permission } = req.body;

    const creator = req.user;

    if (!creator || !["admin"].includes(creator.role)) {
      return res.status(403).json({ message: "Only admin  can create staff." });
    }

    if (!name || !email || !password || !phone || !address || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role === "admin") {
      return res.status(400).json({ message: "You cannot create another admin" });
    }

    const emailExists = await AdminModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const phoneExists = await AdminModel.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const uploaded = await uploadOnCloudinary(req.file.path, "profile");

    const profiledata = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    let finalPermissions = permission;
    if (permission && !Array.isArray(permission)) {
      finalPermissions = [permission];
    }

    const newStaff = new AdminModel({
      name,
      email,
      password,
      phone,
      address,
      role,
      profile: profiledata,
      permission: finalPermissions,
      isVerified: true,
      isactive: true,
    });

    await newStaff.save();

    res.status(200).json({
      message: "Staff registered successfully. Awaiting verification.",
      staff: newStaff,
    });
  } catch (error) {
    console.error("Error registering staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required" });
    }

    const user = await AdminModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
      isactive: true,
      isVerified: true
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = Jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      secure: false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permission: user.permission
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.profiledData = async (req, res) => {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const user = await AdminModel.findById(userId).select("-password -__v")

    if (!user) {
      return res.status(400).json({
        message: "user not found"
      })
    }

    res.status(200).json({
      success: true,
      user
    })

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

exports.getStaffById = async (req, res) => {
  try {
    const userRole = req.user.role;
    const { id } = req.params;

    if (!["admin"].includes(userRole)) {
                  return res.status(403).json({ success: false, message: "Only admin can get profile" });
            }

    const staff = await AdminModel.findById(id).select("-password");

    if (!staff) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


exports.updateStaffByAdmin = async (req, res) => {
  try {

    const { id } = req.params;
    const userRole = req.user.role;

    if (!["admin"].includes(userRole)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    console.log(req.body, "data")

    const {
      name,
      email,
      phone,
      address,
      role,
      permission,
      isVerified,
      isactive
    } = req.body;



    const existEmail = await AdminModel.findOne({ email, _id: { $ne: id } })
    if (existEmail) {
      return res.status(400).json({ message: "Email is already exist." })
    }

    const existphone = await AdminModel.findOne({ phone, _id: { $ne: id } })
    if (existphone) {
      return res.status(400).json({ message: "phone is already exist." })
    }

    const updateData = {
      name,
      email,
      phone,
      address,
      role,
      permission: Array.isArray(permission) ? permission : [permission],
      isVerified,
      isactive
    }



    if (role === "employee" && permission) {
      updateData.permission = Array.isArray(permission)
        ? permission
        : [permission];
    }

    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path, "profile");
      updateData.profile = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const updatedUser = await AdminModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: "-password -__v",
    });

    res.status(200).json({
      success: true,
      message: "Staff profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });

  }
}

exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const { name, address, email, phone } = req.body;

    const updateData = {};

    if (["designer", "carpenter", "salesperson"].includes(userRole)) {
      if (email || phone) {
        return res.status(401).json({
          message: "You can only update your name, address, and profile picture.",
        });
      }
    
      if (name) updateData.name = name;
      if (address) updateData.address = address;
    }

    if (["admin"].includes(userRole)) {
      if (name) updateData.name = name;
      if (address) updateData.address = address;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
    }

    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path, "profile");
      updateData.profile = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const updatedUser = await AdminModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
      select: "-password -__v",
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.logout = async (req, res) => {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "Not Logged In"
      })
    };

    res.cookie("token", "",
      {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        expires: new Date(0)

      }
    )

    return res.status(200).json({
      success: true,
      message: "sucessfully logout."
    })



  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }


}

exports.resetEmailToken = async (req, res) => {
  const { email } = req.body;
  try {

    const user = await AdminModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "email not found."
      })
    };

    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET,
      { expiresIn: "10m" }
    )

    user.resetToken = token;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${token}`; // Frontend route
    const subject = "Reset Your Password - Staff";
    const message = `
      <h3>Hello ${user.name || "User"},</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank">Reset Password</a>
      <p><b>Note:</b> This link will expire in 10 minutes or after one use.</p>
    `;

    const sent = await sendEmail(user.email, subject, message);

    if (!sent) {
      return res.status(401).json({ message: "Faild to sent reset email" })
    }

    res.status(200).json({ message: "sucessfully sent reset toke on your email", token: token })

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const userToken = {};

exports.changePassword = async (req, res) => {
  try {

    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All feilds are required." })
    };

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ message: "password doesn't match." })
    }

    if (userToken[token]) {
      return res
        .status(401)
        .json({ message: "This token has already been used" });
    }

    let decoded;

    try {

      decoded = Jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await AdminModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    userToken[token] = true;

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


exports.resetPassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await AdminModel.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

    const isSame = await user.comparePassword(newPassword);
    if (isSame) {
      return res.status(400).json({ message: "New password cannot be same as old password." });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllStaff = async (req,res) => {
  try{

    const {role} = req.query;

    const filter = {
      role : {$ne: "admin"}
    };

    if(role && ["salesperson", "designer", "carpenter"].includes(role)){
      filter.role = role;
    }

    const staff = await AdminModel.find(filter).select("-password -__v");

    res.status(200).json({
      success: true,
      staff: staff.length,
      staff
    })

  }catch(error){
    res.status(500).json({ message: "Server error", error: error.message });
  }
}