INSERT INTO users (name,is_faculty)
VALUES ('James', true),('Blobs',false),('Michael Jackson', false),('Donald Trump', true),('Owenster', true);

INSERT INTO comments(body,author_id,resource_id)
VALUES ('Siiiiiick',1,1),('Whats in the baaaaax',1,3);

INSERT INTO study_list (author_id,resource_id)
VALUES (1,1),(2,2),(3,3),(4,4),(5,5);

INSERT INTO tags (name, resource_id)
VALUES ('react',1),('JS',2),('creative coding', 3),('git',1),('SQL',1),('express',1);


INSERT INTO votes (user_id, resource_id, is_upvote) VALUES
(1, 3, true),
(2, 3, false),
(3, 3, true),
(2, 2, false),
(4, 1, true),
(3, 1, true);






