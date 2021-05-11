---
title: Converting a decimal to a varchar
description: Fixing a simple, but easy-to-miss, error (twice) when converting a decimal to varchar.
author: Jonathan Twite
createdAt: 2021-05-07
related:
  - blog 02
  - blog 03
---

An error occurred in a stored procedure yesterday that has never had a problem before:

```text
Msg 8115, Level 16, State 5, Line 17
Arithmetic overflow error converting numeric to data type varchar.
```

It was pretty obvious where to look, a bit of code that looks similar to

```sql{}[DodgyCast1.sql//2012]
DECLARE @val DECIMAL(12,4) = /* */;
SELECT CAST(@val AS VARCHAR(12));
```

As long as `@val` was reasonably small, this worked fine.  As `@val` was imported into the application, this had never caused an issue.

You should be able to spot the problem straight away: `DECIMAL(12,4)` allows a number with 12 numerals, four of which are after the decimal point - this decimal point adds an extra character to the string representation of this value.  Therefore `12345678.9012` is an allowed value for `@val` but throws an error when casting to `VARCHAR(12)` as it is 13 characters long.

We fixed this:

```sql{}[DodgyCast2.sql//2012]
DECLARE @val DECIMAL(12,4) = /* */;
SELECT CAST(@val AS VARCHAR(13));
```

and it worked perfectly on our dev database, only to still be broken on the production data.

Why? I took us investigating the data being imported to realise that there is a second extra character that could be included - a negative symbol.  The value `-12345678.9012` is also perfectly legal value for a `DECIMAL(12,4)`, however the string representation is 14 characters long.

Why did this happen?  The data being imported by the client used to be 6 digit positive numbers (codes) with the occasional decimal part, or a small negative number that served as a temporary code until an official code was assigned.  The frontend checked that the codes were less than 100,000,000 and the application worked fine for most situations.  This was an edge-case that got missed and never showed up until the client changed how they worked.
