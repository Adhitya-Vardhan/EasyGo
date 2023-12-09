const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Event = require("../models/Event");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the items using /api/Event/fetchevent
router.get("/fetchevent", async (req, res) => {
  try {
    
    const event=await Event.find({}).sort({date:-1});
    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});
router.get("/dashevent", fetchuser,async (req, res) => {
  try {
   
    const event=await Event.find({user: req.user.id}).sort({date:-1});
    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});


// Route 2: to add a new Event /api/Event/addItem
router.post(
  "/addevent",
  fetchuser,
  [
    body("ename").isLength({ min: 3 }),
    body("college").isLength({ min: 3 }),
    body("place"),
    body("date"),
    body("description"),
    body("tag"),
    body("image"),
    body("contact").isLength({ min: 3 }),
  ],

  async (req, res) => {
    try {
      const { ename, college, description, place, eon, tag, image, contact } =
        req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const event = new Event({
        ename,
        description,
        place,
        eon,
        tag,
        college,
        image,
        contact,
        user: req.user.id,
      });
      const saveevent = await event.save();
      res.json(saveevent);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Inernal Server Error");
    }
  }
);

// Route 3: to update a  Event /api/Event/updateevent
router.put("/updateevent/:id", fetchuser, async (req, res) => {
  const { ename, description, place, college,eon, tag, image, contact } =
    req.body;

  try {
    //create a newItem object
    const newevent = {};
    if (ename) {
      newevent.ename = ename;
    }
    if (description) newevent.description = description;
    if (eon) {
      newevent.eon = eon;
    }
    if (place) {
      newevent.place = place;
    }
    if (tag) {
      newevent.tag = tag;
    }
    if (college) {
      newevent.college = college;
    }
    if (image) {
      newevent.image = image;
    }
    if (contact) {
      newevent.contact = contact;
    }

    //find the Event to be updated and update it
    let event = await Event.findById(req.params.id);
    if (!event) {
      res.status(400).send("Not Found");
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: newevent },
      { new: true }
    );
    res.json({ event });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});

// Route 4: to delete a existing nore /api/Event/deleteitem/:id
router.delete("/deleteevent/:id", fetchuser, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      res.status(400).send("Not Found");
    }

    //allow deletion only if user owns this Event
    if (event.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    event = await Event.findByIdAndDelete(req.params.id);
    res.json({ success: "Event has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }

  //find the Event to be updated and update it
});

module.exports = router;
