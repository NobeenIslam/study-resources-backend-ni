INSERT INTO users (name,is_faculty)
VALUES ('James', true);

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
VALUES ('book','this is a book','https.google.com','nobeen',1,0,'book','week1','This is a good resource','I used it and it was crap');

INSERT INTO comments(body,author_id,resource_id)
VALUES ('Siiiiiick',1,1);

INSERT INTO study_list (author_id,resource_id)
VALUES (1,1);

INSERT INTO tags (name, resource_id)
VALUES ('react',1),('JS',1);





