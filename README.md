# Project 2 - The Scriptures, Mapped (CSS and UX)
### Name: Jeffrey Mohler
### Date: 12 March 2021
---
### Description:
This project added more styling and a better user experience into Project 1. This included animating any changes of the scripture content, adding breadcrumbs for navigation, making the page responsive to various sizes, and styling various elements of the page.
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