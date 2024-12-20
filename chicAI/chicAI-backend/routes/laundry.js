import express from "express";
import db from "../db/connection.js"; // Your database connection
import { ObjectId } from "mongodb";

const router = express.Router();

// Route to fetch wardrobe items with laundryStatus as true
router.get("/", async (req, res) => {
  try {
    const laundryItems = await db
      .collection("wardrobe")
      .find({ laundryStatus: true })
      .toArray();

    res.status(200).json(laundryItems);
  } catch (error) {
    console.error("Error fetching laundry items:", error);
    res.status(500).json({ message: "Failed to fetch laundry items." });
  }
});

// Route to update laundryStatus to false
router.put("/:id/toggle-laundry", async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the current laundryStatus of the item
      const wardrobeItem = await db
        .collection("wardrobe")
        .findOne({ _id: new ObjectId(id) });
  
      if (!wardrobeItem) {
        return res.status(404).json({ message: "Item not found." });
      }
  
      // Toggle the laundryStatus (true -> false, false -> true)
      const newLaundryStatus = !wardrobeItem.laundryStatus;
  
      // Update the laundryStatus in the database
      const result = await db.collection("wardrobe").updateOne(
        { _id: new ObjectId(id) },
        { $set: { laundryStatus: newLaundryStatus } }
      );
  
      if (result.modifiedCount === 1) {
        res.status(200).json({
          message: `Laundry status updated to ${newLaundryStatus}.`,
          laundryStatus: newLaundryStatus,
        });
      } else {
        res.status(500).json({ message: "No changes were made to the item." });
      }
    } catch (error) {
      console.error("Error toggling laundry status:", error);
      res.status(500).json({ message: "Failed to update laundry status." });
    }
  });
  

export default router;
