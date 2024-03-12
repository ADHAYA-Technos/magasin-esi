import express from "express";
import {  getUsers, getUser,createUser,updateUser,deleteUser} from "./database.js";
const app = express()
const port = 5000
app.set("view engine", "ejs")
app.use(express.static("public"))
 

app.get('/api', async (req, res) => {
  try {
    const user = await getUser(3);
     res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
 
}) 


app.listen(port, () => {
  console.log(`Example app listening on ports ${port}`)
})