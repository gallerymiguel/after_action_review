import dotenv from 'dotenv';
dotenv.config(); // import dotenv and configure it
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aar-db'; // get the MongoDB URI from the environment variables
const db = async () => { // create an async function
    try {
        await mongoose.connect(MONGODB_URI); // connect to the database
        console.log('Database connected'); // log success message
        return mongoose.connection; // return the connection
    }
    catch (error) { // catch errors
        console.error('Database connection error:', error); // log error message
        throw new Error('Database connection failed'); // throw an error
    }
};
export default db; // export the function