# Project 1 - The Scriptures, Mapped
### Name: Jeffrey Mohler
### Date: 8 February 2021
---
### Description:
This project will show a reference of all the scriptures in the standard works on the left side of the page. This will consist of buttons which shows the book names. When clicked, the view will change to allow the user to select a chapter.  Once a chapter is selected, the contents will be displayed along with pins on the map for each of the locations found in the chapter. The map will also allow for zooming in/out and panning around to get a better view.

In HW 5, the API calls were being made to receive the volumes and books JSON objects. The books for each volume were also being added into the volumes array for easier access.

Project 1 added onto that foundation to implement the remaing functionality of the project. This included showing the volumes, books, chapter, and contents when appropriate; displaying the map; setting markers on the map and zooming accordingly; and enabling the user to click on any location in the contents with the showLocation function.

### Learning During HW 5:
- At first, I was having a hard time following all the `callback` parameters/functions throughout the project. But after research and reviewing the code, I was able to learn how they are passed from one function to the next.
- I learned that I could get a decent codebase to start with from https://www.html5boilerplate.com.
- I did not realize that the API requests would run at the same time. I was thinking that they would be run sequentially. But, seeing that the `volumes` were returned first helped me to see how it works.
- I learned about the `Cache Killer` plugin. This should be super nice, especially with CSS.
- Lastly, I was reminded of some of the chrome developer tools including how to set breakpoints.

### Learning During Project 1:
- I learned the importance of having organized code with everything (functions, literals, etc) defined at the top and in alphabetical order. This made it much easier to find things.
- I learned how to use the google maps API including setting markers, extending bounds, setting zoom, and clearing everything.
- I learned how to use hashes in the url to change the page. I also learned how to grab the hash value with `window.location.hash` and manipulate it.
- I learned how to use and the benefit of using HTML helpers in your JavaScript code.
- I learned the benefit of using JSLint to clean up my code.
- I was also reminded of the power of talking with others about projects. Someone else had found a much simpler and easier way to zoom to the appropriate distance. (I left my old code commented out on lines 570-602 if you are interested).
- I learned how to use DOM query selectors to grab the contents of only certain elements.
- I learned how to use a "ready" function to load all the page content when ready.
- I was reminded of how fun it can be to code and build something and get it to work.