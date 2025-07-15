const ClientModel = require('../model/client.model');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const sendEmail = require('../utils/sendMail')


exports.registerClientByAdmin = async (req, res) => {
      try {
            const { name, email, phone, password, address, project, quotation } = req.body;
            const userRole = req.user.role;

            if (!["admin"].includes(userRole)) {
                  return res.status(403).json({ success: false, message: "Access denied" });
            }

            if (!name || !email || !password || !phone || !address) {
                  return res.status(400).json({ message: "All fields are required." });
            }

            const emailExists = await ClientModel.findOne({ email });
            if (emailExists) return res.status(400).json({ message: "Email already exists." });

            const phoneExists = await ClientModel.findOne({ phone });
            if (phoneExists) return res.status(400).json({ message: "Phone number already exists." });

            // Get initials from name
            const firstLetter = name?.charAt(0)?.toUpperCase() || "U";

            let profileData = {
                  url: `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff`,
                  public_id: null,
                  initials: firstLetter,
            };

            if (req.file) {
                  const uploaded = await uploadOnCloudinary(req.file.path, "profile");
                  if (!uploaded) {
                        return res.status(500).json({ message: "Cloudinary upload failed." });
                  }

                  profileData = {
                        url: uploaded.secure_url,
                        public_id: uploaded.public_id,
                        initials: firstLetter,
                  };

                  if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
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
                  if (
                        !addr.addresstype ||
                        !["home", "work", "other"].includes(addr.addresstype) ||
                        !addr.addressinfo ||
                        !addr.addressinfo.street ||
                        !addr.addressinfo.city ||
                        !addr.addressinfo.state ||
                        !addr.addressinfo.country ||
                        !addr.addressinfo.pincode
                  ) {
                        return res.status(400).json({ message: "Invalid address format." });
                  }
            }

            const newClient = new ClientModel({
                  name,
                  email,
                  password,
                  phone,
                  address: parsedAddress,
                  profile: profileData,
                  isActive: true,
                  project: project || null,
                  quotation: quotation || null,
            });

            await newClient.save();

            res.status(201).json({
                  message: "Client registered successfully.",
                  client: {
                        ...newClient.toObject(),
                        password: undefined,
                  },
            });

      } catch (error) {
            console.error("Register error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
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

            const client = await ClientModel.findOne({
                  $or: [{ email: identifier }, { phone: identifier }]
            }).select("+password");

            if (!client) {
                  return res.status(400).json({ message: "Invalid credentials" });
            }

            const isMatch = await client.comparePassword(password);
            if (!isMatch) {
                  return res.status(400).json({
                        message: "Passowrd is not correct."
                  })
            }

            const token = jwt.sign(
                  { id: client._id },
                  process.env.JWT_SECRET,
                  { expiresIn: "7d" }
            )

            res.cookie("token", token, {
                  secure: false,
                  httpOnly: true,
                  maxAge: 7 * 24 * 60 * 60 * 1000,
                  sameSite: "None"
            });

            res.json({
                  message: "Login successful",
                  token,
                  client: {
                        id: client._id,
                        email: client.email,
                        name: client.name,
                  },
            });

      } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
      }
}

exports.getProfile = async (req, res) => {
      try {

            const clientId = req.user?.id;

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
            const userRole = req.user.role;

            if (!["admin"].includes(userRole)) {
                  return res.status(403).json({ success: false, message: "Access denied" });
            }

            const {
                  name,
                  email,
                  phone,
                  address,
                  project,
                  quotation,
                  isActive
            } = req.body;

            const existEmail = await ClientModel.findOne({ email, _id: { $ne: id } });
            if (existEmail) {
                  return res.status(400).json({ message: "Email already exists." });
            }

            const existPhone = await ClientModel.findOne({ phone, _id: { $ne: id } });
            if (existPhone) {
                  return res.status(400).json({ message: "Phone number already exists." });
            }


            const updatedData = {
                  name,
                  email,
                  phone,
                  project,
                  quotation,
                  isActive,
            };

            let parsedAddress = address;

            if (typeof address === "string") {
                  try {
                        parsedAddress = JSON.parse(address);
                  } catch (err) {
                        return res.status(400).json({ message: "Invalid address JSON." });
                  }
            }

            if (parsedAddress && !Array.isArray(parsedAddress)) {
                  return res.status(400).json({ message: "Address must be an array." });
            }

            if (Array.isArray(parsedAddress)) {
                  for (const addr of parsedAddress) {
                        if (
                              !addr.addresstype ||
                              !["home", "work", "other"].includes(addr.addresstype) ||
                              !addr.addressinfo ||
                              !addr.addressinfo.street ||
                              !addr.addressinfo.city ||
                              !addr.addressinfo.state ||
                              !addr.addressinfo.country ||
                              !addr.addressinfo.pincode
                        ) {
                              return res.status(400).json({ message: "Invalid address format." });
                        }
                  }

                  updatedData.address = parsedAddress;
            }

            if (req.file) {
                  const uploaded = await uploadOnCloudinary(req.file.path, "profile");

                  if (!uploaded) {
                        return res.status(500).json({ message: "Image upload failed." });
                  }

                  updatedData.profile = {
                        url: uploaded.secure_url,
                        public_id: uploaded.public_id,
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
                  success: true,
                  message: "Client profile updated successfully.",
                  client: updatedClient,
            });
      } catch (error) {
            console.error("Update error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
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

exports.resetEmailToken = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await ClientModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "email not found."
      })
    };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
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

const useToken = {};

exports.changepassword = async (req, res) => {
  try {

    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All feilds are required." })
    };

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ message: "password doesn't match." })
    }

    if (useToken[token]) {
      return res
        .status(401)
        .json({ message: "This token has already been used" });
    }

    let decoded;

    try {

      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await ClientModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    useToken[token] = true;

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


