---
title: Generating random data
description: Looking at a few methods of generating seeds for use generating a large number of random numbers.
author: Jonathan Twite
createdAt: 2021-01-28
---

A question arose today about generating random data for testing a new site.  The developer needed to generate a large number of test identifying codes in a format defined by the client, and stored in a format defined by existing systems.  These codes are usually eight-digit numbers (although there are occasionally some other variants) stored in the database as a `DECIMAL(18,4)`.  The data is for testing and so does not need to be cryptographically random, nor do we care about any patterns or biases towards certain numbers.
<!--more-->
Generating an eight-digit number is easy enough using `RAND()`, giving us a number between 0 and 1 (exclusive), multiplying it by 100,000,000, and casting it to `INT` to remove the decimal places (for this we don't care about the statistical nuances of truncating random numbers).  A final casting puts the data back to the correct format.

```sql
SELECT CAST(CAST(RAND() * 1e8 AS INT) AS DECIMAL(18, 4));
```

The issue comes with generating multiple random numbers.  If this statement is run as part of a `SELECT ... FROM` statement to generate multiple rows of results, the random number will be the same every row.

The way around this is to ensure that the `RAND()` function receives a different seed each row.  There are several ways of doing this, it is interesting to see which is fastest.

First we create a table of numbers, representing a random table of data you may have in your database using a method from [StackOverflow](https://stackoverflow.com/a/1407488/4456875) to create 1 million rows.

```sql
DROP TABLE IF EXISTS dbo.Numbers;
SELECT TOP (1000000) IDENTITY(INT, 1, 1) AS Number
INTO dbo.Numbers
FROM 
    sys.objects AS O
    CROSS JOIN sys.objects AS O2
    CROSS JOIN sys.objects AS O3;
```

The cross joins are so that there are enough rows in the query result set to select the top 1 million from.

We test various methods by creating 1 million codes and inserting them into a table variable.  We can time this without worrying about the length of time it takes SSMS to render 1 million result rows - which takes a few seconds.  We can then select a few from the top of the results to ensure that we are getting sensible results.

### Incorrect method

This does not work and is why we need to set the seed each time.

```sql{5-7}[NotRandom.sql]
DECLARE @Result TABLE (Code DECIMAL(18,4))
DECLARE @T0 DATETIME2 = GETDATE();
SET STATISTICS TIME,IO ON;

INSERT INTO @Result (Code)
SELECT CAST(CAST(RAND()*1e8 AS INT) AS DECIMAL(18,4))
FROM dbo.Numbers AS N

SET STATISTICS TIME,IO OFF;
PRINT CONCAT('Total time:', DATEDIFF(MILLISECOND, @T0, GETDATE()), ' ms');

SELECT TOP (100) Code FROM @Result AS R;
```

<div class='result-grid'>

```text
SQL Server parse and compile time: 
   CPU time = 0 ms, elapsed time = 0 ms.
Table 'Numbers'. Scan count 1, logical reads 1608, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.

(1000000 rows affected)

(1 row affected)

 SQL Server Execution Times:
   CPU time = 234 ms,  elapsed time = 234 ms.
Total time:233 ms
```

|Code|
|---|
|78288301.0000|
|78288301.0000|
|78288301.0000|
|78288301.0000|
|78288301.0000|
|78288301.0000|

</div>

### The `GO X` method

SQL Server Management Studio (SSMS) has the functionality built into it's batching mechanism to repeat a command multiple times.  The `GO` batch separator can be used with a proceeding number to repeat the batch that number of times.  One issue for this is that variable cannot be carried over between batches, and so temporary tables need to be used instead.  This is not a particularly fair test then, but is much slower - as the following attempt to make 1000 rows shows:

```sql
DROP TABLE IF EXISTS #Timing;
CREATE TABLE #Result (Code DECIMAL(18,4));
CREATE TABLE #Timing (StartTime DATETIME2);
INSERT INTO #Timing (StartTime) VALUES (GETDATE());
SET STATISTICS TIME,IO ON;

GO

INSERT INTO #Result (Code)
SELECT CAST(CAST(RAND()*1e8 AS INT) AS DECIMAL(18,4))

GO 1000

SET STATISTICS TIME,IO OFF;
DECLARE @StartTime DATETIME2 = (SELECT TOP (1) StartTime FROM #Timing AS T);
PRINT CONCAT('Total time:', DATEDIFF(MILLISECOND, @StartTime, GETDATE()), ' ms');

SELECT TOP (100) Code FROM #Result AS R;
```

<div class='result-grid'>

```text
...
SQL Server parse and compile time: 
   CPU time = 0 ms, elapsed time = 0 ms.
Table '#Result_____________________________________________________________________________________________________________0000000014EE'. Scan count 0, logical reads 1, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.

(1 row affected)

(1 row affected)

 SQL Server Execution Times:
   CPU time = 0 ms,  elapsed time = 0 ms.
Batch execution completed 1000 times.
SQL Server parse and compile time: 
   CPU time = 0 ms, elapsed time = 1 ms.

(1 row affected)
Total time:545566 ms
```

</div>

That is 9m 05s.  With all logging and *Include Actual Execution Plan* turned off, 1000 batches ran instantaneously, 100000 batches took 18s and 1 million batches 1m 57s as measured by SSMS.

```sql
DECLARE @Result DECIMAL(18,4)
SELECT @Result = CAST(CAST(RAND()*1e8 AS INT) AS DECIMAL(18,4))

GO 1000000
```

### `ROW_NUMBER()` on a large table

Using a large table, you can use the `ROW_NUMBER()` function to generate a unique seed for the each `RAND()` call.  This is useful if you do not have any tables with guaranteed unique integers, or not a big enough table.  In this case, you can `CROSS JOIN` the largest table (possibly `sys.objects`) with itself multiple times to create a table with many rows.

```sql
DECLARE @Result TABLE (Code DECIMAL(18,4))
DECLARE @T0 DATETIME2 = GETDATE();
SET STATISTICS TIME,IO ON;

INSERT INTO @Result (Code)
SELECT TOP (1000000) CAST(CAST(RAND(ROW_NUMBER() OVER (ORDER BY O.object_id))*1e8 AS INT) AS DECIMAL(18,4))
FROM 
    sys.objects AS O
    CROSS JOIN sys.objects AS O2
    CROSS JOIN sys.objects AS O3;

SET STATISTICS TIME,IO OFF;
PRINT CONCAT('Total time:', DATEDIFF(MILLISECOND, @T0, GETDATE()), ' ms');

SELECT TOP (100) Code FROM @Result AS R;
```

<div class='result-grid'>

```text
SQL Server parse and compile time: 
   CPU time = 7 ms, elapsed time = 7 ms.
Table 'sysschobjs'. Scan count 3, logical reads 115, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.

(1000000 rows affected)

(1 row affected)

 SQL Server Execution Times:
   CPU time = 468 ms,  elapsed time = 477 ms.
Total time:483 ms
```

|Code|
|---|
|18209943.0000|
|18211806.0000|
|18213670.0000|
|18215533.0000|
|18217396.0000|
|18219260.0000|

</div>

### Using a large table of integers

If you happen to have a large table with unique numbers (e.g. IDs), you could use these as seeds.  Using the `Numbers` table created above:

```sql
DECLARE @Result TABLE (Code DECIMAL(18,4))
DECLARE @T0 DATETIME2 = GETDATE();
SET STATISTICS TIME,IO ON;

INSERT INTO @Result (Code)
SELECT TOP (1000000) CAST(CAST(RAND(N.Number)*1e8 AS INT) AS DECIMAL(18,4))
FROM dbo.Numbers AS N

SET STATISTICS TIME,IO OFF;
PRINT CONCAT('Total time:', DATEDIFF(MILLISECOND, @T0, GETDATE()), ' ms');

SELECT TOP (100) Code FROM @Result AS R;
```

<div class='result-grid'>

```text
SQL Server parse and compile time: 
   CPU time = 0 ms, elapsed time = 0 ms.
Table 'Numbers'. Scan count 1, logical reads 1608, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.

(1000000 rows affected)

(1 row affected)

 SQL Server Execution Times:
   CPU time = 407 ms,  elapsed time = 432 ms.
Total time:433 ms
```

|Code|
|---|
|103305.0000|
|105168.0000|
|107032.0000|
|108895.0000|
|110758.0000|
|112622.0000|

</div>

Adding a clustered index to the table doesn't effect the speed:

```sql
CREATE CLUSTERED INDEX PK_Numbers ON dbo.Numbers (Number);

DECLARE @Result TABLE (Code DECIMAL(18,4))
DECLARE @T0 DATETIME2 = GETDATE();
SET STATISTICS TIME,IO ON;

INSERT INTO @Result (Code)
SELECT TOP (1000000) CAST(CAST(RAND(N.Number)*1e8 AS INT) AS DECIMAL(18,4))
FROM 
    dbo.Numbers AS N

SET STATISTICS TIME,IO OFF;
PRINT CONCAT('Total time:', DATEDIFF(MILLISECOND, @T0, GETDATE()), ' ms');

SELECT TOP (100) Code FROM @Result AS R;
```

<div class='result-grid'>

```text
SQL Server parse and compile time: 
   CPU time = 0 ms, elapsed time = 0 ms.
Table 'Numbers'. Scan count 1, logical reads 1620, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.

(1000000 rows affected)

(1 row affected)

 SQL Server Execution Times:
   CPU time = 422 ms,  elapsed time = 427 ms.
Total time:430 ms
```

</div>

Nor does a non-clustered index.  However, if you are using a non-indexed column on a larger table (perhaps an employee table where the primary key employee id is alpha-numeric but there is a unique integer web-login id column), then a non-clustered index might be a good idea on that column.

```sql
DROP TABLE IF EXISTS dbo.SomeData;
SELECT TOP (1000000) 
    CONCAT('A', ROW_NUMBER() OVER (ORDER BY O.object_id)) AS Id, 
    ROW_NUMBER() OVER (ORDER BY O.object_id) AS Number,
    'Data' AS Data1, 'Data' AS Data2, 'Data' AS Data3, 'Data' AS Data4, 'Data' AS Data5, 'Data' AS Data6
INTO dbo.RandomData
FROM 
    sys.objects AS O
    CROSS JOIN sys.objects AS O2
    CROSS JOIN sys.objects AS O3;
ALTER TABLE dbo.SomeData ADD CONSTRAINT PK_SomeData PRIMARY KEY CLUSTERED (Id);

DECLARE @Result TABLE (Code DECIMAL(18,4))
DECLARE @T0 DATETIME2 = GETDATE();
SET STATISTICS TIME,IO ON;

INSERT INTO @Result (Code)
SELECT TOP (1000000) CAST(CAST(RAND(SD.Number)*1e8 AS INT) AS DECIMAL(18,4))
FROM 
    dbo.SomeData AS SD

SET STATISTICS TIME,IO OFF;
PRINT CONCAT('Total time:', DATEDIFF(MILLISECOND, @T0, GETDATE()), ' ms');
```

<div class='result-grid'>

```text
SQL Server parse and compile time: 
   CPU time = 0 ms, elapsed time = 0 ms.
Table 'SomeData'. Scan count 1, logical reads 7965, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.

(1000000 rows affected)

(1 row affected)

 SQL Server Execution Times:
   CPU time = 547 ms,  elapsed time = 542 ms.
Total time:543 ms
```

|Code|
|---|
|99846011.0000|
|99847875.0000|
|99849738.0000|
|99851601.0000|
|94206948.0000|
|99853465.0000|

</div>

```sql
CREATE NONCLUSTERED INDEX IX_SomeData_Number ON dbo.SomeData (Number);

DECLARE @Result TABLE (Code DECIMAL(18,4))
DECLARE @T0 DATETIME2 = GETDATE();
SET STATISTICS TIME,IO ON;

INSERT INTO @Result (Code)
SELECT TOP (1000000) CAST(CAST(RAND(SD.Number)*1e8 AS INT) AS DECIMAL(18,4))
FROM 
    dbo.SomeData AS SD

SET STATISTICS TIME,IO OFF;
PRINT CONCAT('Total time:', DATEDIFF(MILLISECOND, @T0, GETDATE()), ' ms');

SELECT TOP (100) Code FROM @Result AS R;
```

<div class='result-grid'>

```text
SQL Server parse and compile time: 
   CPU time = 0 ms, elapsed time = 0 ms.
Table 'SomeData'. Scan count 1, logical reads 3104, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.

(1000000 rows affected)

(1 row affected)

 SQL Server Execution Times:
   CPU time = 516 ms,  elapsed time = 525 ms.
Total time:524 ms
```

|Code|
|---|
|18209943.0000|
|18211806.0000|
|18213670.0000|
|18215533.0000|
|18217396.0000|
|18219260.0000|

</div>

As can be seen, the speed is not necessarily increased, but the *logical reads* comes down which is then more efficient.
