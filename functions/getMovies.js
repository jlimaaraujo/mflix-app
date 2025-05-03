const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
    const client = new MongoClient(process.env.MONGODB_URI);

    const { page = 1, limit = 10 } = event.queryStringParameters; // Default to page 1, 10 movies per page
    const skip = (page - 1) * limit;

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
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        const totalMovies = await collection.countDocuments();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                movies,
                totalMovies,
                totalPages: Math.ceil(totalMovies / limit),
                currentPage: parseInt(page)
            })
        };
    } catch (error) {
        console.error('Database Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: "Failed to fetch movies" })
        };
    } finally {
        await client.close();
    }
};