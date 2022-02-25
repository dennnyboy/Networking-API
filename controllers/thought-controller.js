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
            return res.status(404).json({ message: 'No thoughts with this id.' });
          }
          res.json(dbThoughtData);
        })
        .catch(err => {
          console.log(err);
          res.sendStatus(400);
        });
    },
    //create thought
    createThought({ body }, res) {
      Thought.create(body)
          .then(({ _id }) => {
              return Thought.findOneAndUpdate(
                  { _id: body.ThoughtId },
                  { $push: { thoughts: _id } },
                  { new: true }
              );
          })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thoughts with this id.' });
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
            return res.status(404).json({ message: 'No thoughts with this id.' });
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
            return res.status(404).json({ message: 'No thoughts with this id.' });
          }
          return Thought.findOneAndUpdate(
            { _id: parmas.ThoughtId },
            { $pull: { thoughts: params.Id } },
            { new: true }
          )
        })
        .then(dbThoughtData => {
          if (!dbThoughtData) {
           return res.status(404).json({ message: 'No thoughts with this id.' });
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    //adding reaction
    addReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: {reactions: body } },
          { new: true, runValidators: true })
          .populate({path: 'reactions', select: '-__v'})
          .select('-__v')
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  res.status(404).json({ message: 'No thoughts with this id.' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
  },
  //deleting reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { replies: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.json(err));
  }
};
  
    
  

  module.exports = ThoughtController;