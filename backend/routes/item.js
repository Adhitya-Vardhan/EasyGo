const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Item = require("../models/Item");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the items using /api/Item/fetchitem
router.get("/fetchitem",  async (req, res) => {
  try {
    const item = await Item.find({}).sort({date:-1});
    res.json(item);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});
router.get("/dashitem", fetchuser,async (req, res) => {
  try {
   
    const item=await Item.find({user: req.user.id}).sort({date:-1});
    res.json(item);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});

// Route 2: to add a new Item /api/Item/addItem
router.post(
  "/additem",
  fetchuser,
  [
    body("name").isLength({ min: 3 }),
    body("description").isLength({ min: 3 }),
    body("place"),
    body("on"),
    body("status"),
    body("image"),
    body("contact").isLength({ min: 3 }),
  ],

  async (req, res) => {
    try {
      const { name, description, place, on, status, image, contact } =
        req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const item = new Item({
        name,
        description,
        place,
        on,
        status,
        image,
        contact,
        user: req.user.id,
      });
      const saveitem = await item.save();
      res.json(saveitem);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Inernal Server Error");
    }
  }
);

// Route 3: to update a  Item /api/Item/updateItem
router.put("/updateitem/:id", fetchuser, async (req, res) => {
  const { name, description, place, status, on, image, contact } =
    req.body;

  try {
    //create a newItem object
    const newitem = {};
    if (name) {
      newitem.name = name;
    }
    if (description) newitem.description = description;
    if (on) {
      newitem.on = on;
    }
    if (place) {
      newitem.place = place;
    }
    if (status) {
      newitem.status = status;
    }
    if (image) {
      newitem.image = image;
    }
    if (contact) {
      newitem.contact = contact;
    }

    //find the Item to be updated and update it
    let item = await Item.findById(req.params.id);
    if (!item) {
      res.status(400).send("Not Found");
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: newitem },
      { new: true }
    );
    res.json({ item });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});

// Route 4: to delete a existing nore /api/Item/deleteitem/:id
router.delete("/deleteitem/:id", fetchuser, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      res.status(400).send("Not Found");
    }

    //allow deletion only if user owns this Item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    item = await Item.findByIdAndDelete(req.params.id);
    res.json({ success: "Item has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }

  //find the Item to be updated and update it
});

module.exports = router;
