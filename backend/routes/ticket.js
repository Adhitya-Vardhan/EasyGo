const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the tickets using /api/ticket/fetchticket
router.get("/fetchticket", async (req, res) => {
  try {
    const ticket = await Ticket.find({}).sort({date:-1});
    res.json(ticket);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});
router.get("/dashticket", fetchuser,async (req, res) => {
  try {
   
    const ticket=await Ticket.find({user: req.user.id}).sort({date:-1});
    res.json(ticket);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});

// Route 2: to add a new ticket /api/ticket/addticket
router.post(
  "/addticket",
  fetchuser,
  [
    body("from").isLength({ min: 3 }),
    body("to").isLength({ min: 3 }),
    body("on"),
    body("time"),
    body("count"),
    body("contact").isLength({ min: 3 }),
  ],

  async (req, res) => {
    try {
      const { from, to, on,time, count, contact } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const ticket = new Ticket({
        from,
        to,
        on,
        time,
        count,
        contact,
        user: req.user.id,
      });
      const saveticket = await ticket.save();
      res.json(saveticket);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Inernal Server Error");
    }
  }
);

// Route 3: to update a  ticket /api/ticket/updateticket
router.put("/updateticket/:id", fetchuser, async (req, res) => {
  const { from, to, on,time, count, contact } = req.body;

  try {
    //create a newticket object
    const newticket = {};
    if (from) {
      newticket.from = from;
    }
    if (to) newticket.to = to;
    if (on) {
      newticket.on = on;
    }
    if (time) {
      newticket.time = time;
    }
    if (count) {
      newticket.count = count;
    }
    if (contact) {
      newticket.contact = contact;
    }

    //find the ticket to be updated and update it
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(400).send("Not Found");
    }

    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: newticket },
      { new: true }
    );
    res.json({ ticket });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});

// Route 4: to delete a existing nore /api/ticket/deleteticket/:id
router.delete("/deleteticket/:id", fetchuser, async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(400).send("Not Found");
    }

    //allow deletion only if user owns this ticket
    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    ticket = await Ticket.findByIdAndDelete(req.params.id);
    res.json({ success: "ticket has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }

  //find the ticket to be updated and update it
});

module.exports = router;
