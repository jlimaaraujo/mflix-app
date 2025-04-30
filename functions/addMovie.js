const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const newMovie = JSON.parse(event.body);
        const client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);

        // Insert the new movie
        const result = await db.collection(process.env.MONGODB_COLLECTION_NAME)
            .insertOne({
                ...newMovie,
                _id: new ObjectId(),
                lastupdated: new Date().toISOString()
            });

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                insertedId: result.insertedId
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};