const router = require('express').Router();
const auth = require('../auth/user-auth')
const { UserModel } = require('../models/user-model');
const { ChatModel } = require('../models/chat-model');

router.get('/:user/:friend', auth, async (req, res) => {
    let token = req.user;
    let user = await UserModel.findOne({_id: token});
    let reqUser = req.params.user;
    let reqFriend = req.params.friend;
    if(user.username){
    if (reqUser == user.username || reqFriend == user.username) {
        let query = req.query.page ? req.query.page : 20;
        query = query * 1; 
        let chat = await ChatModel.find({$or: [{from: reqUser, to: reqFriend}, {from: reqFriend, to: reqUser}]})
        .select({_id: 0, __v: 0})
        .skip(query)
        .limit(20)
        .sort({stamp: -1})
        return res.send(chat);
    }
}
    return res.status(403).send('You cannot access requested item');
})


module.exports = router;