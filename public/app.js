window.onload = () => {
  $('.grid').masonry({
    itemSelector: '.grid-item',
    gutter: 10,
    fitWidth: true
  });
};

alert("connected to app.js")