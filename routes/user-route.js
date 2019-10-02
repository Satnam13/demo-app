const router = require('express').Router();
const auth = require('../auth/user-auth');
const {UserModel, validateUserRegisteration, validateUserLogin} = require('../models/user-model');
const _ = require('lodash');

router.get('/account', async(req, res) => {
    const info = req.header('info');
    let userInfo = null;
    if(info.indexOf('@') == -1) {
        // username search
        userInfo = await UserModel.findOne({username: info})
    }
    else {
        // email search
        userInfo = await UserModel.findOne({email: info})
    }
    if(userInfo) {
        return res.json({alreadyUsed: true});
    }
    
    return res.send(null);
})

router.post('/register', async(req, res) => {
    const { error } = validateUserRegisteration(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const userExists = await UserModel.findOne({username: req.body.username});
    if(userExists) return res.status(400).send('A user already exists with this name');

    const emailExists = await UserModel.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Duplicate email');

    let user = new UserModel(req.body)
    await user.save();
    res.status(200).json({success: true});    
})

router.post('/login', async(req, res) => {
    const { error } = validateUserLogin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const userExists = await UserModel.findOne({username: req.body.username});
    if(!userExists) return res.status(400).send('invalid email or password');

    if(userExists.password !== req.body.password)
    return res.status(400).send('invalid email or password');

    const token = userExists.generateToken();
    res.json({token: token}); 
})

router.get('/info', auth, async(req, res) => {
    const user = await UserModel.findOne({_id: req.user});
    let responseUser = _.pick(user, ['username', 'dob', 'email', 'country', 'friends', 'requests']);
    res.send(responseUser);
})

router.post('/sendfriendreq', auth, async(req, res) => {
    const requester = req.body.requester;
    const receiver = req.body.receiver;
    const receiverUser = await UserModel.findOne({username: receiver});
    if(!receiverUser) {
        return res.status(400).send('invalid user');
    }
    const index = receiverUser.requests.findIndex(request => request === requester);
    if(index !== -1) {
        return res.send({status: 'ok', sent: false})
    }
    receiverUser.requests.push(requester);
    await receiverUser.save();
    res.send({status: 'ok', sent: true});
})

router.post('/acceptfriendreq', auth, async(req, res) => {
    const requester = req.body.requester;
    const receiver = req.body.receiver;
    const requesterUser = await UserModel.findOne({username: requester});
    if(!requesterUser) {
        return res.status(400).send('invalid user');
    }
    requesterUser.friends.push(receiver);
    const receiverUser = await UserModel.findOne({username: receiver});
    receiverUser.friends.push(requester);
    console.log(receiverUser);
    
    const index = receiverUser.requests.findIndex(request => {
        return request == requester
    })

    console.log(index);
    
    receiverUser.requests.splice(index, 1);
    await requesterUser.save();
    await receiverUser.save();
    res.send({status: 'ok'});
})
module.exports = router;