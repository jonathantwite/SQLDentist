---
title: Yet another accidental fullstack DBA
description: 'My story is the story of many other developers...'
---
My story is the story of many other developers...
<!--more-->
I started a new job at a company creating line-of-business software for local government.  I started working with a large and complex management system built in C# (WPF) backed by an SQL database that is installed locally on the clients own hardware.  The system is a classic legacy application - functionality wise it works well for the clients, although the code is a little messy now and has suffered from a little lack of structure.  It was however, somewhat slow in several places and at times struggled with the ever growing amount of data requested by the users.

My previous job involved working with a handful of monolithic-style databases from which multiple applications ran.  Although this allowed different applications to be targetted at specific business requirements while allowing them all to access the same data in real-time, this frequently lead to situations where one an issue within a database would bring down multiple applications.  I was employed as a full-stack applications developer, but had to ensure that my applications were not the ones which slowed down, or broke, these underlying databases.

Query tuning was basically left down to the developers to ensure that their applications ran in a timely fashion.  While I was there a DBA was brought in, but he spent most of his time optimising the various servers and connections between the servers rather than looking at individual queries.  He did however, have the knowledge as to where to look when we did approach him for help.

So when I arrived at this current job and found some very slow running queries, I jumped in, and buoyed by some initial success, began working through speeding up queries wherever I found those that should have run quicker than they did.

I quickly got the reputation for speeding up the database and then all the issued relating to SQL started flooding towards me.  Although I am not a DBA, nor does our company have any DBA positions (the databases, installed on clients' networks are the responsibility of them), I am the "Database Guy" and therefore join the multitude of other developers who accidentally became the go-to person for database issues in their company.
