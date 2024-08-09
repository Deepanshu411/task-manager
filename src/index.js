import app from './app.js';
const port = process.env.PORT;

app.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
});