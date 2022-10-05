---
title: Building functions in other databases
description: How to create functions in one database from within another.
author: Jonathan Twite
createdAt: 2022-09-20
---

Our development process often involves us restoring anonymised client databases to test new changes on real data.  We have a backlog of databases that we can use, however these are not necessarily up to the latest version of our software and so need updating.

For several months I have been using a script to restore the database, which I keep saved next to the backup file - allowing me just to open the file in SSMS, hit execute and then in five minutes, have a database up and ready to go.  Last week I updated this script to also run our update scripts - when necessary - to update the database to the latest version.  As we store our version in a slightly weird way, plus the fact that version numbers do not sort alphanumerically, I needed to have this builder script (running on the `master` database), create a couple of functions in the new database, call those functions and then delete them.

The question therefore arises, how do you create a function in a different database to the one you are using?  You cannot state the database name at the start of a `CREATE FUNCTION` call.

```sql{}[CompilationError.sql//2012]
CREATE FUNCTION NewDatabase.dbo.fnAdd(@A INT, @B INT)
RETURNS INT
AS
BEGIN
    RETURN @A + @B;
END;
```

```text
Msg 166, Level 15, State 1, Line 1
'CREATE/ALTER FUNCTION' does not allow specifying the database name as a prefix to the object name.
```

So, how to create functions on a different database, also considering that the database names are saved as a variable?  This certainly requires dynamic sql and so the use of `sp_executesql`.

```sql{}[FirstAttempt.sql//2012]
USE master;
DECLARE 
    @DbName NVARCHAR(100) = 'NewDatabase',
    @Sql NVARCHAR(MAX);

SET @Sql = N'
    USE [' + @DbName + '];

    CREATE FUNCTION dbo.fnAdd(@A INT, @B INT)
    RETURNS INT
    AS
    BEGIN
        RETURN @A + @B;
    END;

    SELECT dbo.fnAdd(1,2)';

PRINT @Sql;
EXEC sp_executesql @stmt = @Sql;
```

If you've ever created a function, you will know that this will not work:

```text
Msg 111, Level 15, State 1, Line 4
'CREATE FUNCTION' must be the first statement in a query batch.
```

So, we add `GO` as we would normally do

```sql{8,16}[AddGO.sql//2012]
USE master;
DECLARE 
    @DbName NVARCHAR(100) = 'NewDatabase',
    @Sql NVARCHAR(MAX);

SET @Sql = N'
    USE [' + @DbName + '];
    GO

    CREATE FUNCTION dbo.fnAdd(@A INT, @B INT)
    RETURNS INT
    AS
    BEGIN
        RETURN @A + @B;
    END;
    GO

    SELECT dbo.fnAdd(1,2)';

PRINT @Sql;
EXEC sp_executesql @stmt = @Sql;
```

Alas `GO` is a SSMS command and not a T-SQL command and so cannot be used:

```text
Msg 102, Level 15, State 1, Line 3
Incorrect syntax near 'GO'.
```

One thing we can do instead is break up the statements into separate `sp_executesql` calls

```sql{}[SeparateCalls.sql//2012]
USE master;
DECLARE 
    @DbName NVARCHAR(100) = 'NewDatabase',
    @Sql NVARCHAR(MAX);

SET @Sql = N'
USE [' + @DbName + ']';

PRINT @Sql;
EXEC sp_executesql @stmt = @Sql;

SET @Sql = N'
    CREATE FUNCTION dbo.fnAdd(@A INT, @B INT)
    RETURNS INT
    AS
    BEGIN
        RETURN @A + @B;
    END';

PRINT @Sql;
EXEC sp_executesql @stmt = @Sql;

SET @Sql = N'SELECT dbo.fnAdd(1,2)';

PRINT @Sql;
EXEC sp_executesql @stmt = @Sql;
```

<div class='result-grid'>

| (No column name) |
|---               |
|3|

</div>

This appears to have worked.

However, later on you notice something strange.  When poking around your database, the function you created appears to be missing.  You finally find the function, in the `master` database.  Each call to `sp_executesql` creates a new "scope", based on the scope that called `sp_executesql`.  Each call to `sp_executesql` was being made fromt he `master` database and so even though one call changed the database to `NewDatabase`, the next call reverted back to working on `master`.

We therefore need to have one call of `sp_executesql` that changes the database to `NewDatabase` and then without exiting that scope, create the function - by calling a new `sp_executesql` inside the original one.  Dynamic SQL in Dynamic SQL if you wish.  Note the double quotation marks needed to escape the strings in the internal sql.

```sql{}[CorrectDatabase.sql//2012]
USE master;
DECLARE 
    @DbName NVARCHAR(100) = 'NewDatabase',
    @Sql NVARCHAR(MAX);

SET @Sql = N'
    USE [' + @DbName + ']
    
    DECLARE @Sql NVARCHAR(MAX);

    SET @Sql = N''
        CREATE FUNCTION dbo.fnAdd(@A INT, @B INT)
        RETURNS INT
        AS
        BEGIN
            RETURN @A + @B;
        END'';
    
    PRINT @Sql;
    EXEC sp_executesql @stmt = @Sql;

    SET @Sql = N''SELECT dbo.fnAdd(1,2)'';
    
    PRINT @Sql;
    EXEC sp_executesql @stmt = @Sql;
';

PRINT @Sql;
EXEC sp_executesql @stmt = @Sql;
```

<div class='result-grid'>

| (No column name) |
|---               |
|3|

</div>
