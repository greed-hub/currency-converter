import { useState, useEffect } from 'react';
import {TableCell, TableRow, TableHead, Table, TableContainer, Container, TableBody, Paper, Typography, Select, 
  InputLabel, OutlinedInput, Button, FormControl, Grid, makeStyles, Theme, createStyles} from '@material-ui/core';
import { GoMarkGithub } from "react-icons/go";

const { v4: uuidv4 } = require('uuid');

function App() {

  interface ExchangeQuery {
    datetime: string,
    amount: number,
    from: string,
    to: string,
    rate: string,
    result: string,
    id: string,
  }
  
  const [fromCurrency, setFromCurrency] = useState<string>('')
  const [toCurrency, setToCurrency] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [exchangeHistory, setExchangeHistory] = useState<ExchangeQuery[]>([])

  useEffect(() => {
    const historyArray : Array<ExchangeQuery> = []
    const getHistory = () => {
      Object.values(localStorage).forEach((ex) => {
        historyArray.push(JSON.parse(ex))
      })
      setExchangeHistory(historyArray)
    }
     localStorage !== null && getHistory()
  }, [])

  const exchange = async () => {
    const response = await fetch(`api/${fromCurrency}/${toCurrency}/${amount}`, {
      method: 'GET', headers : {
        'Content-Type' : 'application/json',
        'Accept': 'application/json'
    } })

    const data = await response.json()
    const newExchange : ExchangeQuery = {
      datetime: `${new Date().toDateString()} / ${new Date().toTimeString().slice(0,15)}`,
      amount: amount,
      from: fromCurrency,
      to: toCurrency,
      rate: data.conversion_rate,
      result: data.conversion_result,
      id: uuidv4()
    }
    
    localStorage.setItem(newExchange.id, JSON.stringify(newExchange));
    setExchangeHistory([...exchangeHistory, newExchange]);
  }

  const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 300,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    button: {
      background: 'linear-gradient(45deg, #5AD6F2 30%, #7EB1BD 90%)',
      border: 0,
      borderRadius: 3,
      color: 'white',
      height: 48,
      fontSize: '20px',
      padding: '0 50px',
      marginTop: '15px',
      marginBottom: '45px'
    },    
    table: {
      minWidth: 700,
      maxWidth: '1100px',
      width: '40%'
    }
  }),
);

  const classes = useStyles();

  return (
    <div className="App">

      <Typography variant="h3" style={{color: '#7EB1BD', marginTop: '50px', marginBottom: '20px'}} component="h3">
        CURRENCY CONVERTER
      </Typography>

      <Grid container direction="column" justify="center" alignItems="stretch">

        <Grid style={{margin: '15px'}}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="selectFrom">From</InputLabel>
            <Select id="selectFrom" label="From" value={fromCurrency} onChange={(e: any) => {setFromCurrency(e.target.value as string);}}>
              <option aria-label="None" value=""/>
              <option value={'AUD'}>AUD</option>
              <option value={'CHF'}>CHF</option>
              <option value={'USD'}>USD</option>
              <option value={'PLN'}>PLN</option>
              <option value={'GBP'}>GBP</option>
              <option value={'EUR'}>EUR</option>
              <option value={'JPY'}>JPY</option>
              <option value={'EGP'}>EGP</option>
              <option value={'CNY'}>CNY</option>
              <option value={'ISK'}>ISK</option>
              <option value={'MXN'}>MXN</option>
              <option value={'RUB'}>RUB</option>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid style={{margin: '15px'}}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="selectTo">To</InputLabel>
              <Select  id="selectTo" label="To" value={toCurrency} onChange={(e: any) => {setToCurrency(e.target.value as string);}}>
              <option aria-label="None" value=""/>
              <option value={'AUD'}>AUD</option>
              <option value={'CHF'}>CHF</option>
              <option value={'USD'}>USD</option>
              <option value={'PLN'}>PLN</option>
              <option value={'GBP'}>GBP</option>
              <option value={'EUR'}>EUR</option>
              <option value={'JPY'}>JPY</option>
              <option value={'EGP'}>EGP</option>
              <option value={'CNY'}>CNY</option>
              <option value={'ISK'}>ISK</option>
              <option value={'MXN'}>MXN</option>
              <option value={'RUB'}>RUB</option>
              </Select>
          </FormControl>
        </Grid>

        <Grid style={{margin: '15px'}}>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel htmlFor="amount">Amount</InputLabel>
            <OutlinedInput type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setAmount(parseInt(e.target.value));}} id="amount"  label="Amount"/>
          </FormControl>
        </Grid>
      
        <Grid>
          <Button variant="contained" className={classes.button} onClick={() => exchange()}>
            EXCHANGE
          </Button>
        </Grid>
      </Grid>

      {exchangeHistory.length !== 0 ?  <Container fixed>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Date/Time</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">From</TableCell>
                <TableCell align="center">To</TableCell>
                <TableCell align="center">Rate</TableCell>
                <TableCell align="center">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exchangeHistory.map((ex) => (
                <TableRow key={ex.id}>
                  <TableCell align="center">{ex.datetime.toString()}</TableCell>
                  <TableCell align="center">{ex.amount}</TableCell>
                  <TableCell align="center">{ex.from}</TableCell>
                  <TableCell align="center">{ex.to}</TableCell>
                  <TableCell align="center">{ex.rate}</TableCell>
                  <TableCell align="center">{parseFloat(ex.result).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container> : ''}

      <div style={{width: '100%', justifyContent: 'center', display: 'flex', marginTop: '50px'}}>
          <a href="https://github.com/greed-hub/currency-converter">
            <GoMarkGithub className='gitIcon'/>
          </a>
      </div>

    </div>
  );
}

export default App;