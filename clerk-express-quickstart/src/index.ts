import 'dotenv/config';
import express from 'express';
import {
  clerkClient,
  clerkMiddleware,
  getAuth,
  requireAuth,
} from '@clerk/express';

const app = express();
const PORT = 3000;

app.use(clerkMiddleware());

// Use requireAuth() to protect this route
app.get('/protected', requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req);

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId);

  res.json({ user });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
