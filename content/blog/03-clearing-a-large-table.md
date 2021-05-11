---
title: Clearing a large table
description: How we dealt with deleting data out of a large table on a server with very little free space.
author: Jonathan Twite
createdAt: 2021-02-19
---

I had need to clear a large table of data on a server with very little free space.  The table had 53 columns and several million rows of data and was involved in many foreign key constraints.  These constraints meant that we were not able to just `TRUNCATE` the table and removing/disabling them was a prohibitively large task.  Running `DELETE FROM` was causing a *Transaction log for database is full due to 'ACTIVE_TRANSACTION`* error and so we had to build a query to delete data from the table in sections.

To demonstrate, here is a huge table.  As by test database server didn't have many objects, I ran the `INSERT` statement a second time to ensure there was >1M rows.  The `Category` column groups the data into collections of 10000 rows each.

```sql{}[CreateTables.sql//2012]
CREATE TABLE dbo.HugeTable(
    ID INT IDENTITY PRIMARY KEY,
    Category INT NOT NULL,
    SomeData VARCHAR(20) NOT NULL
);

CREATE TABLE dbo.ReferencesHugeTable(
    ID INT IDENTITY PRIMARY KEY,
    HugeTableID INT NOT NULL REFERENCES dbo.HugeTable (ID),
);

GO

INSERT INTO dbo.HugeTable(SomeData, Category)
SELECT TOP (1000000) 'Data', 0
FROM 
    sys.objects AS O
    CROSS JOIN sys.objects AS O2
    CROSS JOIN sys.objects AS O3;

UPDATE dbo.HugeTable
SET dbo.HugeTable.Category = C.Category
FROM 
    dbo.HugeTable AS HT
    INNER JOIN (
        SELECT T.ID, ROW_NUMBER() OVER (ORDER BY ID) / 10000 AS Category
        FROM dbo.HugeTable AS T
    ) AS C ON C.ID = HT.ID;
```

Running `TRUNCATE TABLE dbo.HugeTable` returns

```text
Cannot truncate table 'dbo.HugeTable' because it is being referenced by a FOREIGN KEY constraint.
```

Then, using a cursor, can loop through deleting a category at a time, shrinking the logfile after each deletion.

```sql{}[DeleteFrom.sql//2012]
DECLARE @CurrentCategory INT;
DECLARE CatCursor CURSOR FAST_FORWARD LOCAL
FOR 
    SELECT DISTINCT HT.Category
    FROM dbo.HugeTable AS HT;
OPEN CatCursor;

FETCH NEXT FROM CatCursor INTO @CurrentCategory;
WHILE @@FETCH_STATUS = 0
BEGIN
    DELETE FROM dbo.HugeTable WHERE HugeTable.Category = @CurrentCategory;

    DBCC SHRINKFILE (SELECTDB_Log, EMPTYFILE);

    FETCH NEXT FROM CatCursor INTO @CurrentCategory;
END

CLOSE CatCursor;
DEALLOCATE CatCursor;
```

It's not particularly fast, but it does work.
