const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { movieId, name, email, text } = JSON.parse(event.body);

        if (typeof name !== 'string' || typeof email !== 'string' || typeof text !== 'string') {
            console.error('Invalid input:', { name, email, text });
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input: name, email, and text must be strings' })
            };
        }

        const client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);

        const comment = {
            _id: new ObjectId(),
            name,
            email,
            movie_id: new ObjectId(movieId),
            text,
            date: new Date().toISOString()
        };

        await db.collection('comments').insertOne(comment);

        return {
            statusCode: 201,
            body: JSON.stringify({ success: true, comment })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};