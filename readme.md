# sample express backend

## usage

set up a MySQL database, create a table `urls` and add the following columns:

column name | column type
------------|------------
id          | int
full_url    | text
short_code  | text
timestamp   | timestamp (default: CURRENT_TIMESTAMP)

then

```
cp config.sample.json config.json
```

and fill that with your database values. (make sure the user can `INSERT`, `SELECT`, `DELETE`, and `UPDATE`)

then

```
npm install
node server
```
