DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS study_list;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id SERIAL PRIMARY KEY NOT NULL,
  	name VARCHAR(50) NOT NULL,
  	is_faculty BOOLEAN NOT NULL
);

CREATE TABLE resources (
	id SERIAL PRIMARY KEY NOT NULL,
  	title VARCHAR NOT NULL,
  	description VARCHAR,
  	url VARCHAR,
  	origin VARCHAR,
  	author_id INTEGER,
  	creation_date TIMESTAMP DEFAULT current_timestamp,
  	content_type VARCHAR NOT NULL,
  	recommended_week VARCHAR,
  	evaluation VARCHAR,	
  	justification TEXT,
  	FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE tags(
	id SERIAL PRIMARY KEY NOT NULL,
  	name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE tag_assignments(
	id SERIAL PRIMARY KEY NOT NULL,
	tag_id INTEGER,
	resource_id INTEGER,
	FOREIGN KEY (tag_id) REFERENCES tags(id),
	FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE TABLE comments(
	id SERIAL PRIMARY KEY NOT NULL,
  	body TEXT NOT NULL,
  	author_id INTEGER,
  	resource_id INTEGER,
  	FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE TABLE study_list(
	id SERIAL PRIMARY KEY NOT NULL,
  	author_id INTEGER,
  	resource_id INTEGER,
  	FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE TABLE votes(
	id SERIAL PRIMARY KEY NOT NULL,
	user_id INTEGER,
	resource_id INTEGER,
	is_upvote BOOLEAN NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (resource_id) REFERENCES users(id)
);










