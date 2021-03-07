---
title: Schema comparison
description: A method to compare the schemas of two databases for differences.
author: Jonathan Twite
createdAt: 2021-03-07
---

Here is a query that will compare the columns in two databases and show those columns that only appear in one, or have different definitions.  Use the final block in the `WHERE` clause to limit the comparison to specific code, or remove the block to compare the whole table.

```sql{}[SchemaCompare.sql//2012]
SELECT 
    OrigC.TABLE_CATALOG,
    OrigC.TABLE_NAME,
    OrigC.COLUMN_NAME,
    OrigC.DATA_TYPE,
    OrigC.CHARACTER_MAXIMUM_LENGTH,
    OrigC.IS_NULLABLE,
    OrigC.COLUMN_DEFAULT,
    NewC.TABLE_CATALOG,
    NewC.TABLE_NAME,
    NewC.COLUMN_NAME,
    NewC.DATA_TYPE,
    NewC.CHARACTER_MAXIMUM_LENGTH,
    NewC.IS_NULLABLE,
    NewC.COLUMN_DEFAULT
FROM 
    database1.INFORMATION_SCHEMA.COLUMNS AS OrigC
    FULL OUTER JOIN database2.INFORMATION_SCHEMA.COLUMNS AS NewC
        ON NewC.TABLE_NAME COLLATE DATABASE_DEFAULT = OrigC.TABLE_NAME COLLATE DATABASE_DEFAULT
            AND NewC.COLUMN_NAME COLLATE DATABASE_DEFAULT = OrigC.COLUMN_NAME COLLATE DATABASE_DEFAULT
WHERE
    (
        OrigC.COLUMN_NAME IS NULL
        OR NewC.COLUMN_NAME IS NULL
        OR OrigC.DATA_TYPE COLLATE DATABASE_DEFAULT <> NewC.DATA_TYPE COLLATE DATABASE_DEFAULT
        OR OrigC.CHARACTER_MAXIMUM_LENGTH <> NewC.CHARACTER_MAXIMUM_LENGTH
        OR OrigC.IS_NULLABLE COLLATE DATABASE_DEFAULT <> NewC.IS_NULLABLE COLLATE DATABASE_DEFAULT
        OR OrigC.COLUMN_DEFAULT COLLATE DATABASE_DEFAULT <> NewC.COLUMN_DEFAULT COLLATE DATABASE_DEFAULT
        -- Add other comparisons here that you want to compare - e.g. collation:
        -- OR OrigC.COLLATION_NAME COLLATE DATABASE_DEFAULT <> NewC.COLLATION_NAME COLLATE DATABASE_DEFAULT
    )

    -- Filter to specific tables here or remove for whole database
    AND (
        OrigC.TABLE_NAME IN ('TableA')
        OR NewC.TABLE_NAME IN ('TableB')
    );
```
