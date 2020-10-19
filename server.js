const express = require('express')
const morgan = require("morgan")

const app = express();
const PORT = 8000

app.use(morgan("dev"))

app.use((req,res)=>{
  res.send("Hello, world!")
})

app.listen(PORT, ()=>{
  console.log(`Server is listening at http://localhost:${PORT}`);
  
})
