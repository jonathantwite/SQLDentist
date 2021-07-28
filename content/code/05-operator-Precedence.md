---
title: SQL Server Operator Precedence
description: The order that operators are evaluated in SQL Server
author: Jonathan Twite
createdAt: 2021-07-28
---

Courtesy of the MS Docs:

<https://docs.microsoft.com/en-us/sql/t-sql/language-elements/operator-precedence-transact-sql?view=sql-server-ver15>

|Precedence|Operators|
|---|---|
|1st|`~` (Bitwise NOT)|
|2nd|`*`, `/`, `%`|
|3rd|`+` (Positive), `-` (Negative), `+` (Addition), `-` (Subtraction), `&` (Bitwise AND), `^` (Bitwise Exclusive OR), `|` (Bitwise OR)|
|4th|`=` (Comparison), `>`, `<`, `>=`, `<=`, `<>`, `!=`, `!>`, `!<`|
|5th|`NOT`|
|6th|`AND`|
|7th|`ALL`, `ANY`, `BETWEEN`, `IN`, `LIKE`, `OR`, `SOME`|
|8th|`=` (Assignment)|
