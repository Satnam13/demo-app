const router = require('express').Router();
const auth = require('../auth/user-auth');
const { UserModel } = require('../models/user-model');
const _ = require('lodash');

router.get('/:username', auth, async(req, res) => {
    console.log('searching');
    
    const searchUser = req.params.username.toLowerCase();
    console.log(searchUser);
    results = await UserModel.find({username: {$regex: searchUser, $options: 'i'}});
    let removeIndex = null;
    let user = await UserModel.findOne({_id: req.user._id}).select({username: 1});
    results.forEach((result, index, array) => {  
        if(result.username == user.username) {
            removeIndex = index;
        }
       result = _.pick(result, ['username', 'email'])
       array[index] = result;
       
    });
    if(removeIndex !== null) {
        results.splice(removeIndex, 1);
    }
    res.send(results);
})


module.exports = router;