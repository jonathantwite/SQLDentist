---
title: Namespacing databases
createdOn: 2021-01-29
---

It is perfectly possible to "namespace" your databases, however in doing so, you must use bracket syntax when referencing the database.  Is it worth the effort just to organise your SSMS Object Explorer window?

```sql
CREATE DATABASE [Test.TestDb];
GO

USE [Test.TestDb];

CREATE TABLE dbo.TestTable (
    Id INT IDENTITY(1,1) PRIMARY KEY, 
    Description VARCHAR(50) NOT NULL INDEX IX_TestTable_Description NONCLUSTERED
);

GO

USE master;

SELECT * 
FROM [Test.TestDb].dbo.TestTable AS TT;
```
