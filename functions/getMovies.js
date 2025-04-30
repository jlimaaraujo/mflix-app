const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();        
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection(process.env.MONGODB_COLLECTION_NAME);

        const movies = await collection.find({})
            .project({
                title: 1,
                plot: 1,
                poster: 1,
                year: 1,
                _id: 1
            })
            .limit(100)
            .toArray();

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(movies)
        };
    } catch (error) {
        console.error('Database Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: "Failed to fetch movies",
                details: process.env.NETLIFY_DEV ? error.message : "Internal server error"
            })
        };
    } finally {
        try {
            await client.close();
        } catch (closeError) {
            console.error('Connection close error:', closeError);
        }
    }
};