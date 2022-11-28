const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Exam = require("../models/Exam");
const { Types } = require("mongoose");

const UsersController = {
  signup: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (user) {
        return res.status(200).json({ email: "The email already exist" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: passwordHash,
      });
      await newUser.save();

      const accesstoken = createAccessToken({ id: newUser._id });

      res.json({ newUser, accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) return res.status(200).json({ email: "User does not exist" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(200).json({ password: "Incorrect Password" });
      }

      const accesstoken = createAccessToken({ id: user._id });

      res.json({ user, accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("jwt");

      res.json({ message: "Logout Successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  infor: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");

      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateInfor: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ user: "User does not exist" });
      }

      // validate old password
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ password: "Incorrect Password" });
      }

      // hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // update user's password
      user.password = hashedPassword;
      const updatedUser = await user.save();

      return res.json({ user: updatedUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  statisticsNumberExam: async (req, res) => {
    try {
      const statisticsNumberExam = await Exam.aggregate([
        { $match: { user: new Types.ObjectId(req.user.id) } },
        {
          $project: {
            month: {
              $month: {
                $toDate: "$createdAt",
              },
            },
            category: "$category",
          },
        },
        {
          $group: {
            _id: {
              month: "$month",
              category: "$category",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              category: "$_id.category",
            },
            results: {
              $push: {
                month: "$_id.month",
                count: "$count",
              },
            },
          },
        },
      ]);
      res.json({ statisticsNumberExam });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  statisticsScoreExam: async (req, res) => {
    try {
      const statisticsNumberExam = await Exam.aggregate([
        { $match: { user: new Types.ObjectId(req.user.id) } },
        {
          $project: {
            month: {
              $month: {
                $toDate: "$createdAt",
              },
            },
            category: "$category",
            score: "$score",
          },
        },
        {
          $group: {
            _id: {
              month: "$month",
              category: "$category",
            },
            count: { $avg: "$score" },
          },
        },
        {
          $group: {
            _id: {
              category: "$_id.category",
            },
            results: {
              $push: {
                month: "$_id.month",
                count: "$count",
              },
            },
          },
        },
      ]);
      res.json({ statisticsNumberExam });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

module.exports = UsersController;
