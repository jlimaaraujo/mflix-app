const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
    const { query } = event.queryStringParameters;
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);

        const movies = await db.collection(process.env.MONGODB_COLLECTION_NAME)
            .find({
                title: { $regex: query, $options: 'i' } // Case-insensitive search
            })
            .limit(20)
            .toArray();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movies)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    } finally {
        await client.close();
    }
};