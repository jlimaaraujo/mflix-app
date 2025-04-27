const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    console.log("DB Name:", process.env.MONGODB_DB_NAME);
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "MongoDB connection URI not configured" })
        };
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        connectTimeoutMS: 5000, // 5 seconds connection timeout
        socketTimeoutMS: 30000, // 30 seconds socket timeout
        serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true
        }
    });

    try {
        // Connect with timeout
        await client.connect();
        
        // Get database and collection with fallbacks
        const dbName = process.env.MONGODB_DB_NAME || 'sample_mflix';
        const collectionName = process.env.MONGODB_COLLECTION_NAME || 'movies';
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Get movies with projection to limit returned data
        const movies = await collection.find({})
            .project({
                title: 1,
                plot: 1,
                poster: 1,
                year: 1,
                _id: 1
            })
            .limit(20)
            .toArray();

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Enable CORS
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