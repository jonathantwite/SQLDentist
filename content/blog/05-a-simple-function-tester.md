---
title: A simple function tester
description: A simple method of quickly testing basic functions
author: Jonathan Twite
createdAt: 2021-08-12
---

Sometimes you need a quick method of testing the output of a function you have written, especially when you have fears about specific edge-cases that you want to check.  For simple functions (the best type) this can be done in a simple one-line query utilising inline tables.

Take for example, this function to determine whether a person is 18 or older on a specific date.  The code has been lifted off of [StackOverflow](https://stackoverflow.com/questions/1572110/how-to-calculate-age-in-years-based-on-date-of-birth-and-getdate#comment96709945_1572938) and so we should test some edge cases to ensure that it works.

```sql{}[fnIs18OrOver.sql//2012]
CREATE FUNCTION dbo.fnIs18OrOver (@DateOfBirth DATE, @Date DATE)
    RETURNS BIT
AS
BEGIN

    IF((0 + FORMAT(@Date,'yyyyMMdd') - FORMAT(CAST(@DateOfBirth AS DATE),'yyyyMMdd') ) /10000) >= 18 RETURN 1;
    RETURN 0;

END;
GO
```

It is possible to define a table inline within a query's `FROM` statement using the `VALUES` keyword ([MS docs](https://docs.microsoft.com/en-us/sql/t-sql/queries/table-value-constructor-transact-sql?view=sql-server-ver15#c-specifying-multiple-values-as-a-derived-table-in-a-from-clause)):

```sql
SELECT *
FROM (VALUES ('Hi', 'Peter'), ('Hello', 'Paul')) AS tbl(Greeting, Name)
```

<div class='result-grid'>

| Greeting | Name |
|---|---|
| Hi | Peter |
| Hello | Paul |

</div>

Using this, we can create a one-statement testing query.  Add the `WHERE` clause back in to filter to only fails.  It is possible to add another column with test description in case you start getting lost as to what the row is testing, but if you are getting that complex, you may want to explore the more complete SQL testing solutions available.

```sql{}[fnIs18OrOverTests.sql//2012]
SELECT
    tbl.TestDoB, 
    tbl.TestDate, 
    tbl.ExpectedIs18OrOver,
    dbo.fnIs18OrOver(tbl.TestDoB, tbl.TestDate) AS ActualIs18OrOver
FROM
    (VALUES 
        /* Test DoB on leap year */
        ('2000-02-29', '2018-02-27', 0),
        ('2000-02-29', '2018-02-28', 0),
        ('2000-02-29', '2018-03-01', 1),
        ('2000-02-29', '2018-03-02', 1),

        /* Test target date on leap year */
        ('2002-02-27', '2020-02-29', 1),
        ('2002-02-28', '2020-02-29', 1),
        ('2002-03-01', '2020-02-29', 0),
        ('2002-03-02', '2020-02-29', 0)
    ) AS tbl(TestDoB, TestDate, ExpectedIs18OrOver);
/*WHERE tbl.ExpectedIs18OrOver <> dbo.fnIs18OrOver(tbl.TestDoB, tbl.TestDate);*/
```

<div class='result-grid'>

|TestDoB|TestDate|ExpectedIs18OrOver|ActualIs18OrOver|
|---|---|---|---|
|2000-02-29|2018-02-27|0|0|
|2000-02-29|2018-02-28|0|0|
|2000-02-29|2018-03-01|1|1|
|2000-02-29|2018-03-02|1|1|
|2002-02-27|2020-02-29|1|1|
|2002-02-28|2020-02-29|1|1|
|2002-03-01|2020-02-29|0|0|
|2002-03-02|2020-02-29|0|0|

</div>
