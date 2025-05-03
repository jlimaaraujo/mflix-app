const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'PUT') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { commentId, text } = JSON.parse(event.body);
        const client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);

        await db.collection('comments').updateOne(
            { _id: new ObjectId(commentId) },
            { $set: { text, date: new Date().toISOString() } }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};