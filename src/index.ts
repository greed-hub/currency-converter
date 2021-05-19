import express, {Application, Request, Response} from 'express';
import path from 'path';
const fetch = require("node-fetch");

const app: Application = express();
app.use(express.json());


app.get('/api/:first/:second/:amount', async (req: Request, res: Response) => {
    //heroku config
    const APIkey = process.env.exchangeRateAPIkey;

    const response = await fetch(`https://v6.exchangerate-api.com/v6/${APIkey}/pair/${req.params.first}/${req.params.second}/${req.params.amount}`, 
    { method : 'GET' , headers : {
        'Content-Type' : 'application/json',
        'Accept': 'application/json'
    }})
    
    const data = await response.json()
    res.send(data)

})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));