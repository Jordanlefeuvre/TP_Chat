const app = require('express')();
const http = require('http').Server(app)
const io = require('socket.io')(http)
const users = {}
var indexUser = ''

io.on('connection', socket => {
    
    console.log('user connected : ', socket.id)
    socket.on('loaded', (data) => {
        console.log('data from client :', data)
    })
    socket.on('utilisateur',(data) => { 
        var i = 0
        var end = false
        for(var index in users){
            if(users[index] == (data + "#" + i)){
                while(users[index] == (data + "#" + i)){
                    i++
                }
                users[socket.id] = data + "#" + i
                end = true
            }
        } 
        if(end == false){
            users[socket.id] = data + "#" + i
        }
        io.emit('users', users)
    })
    socket.on('message', (data) => {
        if(data.split(' ')[2] == 'dm:'){
            for(var index in users){
                if(data.split(' ')[3] == users[index]){
                    indexUser = index
                }
            }
            io.to(indexUser).emit('message',data)
        }else{
            //socket.broadcast.emit('message',data)
            socket.broadcast.emit('message',data)
        }
    })



})


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/id/:p1', (req, res) => {
    dmUser = req.params.p1; 
    console.log(dmUser); 
    res.sendFile(__dirname + '/views/dm.html')
})

http.listen(3000, () => {
    console.log('Server is up and running on http://localhost:3000')
})
