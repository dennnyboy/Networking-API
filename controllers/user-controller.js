//const res = require('express/lib/response');
const { User } = require('../models')

const UserController = {
    // get all Users
    getAllUser(req, res) {
      User.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.sendStatus(400);
        });
    },
  
    // get one User by id
    getUserById({ params }, res) {
      User.findByIdAndUpdate({ _id: params.id })
          .populate({
            path: 'thoughts',
            select: '-__v'
          })
          .populate({
            path: 'friends',
            select: '-__v'
          })
          .select('-__v')
          .then(dbUserData => {
              if (!dbUserData) {
                res.status(404).json({ message: 'No user with this id.' });
                return;
              }
              res.json(dbUserData)
          })
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
  },
        // create User
createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },
    // update User by id
updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },
  // delete User
deleteUser({ params }, res) {
  Thought.deleteMany({ userId: params.id })
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  }
  }

module.exports = UserController;