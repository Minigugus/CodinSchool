-- from module `connect-pg-simple`.
CREATE TABLE "session" (
	"sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE account (
	id serial PRIMARY KEY,
	username varchar(24) NOT NULL UNIQUE,
	password_hash char(60) NOT NULL,
	name varchar(100) NOT NULL
);