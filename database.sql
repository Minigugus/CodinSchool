BEGIN;

DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS language CASCADE;
DROP TABLE IF EXISTS skill CASCADE;
DROP TABLE IF EXISTS exercice CASCADE;
DROP TABLE IF EXISTS skill_unlockable CASCADE;
DROP TABLE IF EXISTS exercice_test CASCADE;
DROP TABLE IF EXISTS score_test CASCADE;
DROP TABLE IF EXISTS score_exercice CASCADE;

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

CREATE TABLE skill_unlockable (
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

CREATE TABLE score_test (
	acc_id integer NOT NULL REFERENCES account (acc_id),
	exe_id varchar(20) NOT NULL,
	tes_id integer NOT NULL,
	sco_passed boolean NOT NULL,
	PRIMARY KEY(acc_id, exe_id, tes_id),
	FOREIGN KEY(exe_id, tes_id) REFERENCES exercice_test (exe_id, tes_id)
);

CREATE TABLE score_exercice (
	acc_id integer NOT NULL REFERENCES account (acc_id),
	exe_id varchar(20) NOT NULL REFERENCES exercice (exe_id),
	sco_code varchar(5000) NOT NULL,
	PRIMARY KEY(acc_id, exe_id)
);

CREATE VIEW score_account AS
SELECT A.acc_id, E.exe_id, COUNT(*) AS exe_test_passed, (SELECT COUNT(*) FROM score_test WHERE acc_id = A.acc_id AND exe_id = E.exe_id) AS exe_nb_tests FROM exercice E
INNER JOIN score_test ST ON ST.exe_id=E.exe_id
INNER JOIN account A ON A.acc_id=ST.acc_id
WHERE ST.sco_passed=true
GROUP BY A.acc_id, E.exe_id;

CREATE VIEW skill_account AS
SELECT SA.acc_id, S.ski_id, COUNT(*) AS ski_level, (SELECT COUNT(*) FROM skill_unlockable WHERE ski_id = S.ski_id) AS ski_level_max FROM skill S
RIGHT JOIN skill_unlockable SU ON SU.ski_id=S.ski_id
INNER JOIN score_account SA ON SA.exe_id=SU.exe_id
WHERE SA.exe_test_passed=NULL OR SA.exe_test_passed=SA.exe_nb_tests
GROUP BY SA.acc_id, S.ski_id;

COMMIT;