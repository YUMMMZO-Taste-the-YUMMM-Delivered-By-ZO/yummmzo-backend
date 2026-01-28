import app from './app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🔥 Yummmzo Backend is running on port ${port}`);
    console.log(`🚀 Redis & BullMQ Worker is listening for jobs...`);
});