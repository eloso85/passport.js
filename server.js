const express = require('express')
const bcrypt = require('bcrypt')

const app  = express();

const users = []

app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res)=>{
    res.render('index.ejs')
});

app.get('/login',(req, res)=>{
    res.render('login.ejs')
});

app.get('/register',(req, res)=>{
    res.render('register.ejs')
});

app.post('/register', async (req, res)=>{
try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
        id: Date.now().toString(),//do not need to add this if you have a data base
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    res.redirect('/login')

} catch (error) {
    res.redirect('/register')
    
}
console.log(users)
})

app.listen(3000, console.log('listening port 3000'));