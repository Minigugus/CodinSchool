-- from module `connect-pg-simple`.
DROP TABLE IF EXISTS "session";
CREATE TABLE "session" (
	"sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account (
	acc_id serial PRIMARY KEY NOT NULL,
	acc_username varchar(24) NOT NULL UNIQUE,
	acc_password_hash char(60) NOT NULL,
	acc_name varchar(100) NOT NULL
);

DROP TABLE IF EXISTS language CASCADE;
CREATE TABLE language (
	lan_id varchar(10) PRIMARY KEY NOT NULL,
	lan_name varchar(30) NOT NULL,
	lan_source_filename varchar(20) NOT NULL,
	lan_cmd_compile varchar(200),
	lan_cmd_exec varchar(200) NOT NULL
);