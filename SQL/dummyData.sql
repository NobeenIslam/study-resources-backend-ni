INSERT INTO users (name,is_faculty)
VALUES ('James', true),('Blobs',false),('Michael Jackson', false),('Donald Trump', true),('Owenster', true);

INSERT INTO comments(body,author_id,resource_id)
VALUES ('Siiiiiick',1,1),('Whats in the baaaaax',1,3);

INSERT INTO study_list (author_id,resource_id)
VALUES (1,1),(2,2),(3,3),(4,4),(5,5);

INSERT INTO tags (name)
VALUES ('react'),('JS'),('creative coding'),('git'),('SQL'),('express'), ('TS');

INSERT INTO tag_assignments (tag_id, resource_id) VALUES
(1,1),
(2,1),
(1,3),
(5,4);

INSERT INTO votes (user_id, resource_id, is_upvote) VALUES
(1, 3, true),
(2, 3, false),
(3, 3, true),
(2, 2, false),
(4, 1, true),
(3, 1, true);






