# Vision Gate

## Authors
* [Anthony Johnson](https://github.com/orgs/Vision-Gate/people/TheAJHarris) 
* [Barrett Nance](https://github.com/orgs/Vision-Gate/people/baxance)
* [Leaundrae Mckinney](https://github.com/orgs/Vision-Gate/people/UreaLaden)
* [Lydia Minehan-Tubic](https://github.com/orgs/Vision-Gate/people/LydiaMT)

## See our Website
* [Link to Vision Gate](http://www.vision-gate.xyz/)

## User Stories
1. Image Search

  As a user I want to be able to search a database of images so that I can add them to my vision board. 

  Feature Task: Setup the server, file and folder structure so the user can query an image API

  Acceptance Test: User can put a keyword into a text input box and is taken to a page where they can pin their favorite images

2. Goal Selection

  As a user I would like to be able to select an individual image and add appropriate metadata (goal description, deadline) so that I can review my goals regularly on my vision board. 

  Feature Task: From the users board, Set up a ‘/details/:user’ route so the user can add a description and deadline to the images on their board.

  Acceptance Test: When user hovers over images on their board, a dialogue box appears with the images description and deadline.

3. Board Manipulation

  As a user I would like to be able to update and delete images from my board as well as their metadata so I can update or remove completed goals.

  Feature Task: The user should be able to navigate to the ‘/details/:user’ route to update the description and deadline for their goals or delete the goal.

  Acceptance Test: Text input box exists on the page where the user can update the description or deadline of their image. Two buttons exist on the page; one button to update the description and/or deadline, and one button to delete the image from the users board.

4. Viewing Vision Board

  As a user I would like to view my board as a collection of my selections so it properly reflects my goals and visions.

  Feature Task: The user should be able to navigate to the ‘My Board’ page to view their unique board. This should take place via the route ‘/userboard/:user’.

  Acceptance Test: CSS will be used to display the images in a randomized grid like fashion.

5. Creator Contact

  As a user I would like to be able to view and/or connect with the applications creators so I can connect with them.

  Feature Task: Your application should have an about the creators page. Each creator should write a short bio and add their LinkedIn, GitHub and Vision Board.

  Acceptance Test: Links to  LinkedIn, GitHub and Vision Board are all active.

6. Quote Generator

  As a user I would like to be greeted by a random motivational quote on the homepage everytime the page/application is refreshed so I feel inspired.

  Feature Task: Create a JSON file with 10 sourced quotes that randomly print to the index page each time it’s visited.

  Acceptance Test: Quotes are appropriately printing to the page in a randomized fashion.

STRETCH: As a user I would like to be able to choose from a selection of layouts so I can match my board to my mood.

  Feature Task: Add a ‘theme’ button to the ‘/userboard/:user’ board so the user can pick from a theme.

  Acceptance Test: When the user selects their chosen theme, the style of the page changes.

## References

* [Background image animation](https://www.youtube.com/watch?v=Kd9LBwfB7Hc)
* [Image drop shadow](https://www.w3schools.com/cssref/css3_pr_text-shadow.asp)
* [Masonry Documentation](https://masonry.desandro.com/options.html)
* [Learn Masonry JS in 5 Minutes](https://www.youtube.com/watch?v=_IAFA2kA840)
* [Simple Tile Hover Effect](https://codepen.io/chrisdothtml/pen/OVmgwK)
* [SCSS to CSS](https://jsonformatter.org/scss-to-css)
* [How to create a link that goes to the top of a web page](https://www.computerhope.com/issues/ch001475.htm)
* [Simple Centered Navigation Bar](https://www.youtube.com/watch?v=R5aRUdM7Iio)
* [Responsive Contact us form Using HTML and CSS - contact form design](https://www.youtube.com/watch?v=l_Z3N3etkS0&t=644s)
* [text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow)
* [Darkmode toggle](https://www.w3schools.com/howto/howto_js_toggle_dark_mode.asp)

