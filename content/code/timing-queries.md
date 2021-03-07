---
title: Timing queries
description: Ways to time queries.
author: Jonathan Twite
createdAt: 2021-03-06
---

## Via SSMS

The SSMS status panel provides an indication of how long a query takes to run.  It measures in minutes and seconds so is accurate for queries that take longer than 10 seconds or so.

It is affected by network lag (if applicable) and SSMS's ability ro render the results as a pretty grid.  Once a query starts return large numbers of results (50,000 on my machine), this rendering time becomes significant.  You can often see this as SQL streams results back to SSMS - the results start appearing long before the query - and the timer - completes.

## To *Messages* panel

This uses SQL Server's inbuilt statistics functionality to show the query timings.

```sql{}[SetStatistics.sql//2012]
SET STATISTICS TIME ON
-- query
SET STATISTICS TIME OFF
```

This shows a breakdown of `CPU time`, `elapsed time` and `compilation time`.  This can be complex for stored procedures with multiple statements and doesn't give a "grand total" but can match up with a query plan.

## As a result

### Using `DATEDIFF()`

This wraps the query within another simple query which measures start and end times.

```sql{}[TimingResult2.sql//2012]
DECLARE @t0 DATETIME2 = GETDATE();
-- query
SELECT DATEDIFF(MILLISECOND, @t0, GETDATE());
```

This can be used for any number of SQL statements of any complexity.

### Using `dm_exec_procedure_stats`

This uses an inbuilt system table which records the last execution time of a stored procedure.

```sql{}[TimingResult2.sql//2012]
DECLARE @DbName NVARCHAR(128);
DECLARE @SchemaName SYSNAME;
DECLARE @ProcName SYSNAME = N'MyProcName';

SELECT CONVERT(TIME(3), DATEADD(ms, ROUND(last_elapsed_time/1000.0, 0), 0)) AS LastExecutionTime
FROM sys.dm_exec_procedure_stats
WHERE 
    OBJECT_NAME(object_id, database_id) = @ProcName
    AND (OBJECT_SCHEMA_NAME(object_id,database_id) = @SchemaName OR @SchemaName IS NULL)
    AND (DB_NAME(database_id) = @DbName OR @DbName IS NULL)
```

This requires the SQL to be a stored procedure.
