INSERT INTO users (name,is_faculty)
VALUES ('James', true),('Blobs',false),('Michael Jackson', false),('Donald Trump', true);

INSERT INTO resources (
  title,
  description,
  url,
  origin,
  author_id,
  votes,
  content_type,
  recommended_week,
  evaluation,
  justification
)
VALUES ('book','this is a book','https.google.com','nobeen',1,0,'book','week1','I recommend this resource after having used it','This book changed my life. I can now make cookies');

INSERT INTO comments(body,author_id,resource_id)
VALUES ('Siiiiiick',1,1),('Whats in the baaaaax',1,1);

INSERT INTO study_list (author_id,resource_id)
VALUES (1,1),(2,1)(3,1)(4,1);

INSERT INTO tags (name, resource_id)
VALUES ('react',1),('JS',1),('creative coding', 1),('git',1),('SQL',1),('express',1);





