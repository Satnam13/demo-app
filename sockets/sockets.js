const socket = require('socket.io');
const { UserModel } = require('../models/user-model');
const { ChatModel } = require('../models/chat-model');
const _ = require('lodash')
module.exports.initialize = (app) => {
    const io = socket(app);
   // console.log(io);
    io.on('connection', (socket) => {

        io.to(socket.id).emit('connected', {status: 'connected', socketId: socket.id});
        // initialize the user
        var user = null;
        let friends = []
        socket.on('userInitialization', async(data) => {
            console.log('user init data',data);
            if(data.socketId == socket.id) {
            user = await UserModel.findOne({email: data.email})
            if(user) {
                user.socketId = data.socketId;
                user.isOnline = true;
                await user.save();
            }
            
            friends = await UserModel
                .find({friends: data.username, isOnline: true})
                .select({socketId: 1, _id: 0, username: 1, email: 1})

            console.log(data.username, friends);
            io.to(socket.id).emit('friend-status', friends)
            friends.forEach(friend => {
                
                io.to(friend.socketId).emit('friend-status', data, {renew: true});
            })
            
            }
        })



        // message transfer
        socket.on('outgoing-message', async(data, senderId) => {
            const msg = await new ChatModel({
                from: data.from,
                to: data.to,
                message: data.message
            }).save();
            const msgData = _.pick(msg, ['from', 'to', 'message', 'stamp'])
            io.to(senderId).emit('incoming-message', msgData);
            if(data.socketId) {
                io.to(data.socketId).emit('incoming-message', msgData);
            }
        })

        // user disconnection
        socket.on('disconnect', () => {
            console.log('dis', socket.id);
            friends.forEach(friend => {
                
                io.to(friend.socketId).emit('friend-status', {username: user.username}, {renew: false});
            })
            if(user) {
            user.socketId = 'none',
            user.isOnline = false;
            user.save();
            }
        })
    
})    
}



