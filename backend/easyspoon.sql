\echo 'Delete and recreate easyspoon db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE easyspoon;
CREATE DATABASE easyspoon;
\connect easyspoon

\i easyspoon-schema.sql
\i easyspoon-seed.sql

\echo 'Delete and recreate easyspoon_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE easyspoon_test;
CREATE DATABASE easyspoon_test;
\connect easyspoon_test

\i easyspoon-schema.sql
