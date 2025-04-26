const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
    const { id } = event.queryStringParameters;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    if (!id || !ObjectId.isValid(id)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Invalid movie ID format" })
        };
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        const objectId = new ObjectId(id);

        const movie = await db.collection(process.env.MONGODB_COLLECTION_NAME)
            .findOne({ _id: objectId });

        if (!movie) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: "Movie not found" })
            };
        }

        const comments = await db.collection("comments")
            .find({ movie_id: objectId })
            .toArray();

        if (comments.length > 0) {
            comments.forEach(comment => {
                comment.date = new Date(comment.date).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            });
        }

        movie.comments = comments.map(comment => ({
            _id: comment._id,
            text: comment.text,
            date: comment.date
        }));
        

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                ...movie,
                comments
            })
        };
    } catch (error) {
        console.error("Database error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to fetch movie details" })
        };
    } finally {
        await client.close();
    }
};