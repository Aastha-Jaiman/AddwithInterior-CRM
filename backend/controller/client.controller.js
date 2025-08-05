const ClientModel = require('../model/client.model');
const Jwt = require("jsonwebtoken");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const sendEmail = require('../utils/sendMail')


exports.registerClientByAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      project,
      quotation,
      aadharCardNumber,
    } = req.body;

    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Only admin can create clients." });
    }

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    if (aadharCardNumber && !/^\d{12}$/.test(aadharCardNumber)) {
      return res.status(400).json({ message: "Aadhar number must be exactly 12 digits." });
    }

    const [emailExists, phoneExists] = await Promise.all([
      ClientModel.findOne({ email }),
      ClientModel.findOne({ phone }),
    ]);

    if (emailExists) {
      return res.status(400).json({ message: "Email already exists." });
    }

    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already exists." });
    }

    let profileData = {
      url: null,
      public_id: null,
      initials: null,
    };

    if (req.files?.profile && req.files.profile[0]) {
      const profileUpload = await uploadOnCloudinary(req.files.profile[0].path, "client-profile");
      profileData = {
        url: profileUpload.secure_url,
        public_id: profileUpload.public_id,
        initials: name.trim()[0].toUpperCase(),
      };

      if (fs.existsSync(req.files.profile[0].path)) {
        fs.unlinkSync(req.files.profile[0].path);
      }
    } else {
      profileData = {
        url: `https://ui-avatars.com/api/?name=${name.trim()[0].toUpperCase()}&background=random&color=fff`,
        public_id: null,
        initials: name.trim()[0].toUpperCase(),
      };
    }

    let idProofData = {
      url: null,
      public_id: null,
    };

    if (req.files?.idProof && req.files.idProof[0]) {
      const idProofUpload = await uploadOnCloudinary(req.files.idProof[0].path, "client-idproof");
      idProofData = {
        url: idProofUpload.secure_url,
        public_id: idProofUpload.public_id,
      };

      if (fs.existsSync(req.files.idProof[0].path)) {
        fs.unlinkSync(req.files.idProof[0].path);
      }
    }

    let parsedAddress = address;
    if (typeof address === "string") {
      parsedAddress = JSON.parse(address);
    }

    if (!Array.isArray(parsedAddress)) {
      return res.status(400).json({ message: "Address must be an array." });
    }

    for (const addr of parsedAddress) {
      const info = addr.addressinfo;
      if (
        !addr.addresstype || !["home", "work", "other"].includes(addr.addresstype) ||
        !info || !info.street || !info.city || !info.state || !info.country || !info.pincode
      ) {
        return res.status(400).json({ message: "Invalid address format." });
      }
    }

    const newClient = new ClientModel({
      name,
      email,
      phone,
      password,
      aadharCardNumber: aadharCardNumber || null,
      address: parsedAddress,
      profile: profileData,
      idProof: idProofData,
      project: project || null,
      quotation: quotation || null,
      isActive: true,
    });

    await newClient.save();

    res.status(200).json({
      message: "Client registered successfully.",
      client: {
        ...newClient.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error registering client:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.loginClient = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required" });
    }

    const user = await ClientModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = Jwt.sign(
      { id: user._id,  role: "client" },
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
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
      try {

            const clientId = req.user?._id;

            if (!clientId) {
                  return res.status(400).json({ success: false, message: "Unauthorized. Please login." })
            }

            const client = await ClientModel.findById(clientId).select("-password -__v");

            if (!client) {
                  return res.status(401).json({ message: "User Not Found." })
            };

            res.status(200).json({
                  success: true,
                  message: "fetch successfully.",
                  client
            })

      } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
      }
}

exports.logoutClient = async (req, res) => {
      try {
            const token = req.cookies.token;

            if (!token) {
                  return res.status(400).json({ message: "Not Logged in." })
            }

            res.cookie("token", "", {
                  httpOnly: true,
                  sameSite: "None",
                  expire: new Date(0),
                  secure: true
            });

            res.status(200).json({
                  message: "Successfully LoggedIn."
            })

      } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
      }
}

