if('serviceWorker' in navigator){
  navigator.serviceWorker
    .register('/sw.js')
    .then(function(){
      console.log('[SW] registered')
    })
    .catch(function(err){
      console.log(err);
    });
}


var box = document.querySelector('.box');
var button = document.querySelector('button');

button.addEventListener('click', function(event) {
  if (box.classList.contains('visible')) {
    box.classList.remove('visible');
  } else {
    box.classList.add('visible');
    box.classList.add('blue');
  }
});
