const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Help = require("../models/Help");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the helps using /api/Help/fetchhelp
router.get("/fetchhelp", async (req, res) => {
  try {
    const help = await Help.find({}).sort({date:-1});
    res.json(help);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});
router.get("/dashhelp", fetchuser,async (req, res) => {
  try {
   
    const help=await Help.find({user: req.user.id}).sort({date:-1});
    res.json(help);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});

// Route 2: to add a new Help /api/Help/addhelp
router.post(
  "/addhelp",
  fetchuser,
  [
    body("name").isLength({ min: 3 }),
    body("image"),
    body("description"),
    body("contact").isLength({ min: 3 }),
  ],

  async (req, res) => {
    try {
      const { name, image, description, contact } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const help = new Help({
        name,
        image,
        description,
        contact,
        user: req.user.id,
      });
      const savehelp = await help.save();
      res.json(savehelp);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Inernal Server Error");
    }
  }
);

// Route 3: to update a  Help /api/Help/updatehelp
router.put("/updatehelp/:id", fetchuser, async (req, res) => {
  const { name, image, description, contact } = req.body;

  try {
    //create a newhelp object
    const newhelp = {};
    if (name) {
      newhelp.name = name;
    }
    if (image) newhelp.tag = tag;

    if (description) {
      newhelp.description = description;
    }
    if (contact) {
      newhelp.contact = contact;
    }

    //find the Help to be updated and update it
    let help = await Help.findById(req.params.id);
    if (!help) {
      res.status(400).send("Not Found");
    }

    if (help.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    help = await Help.findByIdAndUpdate(
      req.params.id,
      { $set: newhelp },
      { new: true }
    );
    res.json({ help });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});

// Route 4: to delete a existing nore /api/Help/deletehelp/:id
router.delete("/deletehelp/:id", fetchuser, async (req, res) => {
  try {
    let help = await Help.findById(req.params.id);
    if (!help) {
      res.status(400).send("Not Found");
    }

    //allow deletion only if user owns this Help
    if (help.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    help = await Help.findByIdAndDelete(req.params.id);
    res.json({ success: "Help has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }

  //find the Help to be updated and update it
});

module.exports = router;
