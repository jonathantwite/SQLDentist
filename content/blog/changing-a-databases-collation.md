---
title: "Tales from real life: Changing a database's collation"
description: Collation is something you never really think about when developing on a database, yet when you discover that it has been set wrong, correcting it can be a right hassle.
author: Jonathan Twite
createdAt: 2021-02-22
---

Collation is not something that a developer should have to think about.  It is a setting that is set at a server level and then trickles down into databases and then individual table columns and therefore, unless you are setting up a new server, you rarely care enough to check that it has been setup correctly.  I mean, the applications all work so there is no problem, right?

Collation relates to how text is stored and retrieved within a database - especially with regards to comparison and sorting - and is written down as a string consisting of several parts.  For example

```sql
SQL_Polish_CP1250_CS_AS
```

or

```sql
Tibetan_100_CI_AI_KS_WS_SC
```

This informs SQL which character set to use - `Polish` states that the character set needs to cover all letters used in Polish, similarly for `Tibetan` and the Tibetan script. The code page setting (`CP1250`) informs SQL how to encode the charatures shown on screen into bytes on the database.  `CS` and `CI` define whether a string comparison is case sensitive or case insensitive.  `AS` and `AI` define whether a string comparison is affected by accents (e.g. `a <> á`, accent sensitive, `AS`) or accent insensitive (`AI`, e.g. `a = á`).  Various other options are specifically available for certain scripts (especially non-latin scripts like Japanese and Chinese).

One option, the `SQL` option which appears at the start of a collation name string, was the option that was causing issues with our application.  Our application had been developed using a database with the `Latin1_General_CI_AS` collation and the is generally installed via a series of SQL scripts.  As collation is not usually something we think about, apart from it being mentioned in the initial setup documentation we provide, we rarely considered it.  On one client, the server that the database had been installed on had a collation setting of `SQL_Latin1_General_CI_AS` which then was applied to every column in our database.  It so happened that this caused one very specific error in the application which was then a big issue to the client.

The difference between `SQL` and non SQL collations are whether the collations have been provided by SQL Server, or Windows.  SQL server collations are in general older than Windows collations and are there for [backwards compatibility](https://docs.microsoft.com/en-us/sql/relational-databases/collations/collation-and-unicode-support?view=sql-server-ver15#SQL-collations).  They should not be used for new development.

## Investigating moving the data

In SSMS, it looks trivially simple to change a database's collation.  Microsoft gives you a drop down in the database's options popup to select a new collation from those available.  Unfortunately this rarely works and just shows an error.

The main issue is that the columns are rarely isolated from each other.  Our database has textual columns that are:

* Indexed.
* Part of an index's `INCLUDE` columns.
* Have a default value.
* Have a value constraint.
* A primary key.
* A foreign key referencing said primary key.
* Used in a user defined function.
* Referenced in a stored procedure.

Any one of these would have caused an issue, all eight together rendered anything Google suggested as useless.

The first plan was to use Redgate's SQL Compare and SQL Data Compare tools.  One issue would be getting these tools onto the clients machines still licenced, but I figured we would cross that bridge when we came to it.  SQL Data Compare can be set to ignore collation and so generate a script (for specific tables) to move the data across.



## Updating client 1

Client 1 allows us access to their database server with full admin rights.  We were therefore able to create a new database with the correct collation