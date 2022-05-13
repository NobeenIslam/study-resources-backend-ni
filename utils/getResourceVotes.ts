import { Client } from "pg"

export async function getResourceVotes(client: Client, resourceIdAsString: string) {
    const resource_id = parseInt(resourceIdAsString)
    const votesTrueRes = await client.query(`
    SELECT *
    FROM votes
    WHERE resource_id = $1 AND is_upvote = true;`, [resource_id])

    const votesFalseRes = await client.query(`
    SELECT *
    FROM votes
    WHERE resource_id = $1 AND is_upvote = false;`, [resource_id])


    const totalVote = votesTrueRes.rowCount - votesFalseRes.rowCount
    return { upVotes: votesTrueRes.rowCount, downVotes: votesFalseRes.rowCount, totalVotes: totalVote }

}