BEGIN;

-- USER:PASS -> test@gmail.com:dev
INSERT INTO admin VALUES
(42, 'test@gmail.com', '$2b$10$1.U0zUsJx9JitM7AHSJTUuM7KhtxkKDA.IqbX5/bf0cD5vnIPAqPi', 'DUPONT Robert');

-- USER:PASS -> test@gmail.com:dev
INSERT INTO account VALUES
(42, 'test@gmail.com', '$2b$10$1.U0zUsJx9JitM7AHSJTUuM7KhtxkKDA.IqbX5/bf0cD5vnIPAqPi', 'DUPONT Robert');

INSERT INTO language VALUES
('c', 'C', 'SRC.c', 'gcc -o DST SRC.c', './DST'),
('java', 'Java', 'Main.java', 'javac Main.java', 'java Main');

INSERT INTO skill VALUES
(75, 'Utilisation de la classe Scanner'),
(153, 'Manipulation des chaines de caractères'),
(241, 'Utilisation de l''entrée standard'),
(406, 'Utilisation de CodinSchool'),
(666, 'Terminer tous les exercices');

INSERT INTO exercice VALUES
('hello-world', 'Hello World !', 'Le premier programme que tout developpeur doit connaître !', 'c', '#include <stdio.h>\n\nint main(int argc, char const *argv[])\n{\n\tprintf("Votre message\\n");\n\treturn 0;\n}'),
('somme-nombres', 'Somme de Nombres', 'Additionner 2 nombres choisis par l''utilisateur. C''est aussi simple que ça !', 'java', 'import java.io.Scanner;\n\nclass Main {\n\tpublic static void main(String[] args) {\n\t\tScanner sc = new Scanner(System.in);\n\t\tint nb = sc.nextInt();\n\t\tSystem.out.println("Nombre : " + nb);\n\t}\n}');

INSERT INTO exercice_skill_unlockable VALUES
('hello-world', 153),
('hello-world', 406),
('hello-world', 666),
('somme-nombres', 75),
('somme-nombres', 153),
('somme-nombres', 241),
('somme-nombres', 666);

INSERT INTO exercice_test VALUES
('hello-world', 0, true, '', 'Hello World!', 'Très compliqué...'),
('somme-nombres', 0, true, '3\n1\n2\n3', '6', NULL),
('somme-nombres', 1, false, '1\n1', '1', NULL),
('somme-nombres', 2, false, '0', '0', NULL);

INSERT INTO exercice_test_score VALUES
(42, 'hello-world', 0, true),
(42, 'somme-nombres', 0, true),
(42, 'somme-nombres', 1, false),
(42, 'somme-nombres', 2, false);

INSERT INTO exercice_best_eval VALUES
(42, 'hello-world', '#include <stdio.h>\n\nint main(int argc, char const *argv[])\n{\n\tprintf("Hello World!\\n");\n\treturn 0;\n}'),
(42, 'somme-nombres', 'import java.io.Scanner;\n\nclass Main {\n\tpublic static void main(String[] args) {\n\t\tScanner sc = new Scanner(System.in);\n\t\tint nb = sc.nextInt();\n\t\tint somme = sc.nextInt();\n\t\tfor (int i = 0; i <= nb; i++)\n\t\t{\n\t\t\tint n = sc.nextInt();\n\t\t\tsomme = somme + n;\n\t\t}\n\t\tSystem.out.println(somme);\n\t}\n}');

COMMIT;