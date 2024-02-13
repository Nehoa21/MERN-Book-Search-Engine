const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user._id });
        }
        throw new Error('User not found.');
    },
  },
  Mutation: {
    login: async (parent, args) => {
      const matchup = await Matchup.create(args);
      return matchup;
    },
    addUser: async (parent, args) => {
      const vote = await Matchup.findOneAndUpdate(
        { _id },
        { $inc: { [`tech${techNum}_votes`]: 1 } },
        { new: true }
      );
      return vote;
    },
    SaveBook: async (parent, args, context) => {
        const vote = await Matchup.findOneAndUpdate(
          { _id },
          { $inc: { [`tech${techNum}_votes`]: 1 } },
          { new: true }
        );
        return vote;
      },
  },
};

module.exports = resolvers;
