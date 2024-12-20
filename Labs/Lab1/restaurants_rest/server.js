import express from "express";
import cors from "cors";
import db from "./db/connection.js";
import redisClient from "./db/redis.js";
import messageQueue from "./db/bull.js";
const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());
// app.get('/restaurants/:id', function (req, res) {
// 	const restaurant_id = req.params["id"];
// 	db.collection("restaurants").findOne({
// 		restaurant_id: restaurant_id,
// 	})
// 		.then(value => {
// 			res.send(value)
// 		})
// 		.catch(() => res.status(500).send("Not Found"));
// });
// app.get('/restaurants/:id', async function (req, res) {
// 	const restaurant_id = req.params["id"];
// 	const value = await redisClient.get(restaurant_id);
// 	if (value) {
// 		res.send({ "cached": true, "value": JSON.parse(value) });
// 	} else {
// 		const dbValue = await db.collection("restaurants").findOne({
// 			restaurant_id: restaurant_id,
// 		});
// 		if (dbValue) {
// 			await redisClient.set(restaurant_id, JSON.stringify(dbValue));
// 			res.send({ "cached": false, "value": dbValue });
// 		} else {
// 			res.status(500).send("Not Found");
// 		}
// 	}
// });

app.put('/restaurants/:id', async function (req, res) {
	const restaurant_id = req.params["id"];
	const updates = req.body["updates"];
	messageQueue.add({
		restaurant_id: restaurant_id,
		updates: JSON.stringify(updates)
	});
	res.send("Message Queued");
});

app.post('/restaurants', function (req, res) {
	const restaurant_id = req.body['restaurant_id'];
	const name = req.body['name'];
	const borough = req.body['borough'];
	const cuisine = req.body['cuisine'];
	db.collection("restaurants").insertOne({
		restaurant_id: restaurant_id,
		name: name,
		borough: borough,
		cuisine: cuisine
	}).then(result => result.acknowledged ?
		res.send({ restaurant_id, name, borough, cuisine }) :
		res.status(500).send("Failed")
	).catch(() => res.status(500).send("Failed"));
});

app.get('/restaurants', async (req, res) => {
	const borough = req.query['borough'];
	const cuisine = req.query['cuisine'];
	if (!borough || !cuisine) {
		res.status(422);
		res.send("Insufficient input.");
		return;
	}
	try {
		const restaurants = await db.collection("restaurants").find({
			borough: { $regex: new RegExp(`^${borough}$`, 'i') },
			cuisine: { $regex: new RegExp(`^${cuisine}$`, 'i') }
		}).toArray();

		if (restaurants.length === 0) {
			res.status(404);
			res.send("Error: No restaurants found");
			return;
		}
		res.status(200);
		res.json(restaurants);
		return;
	} catch (error) {
		res.status(500).send("Error: Unable to retrieve restaurants.");
	}
})

app.delete('/restaurants/:id', async (req, res) => {
	const restaurant_id = req.params["id"];

	await redisClient.del(restaurant_id);

	db.collection("restaurants").deleteOne({
		restaurant_id: restaurant_id,
	}).then(result => result.acknowledged && result.deletedCount >= 1 ?
		res.send("Success") :
		res.status(500).send("Failed")
	).catch(() => res.status(500).send("Not Found"));
});
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});