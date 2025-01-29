import { AuthenticationError, signToken } from '../utils/auth.js';
import User, { UserRole } from '../models/user.js';
import Unit from '../models/unit.js';
import Mission from '../models/mission.js';
export const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }
            return await User.findById(context.user._id).populate('unit');
        },
        users: async (_, __, context) => {
            if (context.user?.role !== UserRole.EVALUATOR) {
                throw new AuthenticationError('Must be an Evaluator to view all users');
            }
            return await User.find().populate('unit');
        },
        user: async (_, { userId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not logged in');
            }
            return await User.findById(userId).populate('unit');
        },
        units: async (_, __, context) => {
            if (!context.user) {
                throw new AuthenticationError('Must be logged in');
            }
            return await Unit.find().populate('missions');
        },
        unit: async (_, { id }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Must be logged in');
            }
            return await Unit.findById(id).populate('missions');
        },
        missions: async (_, __, context) => {
            if (!context.user) {
                throw new AuthenticationError('Must be logged in');
            }
            return await Mission.find().populate('unit');
        },
        mission: async (_, { id }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Must be logged in');
            }
            return await Mission.findById(id).populate('unit');
        },
        missionsByUnit: async (_, { unitId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('Must be logged in');
            }
            return await Mission.find({ unit: unitId }).populate('unit');
        }
    },
    Mutation: {
        register: async (_, { registerInput }) => {
            const userData = {
                ...registerInput,
                unit: registerInput.role === UserRole.MEMBER ? registerInput.unitId : undefined
            };
            const user = await User.create(userData);
            const token = signToken(user.username, user.email, user._id, user.role);
            return { token, user: await user.populate('unit') };
        },
        login: async (_, { loginInput }) => {
            const user = await User.findOne({ email: loginInput.email });
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
            const correctPw = await user.isCorrectPassword(loginInput.password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user.username, user.email, user._id, user.role);
            return { token, user };
        },
        createUnit: async (_, { input }, context) => {
            if (!context.user || context.user.role !== UserRole.EVALUATOR) {
                throw new AuthenticationError('Must be an Evaluator to create units');
            }
            return await Unit.create(input);
        },
        updateUnit: async (_, { id, input }, context) => {
            if (!context.user || context.user.role !== UserRole.EVALUATOR) {
                throw new AuthenticationError('Must be an Evaluator to update units');
            }
            return await Unit.findByIdAndUpdate(id, input, { new: true, runValidators: true });
        },
        deleteUnit: async (_, { id }, context) => {
            if (!context.user || context.user.role !== UserRole.EVALUATOR) {
                throw new AuthenticationError('Must be an Evaluator to delete units');
            }
            const unit = await Unit.findByIdAndDelete(id);
            if (unit) {
                // Delete all missions associated with this unit
                await Mission.deleteMany({ unit: id });
            }
            return unit;
        },
        createMission: async (_, { input }, context) => {
            if (!context.user || context.user.role !== UserRole.EVALUATOR) {
                throw new AuthenticationError('Must be an Evaluator to create missions');
            }
            const mission = await Mission.create({
                ...input,
                unit: input.unitId
            });
            await Unit.findByIdAndUpdate(input.unitId, {
                $push: { missions: mission._id }
            });
            return mission.populate('unit');
        },
        updateMission: async (_, { id, input }, context) => {
            if (!context.user || context.user.role !== UserRole.EVALUATOR) {
                throw new AuthenticationError('Must be an Evaluator to update missions');
            }
            return await Mission.findByIdAndUpdate(id, input, { new: true, runValidators: true }).populate('unit');
        },
        deleteMission: async (_, { id }, context) => {
            if (!context.user || context.user.role !== UserRole.EVALUATOR) {
                throw new AuthenticationError('Must be an Evaluator to delete missions');
            }
            const mission = await Mission.findById(id);
            if (mission) {
                await Unit.findByIdAndUpdate(mission.unit, {
                    $pull: { missions: id }
                });
                return await Mission.findByIdAndDelete(id);
            }
            return null;
        }
    }
};
export default resolvers;
