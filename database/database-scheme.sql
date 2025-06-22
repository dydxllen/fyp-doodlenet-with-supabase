-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admin (
  id integer NOT NULL DEFAULT nextval('admin_id_seq'::regclass),
  username character varying NOT NULL UNIQUE,
  password text NOT NULL,
  CONSTRAINT admin_pkey PRIMARY KEY (id)
);
CREATE TABLE public.student_answers (
  id integer NOT NULL DEFAULT nextval('student_answers_id_seq'::regclass),
  student_id integer,
  test_type text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  is_correct boolean NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  attempt_id integer,
  CONSTRAINT student_answers_pkey PRIMARY KEY (id),
  CONSTRAINT student_answers_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id),
  CONSTRAINT student_answers_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.test_attempts(attempt_id)
);
CREATE TABLE public.students (
  student_id integer NOT NULL DEFAULT nextval('students_student_id_seq'::regclass),
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 3 AND age <= 6),
  latest_pretest_score integer CHECK (latest_pretest_score IS NULL OR latest_pretest_score >= 0 AND latest_pretest_score <= 10),
  latest_posttest_score integer CHECK (latest_posttest_score IS NULL OR latest_posttest_score >= 0 AND latest_posttest_score <= 10),
  CONSTRAINT students_pkey PRIMARY KEY (student_id)
);
CREATE TABLE public.test_attempts (
  attempt_id integer NOT NULL DEFAULT nextval('test_attempts_attempt_id_seq'::regclass),
  student_id integer NOT NULL,
  test_type text NOT NULL CHECK (test_type = ANY (ARRAY['pre'::text, 'post'::text])),
  score integer CHECK (score IS NULL OR score >= 0 AND score <= 10),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT test_attempts_pkey PRIMARY KEY (attempt_id),
  CONSTRAINT test_attempts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id)
);