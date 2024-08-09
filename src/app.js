import express from 'express';
import 'dotenv/config'

import connectDatabase from './db/mongoose.js';
import userRoute from './routers/user.js';
import taskRoute from './routers/task.js';

const app = express();
connectDatabase()

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

export default app;