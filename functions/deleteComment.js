const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'DELETE') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { commentId } = JSON.parse(event.body);
        const client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);

        await db.collection('comments').deleteOne({ _id: new ObjectId(commentId) });

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