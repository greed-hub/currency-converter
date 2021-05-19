"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fetch = require("node-fetch");
const app = express_1.default();
app.use(express_1.default.json());
app.get('/api/:first/:second/:amount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //heroku config
    const APIkey = process.env.exchangeRateAPIkey;
    const response = yield fetch(`https://v6.exchangerate-api.com/v6/${APIkey}/pair/${req.params.first}/${req.params.second}/${req.params.amount}`, { method: 'GET', headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        } });
    const data = yield response.json();
    res.send(data);
}));
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
