-- from module `connect-pg-simple`.
CREATE OR REPLACE TABLE "session" (
	"sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE OR REPLACE TABLE account (
	acc_id serial PRIMARY KEY,
	acc_username varchar(24) NOT NULL UNIQUE,
	acc_password_hash char(60) NOT NULL,
	acc_name varchar(100) NOT NULL
);

CREATE OR REPLACE TABLE language (
	lan_id varchar(10) PRIMARY KEY,
	lan_name varchar(30)
);