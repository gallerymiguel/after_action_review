export const resolvers = {
    Query: {
        getUsers: async () => {
            try {
                return await User.find(); // return all users
            }
            catch (error) {
                throw new Error('Error fetching users'); // throw an error
            }
        },
        getUser: async (_, { id }) => {
            try {
                return await User.findById(id); // return a user by ID
            }
            catch (error) {
                throw new Error('Error fetching user'); // throw an error
            }
        }
    },
    Mutation: {
        registerUser: async (_, args) => {
            try {
                const user = new User(args); // create a new user
                await user.save(); // save the user
                return user; // return the user
            }
            catch (error) {
                throw new Error('Error registering user'); // throw an error
            }
        }
    }
};