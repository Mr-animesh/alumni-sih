const Event = require("../models/Event");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Create event
exports.createEvent = async (req, res) => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user.id });
    await event.save();
    // Notify followers of creator
    try {
      const me = await User.findById(req.user.id).select("followers name");
      const followerIds = me?.followers || [];
      if (followerIds.length > 0) {
        const docs = followerIds.map(fid => ({
          recipient: fid,
          message: `${me.name} created a new event: ${event.title}`,
          link: `/events/${event._id}`,
        }));
        await Notification.insertMany(docs);
      }
    } catch {}
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single event by id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (!event.attendees.includes(req.user.id)) {
      event.attendees.push(req.user.id);
      await event.save();
    }

    res.json({ msg: "Registered successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
