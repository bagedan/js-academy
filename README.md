# js-academy

## Homework 1

I was using Node.js for this homework just because that's what I'm going to do on a project.
But as you request was to create a code that you can run in browser, I was not using anything node related in the photoRepository script.

To start - create new instance of PhotoRepository object.

- add(photo) - add photo into storage. photo object has to have 'url' and 'description' attributes. Id of freshly created entry will be return

- edit(photo) - edit information stored. photo object has to have 'id' attribute to point at the entry that will be updated.
                photo object may provide 'url' and/or 'description' attributes to update.

- get(id) - return photo object. Only accepts string or number as object id.
            Returns 'null' if object with such id does not exist

- delete(id) - delete object with corresponding id or does nothing if object does not exists

- find(keyword) - provides basic search functionality over descriptions of uploaded photos. case-insensitive, complete word match only.




Questions to figure out:

1) How to make some fields private? Like for internal data structure or for some functions

2) What is the common structure for node project? Where do tests live?

3) How to make IntelliJ better support testing? Example
    - jumping from file to the corresponding tests file (shift + ctr + T for java)
    - running one specific test at the time (right now I can only run the entire test file)

4) There are a lots of weird warnings in Intellij like
    - unterminated statement for 'use strict' line
    - unresolvable variable "to" in test

