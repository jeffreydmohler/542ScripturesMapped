# Project 2 - The Scriptures, Mapped (CSS and UX)
### Name: Jeffrey Mohler
### Date: 12 March 2021
---
### Description:
This project will show a reference of all the scriptures in the standard works on the left side of the page. This will consist of buttons which shows the book names. When clicked, the view will change to allow the user to select a chapter.  Once a chapter is selected, the contents will be displayed along with pins on the map for each of the locations found in the chapter. The map will also allow for zooming in/out and panning around to get a better view.

In HW 5, the API calls were being made to receive the volumes and books JSON objects. The books for each volume were also being added into the volumes array for easier access.

Project 1 added onto that foundation to implement the remaing functionality of the project. This included showing the volumes, books, chapter, and contents when appropriate; displaying the map; setting markers on the map and zooming accordingly; and enabling the user to click on any location in the contents with the showLocation function.

This project added more styling and a better user experience into Project 1. This included animating any changes of the scripture content, adding breadcrumbs for navigation, making the page responsive to various sizes, and styling various elements of the page.

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
### Learning During Project 2:
- The first thing I learned was how to modularize my JS code. This was not technically part of the requirements of this project, but I did do this since project 1. It was interesting to learn how to export things in different ways.
- I also learned how to incorporate breadcrumbs into the project.  The most interesting part of this was using css to put the arrows into the path with `::before`.
- I learned a lot about how to use flexbox. I went through flexboxfroggy to get a basis for this. Flexbox ended up being key to my responsive design to change the order of divs and how they are laid out.
- I learned the difference of relative, absolute, and fixed position. In the past, I have just always tried stuff until something worked, but now I feel that I have a better understanding and expectation of what will happen with each position.
- I learned how to use jQuery in several ways. I had never used jQuery before, so this was really interesting.
    - This included knowing how to animate different elements on and off the page or making them transparent, etc.
    - I also learned how to use the `toggleClass()` method in jQuery to take a class on and off of an element when a button is clicked with the `click()` method. This allowed me to show and hide the scriptures content on smaller screens with a button. With this, I also used the `transition` css property to animate this opening and closing of the scriptures content.
- I learned how to use media queries in my css. This obviously included having a `max-width` or `min-width`.  But, I also learned how to specify landscape vs portrait and how to combine multiple different conditions (and/or).
- Lastly, I learned even more the importance of developer tools and feedback.  Chrome's developer tools enables you to get instant feedback on certain css properties or screen sizes.  Feedback from real people (like my wife) can also help me to see things that I may have missed or that could look better. Specifically, my wife helped me nail down how to make the buttons look the best.