BEGIN;

DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS language CASCADE;
DROP TABLE IF EXISTS skill CASCADE;
DROP TABLE IF EXISTS exercice CASCADE;
DROP TABLE IF EXISTS exercice_skill_unlockable CASCADE;
DROP TABLE IF EXISTS exercice_test CASCADE;
DROP TABLE IF EXISTS exercice_test_score CASCADE;
DROP TABLE IF EXISTS exercice_best_eval CASCADE;

-- from module `connect-pg-simple`.
CREATE TABLE "session" (
	"sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE admin (
	adm_id serial PRIMARY KEY NOT NULL,
	adm_username varchar(24) NOT NULL UNIQUE,
	adm_password_hash char(60) NOT NULL,
	adm_name varchar(50) NOT NULL
);

CREATE TABLE account (
	acc_id serial PRIMARY KEY NOT NULL,
	acc_username varchar(24) NOT NULL UNIQUE,
	acc_password_hash char(60) NOT NULL,
	acc_name varchar(50) NOT NULL
);

CREATE TABLE language (
	lan_id varchar(10) PRIMARY KEY NOT NULL,
	lan_name varchar(30) NOT NULL,
	lan_source_filename varchar(20) NOT NULL,
	lan_cmd_compile varchar(200),
	lan_cmd_exec varchar(200) NOT NULL
);

CREATE TABLE skill (
	ski_id integer PRIMARY KEY NOT NULL,
	ski_name varchar(100) NOT NULL
);

CREATE TABLE exercice (
	exe_id varchar(20) PRIMARY KEY NOT NULL,
	exe_name varchar(100) NOT NULL,
	exe_description varchar(2000),
	exe_language varchar(10) NOT NULL REFERENCES language (lan_id),
	exe_default_code varchar(5000) NOT NULL DEFAULT ''
);

CREATE TABLE exercice_skill_unlockable (
	exe_id varchar(20) NOT NULL REFERENCES exercice (exe_id),
	ski_id integer NOT NULL REFERENCES skill (ski_id),
	PRIMARY KEY(exe_id, ski_id)
);

CREATE TABLE exercice_test (
	exe_id varchar(20) NOT NULL REFERENCES exercice (exe_id),
	tes_id integer NOT NULL,
	tes_exemple boolean NOT NULL DEFAULT false,
	tes_input varchar(10000) NOT NULL DEFAULT '',
	tes_output varchar(1000) NOT NULL DEFAULT '',
	tes_description varchar(200),
	PRIMARY KEY(exe_id, tes_id)
);

CREATE TABLE exercice_test_score (
	acc_id integer NOT NULL REFERENCES account (acc_id),
	exe_id varchar(20) NOT NULL,
	tes_id integer NOT NULL,
	sco_passed boolean NOT NULL,
	PRIMARY KEY(acc_id, exe_id, tes_id),
	FOREIGN KEY(exe_id, tes_id) REFERENCES exercice_test (exe_id, tes_id)
);

CREATE TABLE exercice_best_eval (
	acc_id integer NOT NULL REFERENCES account (acc_id),
	exe_id varchar(20) NOT NULL REFERENCES exercice (exe_id),
	sco_code varchar(5000) NOT NULL,
	PRIMARY KEY(acc_id, exe_id)
);

CREATE OR REPLACE VIEW exercice_description AS
SELECT *, (SELECT COUNT(*) FROM exercice_test WHERE exe_id = E.exe_id) AS exe_nb_tests FROM exercice E;

CREATE OR REPLACE VIEW skill_description AS
SELECT *, (SELECT COUNT(*) FROM exercice_skill_unlockable WHERE ski_id = S.ski_id) AS ski_level_max FROM skill S;

CREATE OR REPLACE VIEW exercice_score AS
SELECT
	A.acc_id,
	E.exe_id,
	(SELECT COUNT(*) FROM exercice_test_score WHERE acc_id=A.acc_id AND exe_id=E.exe_id AND sco_passed) AS exe_test_passed
FROM account A
NATURAL JOIN exercice E;

CREATE OR REPLACE VIEW skill_score AS
SELECT
	A.acc_id,
	S.ski_id,
	(SELECT COUNT(*) FROM exercice_score ES, exercice_skill_unlockable SU, exercice_description E WHERE SU.exe_id=ES.exe_id AND ES.exe_id=E.exe_id AND ES.acc_id=A.acc_id AND SU.ski_id=S.ski_id AND ES.exe_test_passed=E.exe_nb_tests) AS ski_level
FROM account A
NATURAL JOIN skill S;

COMMIT;