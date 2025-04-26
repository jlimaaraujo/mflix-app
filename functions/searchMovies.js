const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
    if (!event.queryStringParameters?.query) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Search query required" })
        };
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        connectTimeoutMS: 5000
    });

    try {
        await client.connect();
        const movies = await client.db()
            .collection('movies')
            .find({
                title: { $regex: event.queryStringParameters.query, $options: 'i' }
            })
            .project({ title: 1, year: 1, poster: 1, _id: 1 })
            .limit(20)
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
        console.error('Search Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Search failed" })
        };
    } finally {
        await client.close();
    }
};