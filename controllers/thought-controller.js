const { User, Thought } = require('../models');

const ThoughtController = {
  
  
    // get all thoughts
    getAllThought(req, res) {
      Thought.find({})
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
          console.log(err);
          res.sendStatus(400);
        });
    },
  
    // get one thought by id
    getThoughtById({ params }, res) {
      Thought.findOne({ _id: params.id })
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thoughts found with that id!' });
          }
          res.json(dbThoughtData);
        })
        .catch(err => {
          console.log(err);
          res.sendStatus(400);
        });
    },
  
    createThought({ body }, res) {
      Thought.create(body)
          .then(({ _id }) => {
              return User.findOneAndUpdate(
                  { _id: body.userId },
                  { $push: { thoughts: _id } },
                  { new: true }
              );
          })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                return res.status(404).json({ message: 'No user found with this id!' });
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
  },
  
    // update Thought by id
    updateThought({ params, body }, res) {
      Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thoughts found with that id!' });
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
  
    // delete thought by ID
    deleteThought({ params }, res) {
      Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thoughts found with that id!' });
          }
          return User.findOneAndUpdate(
            { _id: parmas.userId },
            { $pull: { thoughts: params.Id } },
            { new: true }
          )
        })
        .then(dbUserData => {
          if (!dbUserData) {
           return res.status(404).json({ message: 'No User found with this id!' });
          }
          res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },
  
    
  };

  module.exports = ThoughtController;