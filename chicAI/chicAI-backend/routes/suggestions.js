import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import OpenAI from "openai";

const router = express.Router();

// OpenAI API Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/latest/:userId", async (req, res) => {
  const { userId } = req.params;

  try {

    const latestSuggestion = await db.collection("suggestions").findOne({
      userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (!latestSuggestion) {
      return res.status(404).json({ message: "No suggestions found within the last 24 hours." });
    }

    res.status(200).json({ suggestion: latestSuggestion });
  } catch (error) {
    console.error("Error fetching latest suggestion:", error);
    res.status(500).json({ message: "Failed to fetch suggestion." });
  }
});


router.post("/generate", async (req, res) => {
  const { userId } = req.body;

  try {

    // Check if the user has already generated a suggestion in the last 24 hours
    const lastSuggestion = await db.collection("suggestions").findOne({
      userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (lastSuggestion) {
      return res.status(400).json({
        message: "You can only generate one suggestion per 24 hours. Try again later.",
      });
    }

    // Fetch wardrobe items linked to the user
    const wardrobeItems = await db.collection("wardrobe")
      .find({ userId, laundryStatus: false })
      .toArray();

    if (!wardrobeItems || wardrobeItems.length < 3) {
      return res.status(400).json({
        message: "Not enough wardrobe items to generate an outfit suggestion.",
      });
    }

    const itemDescriptions = wardrobeItems.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      type: item.type,
      tags: item.tags,
    }));

    // OpenAI Chat API Call
    const messages = [
      { role: "system", content: "You are a fashion stylist bot that generates wardrobe outfit suggestions linked to a database." },
      {
        role: "user",
        content: `
          Based on the following wardrobe items, generate 3 unique outfit suggestions in the following JSON structure:
          {
            "suggestions": [
              {
                "name": "<Outfit Name>",
                "items": [
                  {
                    "wardrobeItemId": "<_id from wardrobe_suggestions_test>",
                    "name": "<Item Name>",
                    "type": "<Item Type>",
                    "tags": ["<tag1>", "<tag2>", "..."]
                  },
                  ...
                ]
              },
              ...
            ]
          }
          - Ensure the "wardrobeItemId" matches the "_id" of items from the provided wardrobe data.
          - Use only items from the provided wardrobe data for the suggestions.
          - Do not include any explanation or additional text outside the JSON structure.

          The wardrobe items are:
          ${itemDescriptions.map(
          (item) =>
            `{ "_id": "${item._id}", "name": "${item.name}", "type": "${item.type}", "tags": ["${item.tags.join('", "')}"] }`
        ).join(",\n")}
        `,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const rawContent = response.choices[0]?.message?.content?.trim();

    let parsedSuggestions;
    parsedSuggestions = JSON.parse(rawContent);

    // Save suggestions in the MongoDB 'suggestions' collection
    const savedSuggestion = await db.collection("suggestions").insertOne({
      userId,
      suggestions: parsedSuggestions.suggestions,
      createdAt: new Date(),
    });

    const message = "Outfit suggestions generated and saved successfully!"
    res.status(201).json({
      message,
      userId,
      suggestions: parsedSuggestions.suggestions,
      suggestionId: savedSuggestion.insertedId,
    });
  } catch (error) {
    console.error("Error generating outfit suggestions:", error);
    res.status(500).json({ message: "Failed to generate outfit suggestions.", error: error.message });
  }
});



export default router;
