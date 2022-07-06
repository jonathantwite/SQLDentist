---
title: Generating a testing matrix
description: Using SQL to create a matrix of possibilities
author: Jonathan Twite
createdAt: 2022-07-06
---

File this one under "non-SQL things you can do with SQL", but it has its use cases.

Sometimes you have a variety of parameters or options and want to create a grid with all possible combinations.  This can be easily be done with SQL's `CROSS JOIN` and using inline table definitions (like used in the <nuxt-link to="/blog/05-a-simple-function-tester">simple function tester</nuxt-link>).

This can be used when you need to create a matrix of all possible inputs or variables for consideration during testing code or algorithms.

A slightly less work-related example would be calculating the number of possible combinations that could be made out of a set of Lego people parts:

```sql{}[LegoCombinations.sql//2012]
SELECT * 
FROM 
    (VALUES
        ('Head'),
        ('Head with grey beard'),
        ('Head with red beard'),
        ('Head with sunglasses'),
        ('Head with square glasses')
    ) AS Head ([Head type])

    CROSS JOIN
        (VALUES
            ('Short black'),
            ('Long brown'),
            ('Pigtails red')
        ) AS Hair ([Hair])

    CROSS JOIN 
        (VALUES
            ('Green jumper'),
            ('Tuxedo'),
            ('Police uniform')
        ) AS Torso ([Torso])

    CROSS JOIN 
        (VALUES
            ('Black'),
            ('Blue')
        ) AS Legs ([Legs]);
```

<div class='result-grid'>

| Head type | Hair | Torso | Legs |
|---        |---   |---    |---   |
|Head|Short black|Green jumper|Black|
|Head with grey beard|Short black|Green jumper|Black|
|Head with red beard|Short black|Green jumper|Black|
|Head with sunglasses|Short black|Green jumper|Black|
|Head with square glasses|Short black|Green jumper|Black|
|Head|Long brown|Green jumper|Black|
|Head with grey beard|Long brown|Green jumper|Black|
|...|...|...|...|

</div>

This can be exported to Excel from SSMS very easily.
