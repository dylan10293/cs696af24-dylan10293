import db from "./db/connection.js";
const resolvers = {
	Query: {
		async restaurant(_, { restaurant_id }) {
			let collection = await db.collection("restaurants");
			let query = { restaurant_id: restaurant_id };
			return await collection.findOne(query);
		},
		async restaurants(_, { borough, cuisine }) {
			let collection = await db.collection("restaurants");
			let query = {};
			if (borough) query.borough = { $regex: `^${borough}$`, $options: "i" };
			if (cuisine) query.cuisine = { $regex: `^${cuisine}$`, $options: "i" };
			return await collection.find(query).toArray();
		},
	},
	Mutation: {
		async createRestaurant(_, { restaurant_id, name, borough, cuisine }, context) {
			let collection = await db.collection("restaurants");
			const insert = await collection.insertOne({
				restaurant_id: restaurant_id, name: name, borough: borough, cuisine: cuisine
			});
			if (insert.acknowledged) return { restaurant_id, name, borough, cuisine };
			return null;
		},
		async deleteRestaurant(_, { restaurant_id }, context) {
			let collection = await db.collection("restaurants");
			const dbDelete = await collection.deleteOne({
				restaurant_id: restaurant_id
			});
			return dbDelete.acknowledged && dbDelete.deletedCount == 1 ? true : false;
		},
	},
};
export default resolvers;