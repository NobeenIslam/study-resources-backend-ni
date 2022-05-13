import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { doesUserExist } from "./utils/doesUserExist";
import { doesResourceExist } from "./utils/doesResourceExist";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

//Get everything from resources table
app.get("/resources", async (req, res) => {
  try {
    const dbres = await client.query(`    
    SELECT *
    FROM users JOIN resources 
    ON users.user_id = resources.author_id
   	ORDER BY creation_date DESC;`);

    /*
    currentResource = dbres.Rows 
    For each row of current Resource
      append it's votes
      append it's tags on 
    endfor
    */

    res.status(200).json(dbres.rows);
  } catch (error) {
    res.status(500).send({ error: error, stack: error.stack });
  }
});

//Get one resource from resources table
app.get<{ id: string }, {}, {}>("/resources/:id", async (req, res) => {
  try {
    const resourceId = parseInt(req.params.id);
    const dbres = await client.query(
      "SELECT * FROM resources WHERE resource_id = $1",
      [resourceId]
    );
    const rowCount = dbres.rowCount;

    if (rowCount < 1) {
      res.status(404).send({
        error: `No resource in database matching that id (${resourceId})`,
      });
    } else {
      res.status(200).json(dbres.rows);
    }
  } catch (error) {
    res.status(500).send({ error: error, stack: error.stack });
  }
});

//Get list of users
app.get("/users", async (req, res) => {
  try {
    const dbres = await client.query(`SELECT * FROM users`);
    res.status(200).json(dbres.rows);
  } catch (error) {
    res.status(500).send({ error: error, stack: error.stack });
  }
});

//Get all comments for a resource
app.get<{ id: string }, {}, {}>("/resources/:id/comments", async (req, res) => {
  try {
    const resource_id = parseInt(req.params.id);
    const isResource = doesResourceExist(resource_id, client);
    if (!isResource) {
      res.status(404).send({
        error: `No resource in database matching that id (${resource_id})`,
      });
    } else {
      const dbres = await client.query(
        `SELECT * FROM comments WHERE resource_id = $1`,
        [resource_id]
      );
      if (dbres.rowCount < 1) {
        res.status(404).send({ error: `No comments for id (${resource_id})` });
      } else {
        res.status(200).json(dbres.rows);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error, stack: error.stack });
  }
});

//Get a single user's study list -- PLEASE CHECK GET REQUEST
app.get<{ id: string }, {}, {}>("/:id/studylist", async (req, res) => {
  try {
    const user_id = parseInt(req.params.id);
    const userExist = await doesUserExist(user_id, client);
    if (!userExist) {
      res
        .status(404)
        .send({ error: `No User in database matching that id (${user_id})` });
    } else {
      const dbres = await client.query(
        `SELECT * FROM study_list WHERE author_id = $1`,
        [user_id]
      );
      res.status(200).json(dbres.rows);
    }
  } catch (error) {
    res.status(500).send({ error: error, stack: error.stack });
  }
});

//Get all tags
app.get("/tags", async (req, res) => {
  try {
    const dbres = await client.query(`SELECT * FROM tags`);
    res.status(200).json(dbres.rows);
  } catch (error) {
    res.status(500).send({ error: error, stack: error.stack });
  }
});

//Get all resources for a single tag
app.get<{ id: string }, {}, {}>("/tags/:id", async (req, res) => {
  try {
    const tagId = parseInt(req.params.id);
    const isThereTag = await client.query(
      "SELECT * FROM tags WHERE tag_id = $1",
      [tagId]
    );
    if (isThereTag.rowCount < 1) {
      res
        .status(404)
        .send({ error: `No tag in database matching that id (${tagId})` });
    } else {
      const dbres = await client.query(
        `
      SELECT
        tag_assignments.tag_assignment_id,
        tag_assignments.tag_id,
        tags.name as tag_name,
        tag_assignments.resource_id,
        resources.*
      FROM tag_assignments
      JOIN resources ON tag_assignments.resource_id = resources.resource_id
      JOIN tags ON tag_assignments.tag_id = tags.tag_id
      WHERE tag_assignments.tag_id = $1

    `,
        [tagId]
      );
      if (dbres.rowCount < 1) {
        res.status(404).send({ error: `No resources with (${tagId})` });
      } else {
        res.status(200).json(dbres.rows);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error, stack: error.stack });
  }
});

//Get votes for a single resource
app.get<{ id: string }, {}, {}>("/resources/:id/votes", async (req, res) => {
  try {
    const resource_id = parseInt(req.params.id);

    const votesTrueRes = await client.query(
      `
    SELECT *
    FROM votes
    WHERE resource_id = $1 AND is_upvote = true;`,
      [resource_id]
    );

    const votesFalseRes = await client.query(
      `
    SELECT *
    FROM votes
    WHERE resource_id = $1 AND is_upvote = false;`,
      [resource_id]
    );

    const totalVote = votesTrueRes.rowCount - votesFalseRes.rowCount;

    res.status(200).json({
      upVotes: votesTrueRes.rowCount,
      downVotes: votesFalseRes.rowCount,
      totalVotes: totalVote,
    });
  } catch (error) {
    res.status(500).send({ error: error, stack: error.stack });
  }
});

//we need a query to get author name for single resource block
app.get<{ id: string }, {}, {}>("/resources/:id/author", async (req, res) => {
  try {
    const resource_id = parseInt(req.params.id);

    const dbres = await client.query(
      `
    SELECT 
      users.name
    FROM users JOIN resources 
    ON users.user_id = resources.author_id
    WHERE resources.resource_id = $1`,
      [resource_id]
    );

    res.status(200).json(dbres.rows);
  } catch (error) {
    res.status(500).send({ error: error, stack: error.stack });
  }
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

//POST Requests (E+O)

//post for upvote and downvote
//sending user_id, resource_id, is_upvote
// maybe add ability for user to change their vote

app.post<{ id: string }, {}, { user_id: number; is_upvote: boolean }>(
  "/resources/:id/votes",
  async (req, res) => {
    try {
      const resource_id = parseInt(req.params.id);
      const { user_id, is_upvote } = req.body;

      const userExist = await doesUserExist(user_id, client);
      const isResource = await doesResourceExist(resource_id, client);
      //check if user exists
      if (!userExist) {
        res
          .status(404)
          .send({ error: `No User in database matching that id (${user_id})` });
      }
      //check if resource exists
      else if (!isResource) {
        res.status(404).send({
          error: `No resource in database matching that id (${resource_id})`,
        });
      }
      //check if user has already voted for this resource
      else {
        const hasExistingVote = await client.query(
          "SELECT * FROM votes WHERE user_id=$1 AND resource_id=$2",
          [user_id, resource_id]
        );
        //complete post request
        if (hasExistingVote.rowCount < 1) {
          const dbres = await client.query(
            `INSERT INTO votes (user_id,resource_id,is_upvote) VALUES ($1,$2,$3) RETURNING *`,
            [user_id, resource_id, is_upvote]
          );
          if (dbres.rowCount > 0) {
            res.status(200).json(dbres.rows);
          } else {
            res.status(500).send({
              error: `Failed to add vote for resource (${resource_id}) by user (${user_id})`,
            });
          }
        } else {
          res.status(400).send({
            error: `User (${user_id}) has already voted for this resource!`,
          });
        }
      }
    } catch (error) {
      res.status(500).send({ error: error, stack: error.stack });
    }
  }
);

//PUT Requests (E+O)

//DELETE Requests (N+F)
