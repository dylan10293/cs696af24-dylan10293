import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Route to fetch all wardrobe items
router.get("/wardrobe", async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch all wardrobe items from the wardrobe collection
    const wardrobeItems = await db
      .collection("wardrobe")
      .find({ userId })
      .toArray();

    // Respond with the fetched items
    res.status(200).json(wardrobeItems);
  } catch (error) {
    console.error("Error fetching wardrobe items:", error);
    res.status(500).json({ message: "Failed to fetch wardrobe items." });
  }
});

router.get('/wardrobe/:itemId/tags', async (req, res) => {
  const { itemId } = req.params;

  try {

    // Find the wardrobe item by itemId in the collection
    const item = await db.collection('wardrobe').findOne({ _id: new ObjectId(itemId) });

    if (!item) {
      // If no item is found, return a 404 error
      return res.status(404).json({ message: 'Item not found' });
    }

    // If the item is found, return its tags
    return res.status(200).json({ tags: item.tags || [] });
  } catch (error) {
    console.error('Error fetching tags:', error);
    // If there is an error fetching tags, return a 500 error
    return res.status(500).json({ message: 'Failed to fetch tags' });
  }
});

// Route to add a tag to a specific wardrobe item
router.post('/wardrobe/:itemId/tags', async (req, res) => {
  const { itemId } = req.params; // Get the item ID from the URL parameter
  const { newTags } = req.body; // Get the new tags from the request body

  if (!newTags || newTags.length === 0) {
    return res.status(400).json({ message: 'New tags are required' });
  }

  try {

    // Find the item in the wardrobe collection and add the new tags
    const result = await db.collection('wardrobe').updateOne(
      { _id: new ObjectId(itemId) }, // Match the item by ID
      { $addToSet: { tags: { $each: newTags } } } // Add new tags to the tags array, avoiding duplicates
    );

    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: 'Tag(s) added successfully' });
    } else {
      return res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error adding tag:', error);
    return res.status(500).json({ message: 'Failed to add tag' });
  }
});

// Route to update style, color, and pattern for a specific item
router.patch('/wardrobe/:id', async (req, res) => {
  const { id } = req.params;
  const { style, color, pattern } = req.body;

  try {
    // Find the item by ID
    const item = await db.collection('wardrobe').findOne({ _id: new ObjectId(id) });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update the item's fields if provided
    const updatedItem = await db.collection('wardrobe').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          style: style || item.style,
          color: color || item.color,
          pattern: pattern || item.pattern
        }
      }
    );

    if (updatedItem.modifiedCount > 0) {
      return res.status(200).json({ message: 'Item updated successfully' });
    } else {
      return res.status(400).json({ message: 'No changes made' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    return res.status(500).json({ message: 'Failed to update item' });
  }
});

// Route to save a grouped outfit
router.post("/create", async (req, res) => {
  const { name, items, userId } = req.body; // Expecting name, items (array of wardrobeItemIds), and userId in the request body

  if (!name || !items || items.length === 0 || !userId) {
    return res.status(400).json({ message: "Invalid input. Name, items, and userId are required." });
  }

  try {

    // Fetch wardrobe items to validate the provided wardrobeItemIds
    const wardrobeItems = await db
      .collection("wardrobe")
      .find({ _id: { $in: items.map((id) => new ObjectId(id)) } })
      .toArray();

    if (wardrobeItems.length !== items.length) {
      return res.status(400).json({ message: "Some wardrobe items could not be found." });
    }

    // Create the outfit document
    const newOutfit = {
      name,
      items: wardrobeItems.map((item) => ({
        wardrobeItemId: item._id.toString(),
        name: item.name,
        type: item.type,
        tags: item.tags,
      })),
      userId,
      createdAt: new Date(),
    };

    // Insert the new outfit into the outfits collection
    const result = await db.collection("outfits").insertOne(newOutfit);

    res.status(201).json({ message: "Outfit created successfully!", outfitId: result.insertedId });
  } catch (error) {
    console.error("Error creating outfit:", error);
    res.status(500).json({ message: "Failed to create outfit." });
  }
});

// DELETE: Delete a wardrobe item by ID
router.delete('/wardrobe/:id', async (req, res) => {
  const { id } = req.params;

  try {

    // Convert the id to ObjectId
    const result = await db.collection('wardrobe').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Wardrobe item not found' });
    }

    res.status(200).json({ message: 'Wardrobe item deleted successfully' });
  } catch (error) {
    console.error('Error deleting wardrobe item:', error);
    res.status(500).json({ message: 'Server error while deleting wardrobe item' });
  }
});

// Route to add a tag to a specific wardrobe item
router.post('/wardrobe/:itemId/tags', async (req, res) => {
  const { itemId } = req.params; // Get the item ID from the URL parameter
  const { newTags } = req.body; // Get the new tags from the request body

  if (!newTags || newTags.length === 0) {
    return res.status(400).json({ message: 'New tags are required' });
  }

  try {

    // Find the item in the wardrobe collection and add the new tags
    const result = await db.collection('wardrobe').updateOne(
      { _id: new ObjectId(itemId) }, // Match the item by ID
      { $addToSet: { tags: { $each: newTags } } } // Add new tags to the tags array, avoiding duplicates
    );

    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: 'Tag(s) added successfully' });
    } else {
      return res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error adding tag:', error);
    return res.status(500).json({ message: 'Failed to add tag' });
  }
});

// Route to fetch all outfits
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch all outfits from the outfits collection
    const outfits = await db.collection("outfits").find({
      userId
    }).toArray();

    // Respond with the fetched outfits
    res.status(200).json(outfits);
  } catch (error) {
    console.error("Error fetching outfits:", error);
    res.status(500).json({ message: "Failed to fetch outfits." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Outfit ID is required." });
  }

  try {

    // Delete the outfit with the given ID
    const result = await db.collection("outfits").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Outfit not found." });
    }

    res.status(200).json({ message: "Outfit deleted successfully." });
  } catch (error) {
    console.error("Error deleting outfit:", error);
    res.status(500).json({ message: "Failed to delete outfit." });
  }
});

export default router;
