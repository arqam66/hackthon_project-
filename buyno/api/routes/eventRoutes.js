const express = require("express");
const router = express.Router();
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const eventController = require("../controllers/eventController");

router.post("/create", isSeller, eventController.createEvent);
router.delete("/event/:id", eventController.deleteEvent);
router.get("/seller/:id", eventController.getSellerEvents);
router.get("/all", eventController.getAllEvents);
router.get(
  "/admin/all-events",
  isAuthenticated,
  isAdmin("Admin"),
  eventController.getAllEventsByAdmin
);

module.exports = router;
