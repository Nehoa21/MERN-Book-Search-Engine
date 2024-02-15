const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user._id }).select('-password').populate({
              path: 'savedBooks',
              select: '__v'
            })
            .exec();
        }
        throw AuthenticationError;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const isCorrectPassword = await user.isCorrectPassword(password);
      if (!isCorrectPassword) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookInput }, context) => {
        try {
            const updateUser = await User.findOneAndUpdate(
                { _id: context.user.id },
                { $addToSet: { savedBooks: bookInput } },
                { new: true, runValidators: true }
            );
            return updateUser;
        } catch (err) {
            throw new Error('Error saving book');
        }
    },
    removeBook: async (parent, { bookId }, context) => {
        const updateUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updateUser) {
            throw new Error('Unable to remove book');
        }
        return updateUser;
    },
  },
};

module.exports = resolvers;
