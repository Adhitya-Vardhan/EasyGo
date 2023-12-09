const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Travel = require("../models/Travel");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the travel using /api/travel/fetchtravel
router.get("/fetchtravel", async (req, res) => {
  try {
    const travel = await Travel.find({}).sort({date:-1});;
    res.json(travel);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});
router.get("/dashtravel", fetchuser,async (req, res) => {
  try {
   
    const travel=await Travel.find({user: req.user.id}).sort({date:-1});
    res.json(travel);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});
// Route 2: to add a new Travel /api/Travel/addticket
router.post(
  "/addtravel",
  fetchuser,
  [
    body("from").isLength({ min: 3 }),
    body("to").isLength({ min: 3 }),
    body("on"),
    body("vtype"),
    body("vnumber"),
    body("image"),
    body("fare"),
    body("buddies"),
    body("contact").isLength({ min: 3 }),
  ],

  async (req, res) => {
    try {
      const { from, to, on, vtype, vnumber,image, fare, buddies, contact } =
        req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const travel = new Travel({
        from,
        to,
        on,
        vtype,
        vnumber,
        fare,
        image,
        buddies,
        contact,
        user: req.user.id,
      });
      const savetravel = await travel.save();
      res.json(savetravel);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Inernal Server Error");
    }
  }
);

// Route 3: to update a  Travel /api/Travel/updatetravel
router.put("/updatetravel/:id", fetchuser, async (req, res) => {
  const { from, to, on, vtype, vnumber,image, fare, buddies, contact } = req.body;

  try {
    //create a newtravel object
    const newtravel = {};
    if (from) {
      newtravel.from = from;
    }
    if (to) newtravel.to = to;
    if (on) {
      newtravel.on = on;
    }
    if (vtype) {
      newtravel.vtype = vtype;
    }
    if (vnumber) {
      newtravel.vnumber = vnumber;
    }
    if (image) {
      newtravel.image = image;
    }
    if (fare) {
      newtravel.fare = fare;
    }
    if (buddies) {
      newtravel.buddies = buddies;
    }
    if (contact) {
      newtravel.contact = contact;
    }

    //find the Travel to be updated and update it
    let travel = await Travel.findById(req.params.id);
    if (!travel) {
      res.status(400).send("Not Found");
    }

    if (travel.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    travel = await Travel.findByIdAndUpdate(
      req.params.id,
      { $set: newtravel },
      { new: true }
    );
    res.json({ travel });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});

// Route 4: to delete a existing travel /api/Travel/deletetravel/:id
router.delete("/deletetravel/:id", fetchuser, async (req, res) => {
  try {
    let travel = await Travel.findById(req.params.id);
    if (!travel) {
      res.status(400).send("Not Found");
    }

    //allow deletion only if user owns this Travel
    if (travel.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    travel = await Travel.findByIdAndDelete(req.params.id);
    res.json({ success: "Travel has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }

  //find the Travel to be updated and update it
});

module.exports = router;
