import express from 'express';

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    console.log('GET /');
    res.send('Hello World');
});