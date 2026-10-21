# Tests run against a real Neon branch, not a mocked database

The test suite talks to a real Postgres database on a dedicated Neon `test` branch. Mocking the database would make tests faster, but mocks can pass when the real query would fail. The point of this project is building confidence that it actually works. Don't replace these tests with mocks.
