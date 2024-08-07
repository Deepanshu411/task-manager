import express from 'express';

import connectDatabase from './db/mongoose.js';
import userRoute from './routers/user.js';
import taskRoute from './routers/task.js';

const app = express();
connectDatabase()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
});