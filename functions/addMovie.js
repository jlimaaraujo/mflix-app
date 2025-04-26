const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    if (!process.env.MONGODB_URI) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Database not configured" })
        };
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 30000
    });

    try {
        const newMovie = JSON.parse(event.body);
        if (!newMovie.title) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Title is required" })
            };
        }

        await client.connect();
        const result = await client.db()
            .collection('movies')
            .insertOne({
                ...newMovie,
                _id: new ObjectId(),
                lastupdated: new Date()
            });

        return {
            statusCode: 201,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify({
                success: true,
                insertedId: result.insertedId
            })
        };
    } catch (error) {
        console.error('Add Movie Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to add movie" })
        };
    } finally {
        await client.close().catch(console.error);
    }
};