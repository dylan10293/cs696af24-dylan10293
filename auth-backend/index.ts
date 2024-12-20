import 'dotenv/config';
import express from 'express';
import { clerkClient, requireAuth } from '@clerk/express';

const app = express();

app.get(
	'/protected',
	requireAuth({ signInUrl: '/sign-in' }),
	async (req, res) => {
		const { userId } = req.auth;
		const user = await clerkClient.users.getUser(userId);
		return res.json({ user });
	},
);

app.get('/sign-in', (req, res) => {
	// Assuming you have a template engine installed and are using a Clerk JavaScript SDK on this page
	res.render('sign-in');
});

app.listen(3000, () => {
	console.log(`Example app listening at http://localhost:${PORT}`);
});
