const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
    // Initialize client inside the handler
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true
        }
    });

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection(process.env.MONGODB_COLLECTION_NAME);

        const movies = await collection.find({})
            .limit(20)
            .toArray();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movies)
        };
    } catch (error) {
        console.error('MongoDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    } finally {
        // Ensure client closes even if error occurs
        await client.close().catch(err => console.error('Failed to close connection:', err));
    }
};