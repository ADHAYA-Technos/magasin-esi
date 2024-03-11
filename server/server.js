import express from "express";
const app = express()
const port = 50000
app.set("view engine", "ejs")
app.use(express.static("public"))
 

app.get('/api', (req, res) => {
  res.json({"users": ["user1", "user2"]})
}) 


app.listen(port, () => {
  console.log(`Example app listening on ports ${port}`)
})