exports.updateClientByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Only admin can update clients." });
    }

    const {
      name,
      email,
      phone,
      address,
      project,
      quotation,
      aadharCardNumber,
      isActive,
    } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    if (aadharCardNumber && !/^\d{12}$/.test(aadharCardNumber)) {
      return res.status(400).json({ message: "Aadhar number must be exactly 12 digits." });
    }

    const [emailExists, phoneExists] = await Promise.all([
      ClientModel.findOne({ email, _id: { $ne: id } }),
      ClientModel.findOne({ phone, _id: { $ne: id } }),
    ]);

    if (emailExists) {
      return res.status(400).json({ message: "Email already exists." });
    }

    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already exists." });
    }

    // Parse address
    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch (err) {
        return res.status(400).json({ message: "Invalid address JSON format." });
      }
    }

    if (!Array.isArray(parsedAddress)) {
      return res.status(400).json({ message: "Address must be an array." });
    }

    for (const addr of parsedAddress) {
      const info = addr.addressinfo;
      if (
        !addr.addresstype ||
        !["home", "work", "other"].includes(addr.addresstype) ||
        !info ||
        !info.street ||
        !info.city ||
        !info.state ||
        !info.country ||
        !info.pincode
      ) {
        return res.status(400).json({ message: "Invalid address format." });
      }
    }

    // Prepare updated data
    const updatedData = {
      name,
      email,
      phone,
      address: parsedAddress,
      project: project || null,
      quotation: quotation || null,
      aadharCardNumber: aadharCardNumber || null,
      isActive: isActive !== undefined ? isActive : true,
    };

    // Profile image handling (single file expected as req.file)
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path, "client-profile");

      if (!uploaded) {
        return res.status(500).json({ message: "Image upload failed." });
      }

      updatedData.profile = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        initials: name.trim()[0].toUpperCase(),
      };

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const updatedClient = await ClientModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
      select: "-password -__v",
    });

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found." });
    }

    res.status(200).json({
      message: "Client updated successfully.",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

exports.getAllClientByAdmin = async (req, res) => {
      try {

            const userRole = req.user.role;

            if (!["admin"].includes(userRole)) {
                  return res.status(401).json({ message: "Only Admin can Get ." })
            }

            const search = req.query.search || "";

            const query = {
                  name: { $regex: search, $options: "i" },
            };

            const client = await ClientModel.find(query).select("-password -__v");

            res.status(200).json({
                  success: true,
                  message: "Succefully Fetch",
                  total: client.length,
                  client
            })

      } catch (error) {
            return res.status(500).json({ message: "Server Error", error: error.message })
      }
}

exports.resetPassword = async (req, res) => {
      try {

            const userId = req.user._id;

            const { oldPassword, newPassword, confirmPassword } = req.body;

            if (!oldPassword || !newPassword || !confirmPassword) {
                  return res.status(400).json({ message: "All feilds are required." })
            };

            const client = await ClientModel.findById(userId).select("+password");
            if (!client) {
                  return res.status(404).json({ message: "User not found." });
            }

            const isMatch = await client.comparePassword(oldPassword);
            if (!isMatch) {
                  return res.status(400).json({ message: "Old password is incorrect." });
            }

            if (newPassword !== confirmPassword) {
                  return res.status(400).json({ message: "newPassword and confirmPassword are not same." })
            }

            const isSame = await client.comparePassword(newPassword);

            if (isSame) {
                  return res.status(400).json({ message: "New password cannot be same as old password." });
            };

            client.password = newPassword;
            await client.save();

            res.status(200).json({ message: "Password changed successfully." });



      } catch (error) {
            return res.status(500).json({ message: "Server Error.", error: error.message })
      }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const client = await ClientModel.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }

    const token = Jwt.sign({ clientId: client._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    client.resetToken = token;
    await client.save();

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const subject = "Reset Your Password";
    const message = `
      <h3>Hello ${client.name || "Client"},</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank">Reset Password</a>
      <p><b>Note:</b> This link will expire in 10 minutes or after one use.</p>
    `;

    const sent = await sendEmail(client.email, subject, message);
    if (!sent) {
      return res.status(500).json({ message: "Failed to send reset email" });
    }

    res.status(200).json({
      message: "Password reset link sent to email",
      token: token,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    const user = await ClientModel.findById(decoded.clientId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    userToken[token] = true;

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

exports.getClientById = async (req, res) => {
  try {
    const userRole = req.user.role;
    const { id } = req.params;

    if (!["admin"].includes(userRole)) {
                  return res.status(403).json({ success: false, message: "Only admin can get profile" });
            }

    const client = await ClientModel.findById(id).select("-password");

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

