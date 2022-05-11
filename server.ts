import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

//Get everything from resources table
app.get("/resources", async (req, res) => {
  try {
    const dbres = await client.query('SELECT * FROM resources ORDER BY creation_date DESC');
    res.status(200).json(dbres.rows);
  } catch (error) {
    res.status(500).send({error: error, stack: error.stack})
  }
});

//Get one resource from resources table
app.get<{id: string},{},{}>("/resources/:id", async (req,res) => {
  try {
    const resourceId = parseInt(req.params.id);
    const dbres = await client.query('SELECT * FROM resources WHERE id = $1', [resourceId]);
    const rowCount = dbres.rowCount
    if (rowCount < 1){
      res.status(400).send({error: `No resource in database matching that id (${resourceId})`})
    }else {
      res.status(200).json(dbres.rows)
    } 
  } catch (error) {
    res.status(500).send({error: error, stack: error.stack})
  }
})

//Get list of users
app.get("/users", async (req,res) => {
  try {
    const dbres = await client.query(`SELECT * FROM users`)
    res.status(200).json(dbres.rows);
  } catch (error) {
    res.status(500).send({error: error, stack: error.stack})
  }
})

//Get all comments for a resource
app.get<{id: string},{},{}>("/resources/:id/comments", async(req,res) => {
  try {
    const resourceId = parseInt(req.params.id);
    const isThereResource = await client.query('SELECT * FROM resources WHERE id = $1', [resourceId]);
    if (isThereResource.rowCount < 1){
      res.status(400).send({error: `No resource in database matching that id (${resourceId})`})
    }else{
      const dbres = await client.query(`SELECT * FROM comments WHERE resource_id = $1`, [resourceId])
      if(dbres.rowCount < 1){
        res.status(400).send({error: `No comments for id (${resourceId})`})
      }else {
        res.status(200).json(dbres.rows)
      }
    }
  } catch (error) {
    res.status(500).send({error: error, stack: error.stack})
  }
})

//Get a single user's study list -- PLEASE CHECK GET REQUEST
app.get<{id: string},{},{}>("/:id/studylist", async(req,res) => {
  try {
    const userId = parseInt(req.params.id)
    const isThereUser = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    if(isThereUser.rowCount<1){
      res.status(400).send({error: `No User in database matching that id (${userId})`})
    }else{
      const dbres = await client.query(`SELECT * FROM study_list WHERE author_id = $1`,[userId])
      res.status(200).json(dbres.rows);
    }
  } catch (error) {
    res.status(500).send({error: error, stack: error.stack})
  }
})

//Get all tags
app.get("/tags", async(req,res) => {
  try {
    const dbres = await client.query(`SELECT * FROM tags`)
    res.status(200).json(dbres.rows);
  } catch (error) {
    res.status(500).send({error: error, stack: error.stack})
  }
})

//Get all resources for a single tag
app.get<{id: string},{},{}>("/tags/:id", async(req,res) => {
  try {
    const tagId = parseInt(req.params.id);
    const isThereTag = await client.query('SELECT * FROM tags WHERE id = $1', [tagId]);
    if(isThereTag.rowCount<1){
      res.status(400).send({error: `No tag in database matching that id (${tagId})`})
    }else{
      const dbres = await client.query(`
      SELECT * FROM tag_assignments
      JOIN resources ON tag_assignments.resource_id = resources.id
      JOIN tags ON tag_assignments.tag_id = tags.id
      WHERE tag_assignments.tag_id = $1
    `,[tagId]);
      if(dbres.rowCount<1){
        res.status(400).send({error: `No resources with (${tagId})`})
      }else{
        res.status(200).json(dbres.rows)
      }
    }
  } catch (error) {
    res.status(500).send({error: error, stack: error.stack})
  }
})







//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
