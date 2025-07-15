const ClientModel = require('../model/client.model');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary");


exports.registerClientByAdmin = async (req, res) => {
      try {
            const { name, email, phone, password, address, project, quotation } = req.body;
            const creator = req.user;

            if (!creator || creator.role !== "admin") {
                  return res.status(403).json({ message: "Only admin can register clients." });
            }

            if (!name || !email || !password || !phone || !address) {
                  return res.status(400).json({ message: "All fields are required." });
            }

            const emailExists = await ClientModel.findOne({ email });
            if (emailExists) return res.status(400).json({ message: "Email already exists." });

            const phoneExists = await ClientModel.findOne({ phone });
            if (phoneExists) return res.status(400).json({ message: "Phone number already exists." });

            //     if (!req.file) {
            //       return res.status(400).json({ message: "Profile picture is required." });
            //     }

            const uploaded = await uploadOnCloudinary(req.file.path, "profile");
            if (!uploaded) {
                  return res.status(500).json({ message: "Cloudinary upload failed." });
            }

            const profileData = {
                  url: uploaded.secure_url,
                  public_id: uploaded.public_id,
            };

            if (fs.existsSync(req.file.path)) {
                  fs.unlinkSync(req.file.path);
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
      password,
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
