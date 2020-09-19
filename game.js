var canvas = document.getElementById("the-game");
var context = canvas.getContext("2d");
var game, snake, food;
game = {
  score: 0,
  fps: 15,
        /*
      amuse toi avec les fps
      */
  over: false,
  message: null,
  start: function() {
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 15;
    snake.init();
    food.set();
  },
  stop: function() {
    game.over = true;
    game.message = 'PERDU - APPUYE SUR ESPACE';
  }, 
  drawBox: function(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y + (size / 2));
    context.lineTo(x - (size / 2), y + (size / 2));
    context.closePath();
    context.fill();
  },
  drawScore: function() {
    context.fillStyle = '#ffffff';
    /*
    la couleur perso j'ai mis random mais si t'a des idées viens les donners sur le discord
    */
    context.font = (canvas.height) + 'px Impact, sans-serif';
    context.textAlign = 'center';
    context.fillText(game.score, canvas.width / 2, canvas.height * 0.9);
  },
  drawMessage: function() {
    if (game.message !== null) {
      context.fillStyle = '#fff';
      context.strokeStyle = '#23272A';
      /*
      le background du snake est fait avec le background du site directement j'ai pas fait de délimitation 
      si vous voulez mettre un background vous pouvez prendre le code et refaire une page exprès (pour les bourrins)
      c'est logique mais pour le faire plus lent baissez les fps à 10-15 pour avoir un minimum de défis
      */
      context.font = (canvas.height / 10) + 'px Impact';
      context.textAlign = 'center';
      context.fillText(game.message, canvas.width / 2, canvas.height / 2);
      context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
    }
  },
  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
};
snake = {
  size: canvas.width / 40,
  x: null,
  y: null,
  color: '#2CC000',
  /*
  le hex picker de google en sueur lel
  */
  direction: 'left',
  sections: [],
  init: function() {
    snake.sections = [];
    snake.direction = 'left';
    snake.x = canvas.width / 2 + snake.size / 2;
    snake.y = canvas.height / 2 + snake.size / 2;
    for (var i = snake.x + (5 * snake.size); i >= snake.x; i -= snake.size) {
      snake.sections.push(i + ',' + snake.y); 
    }
  },
  move: function() {
    switch (snake.direction) {
      case 'up':
        snake.y -= snake.size;
        break;
      case 'down':
        snake.y += snake.size;
        break;
      case 'left':
        snake.x -= snake.size;
        break;
      case 'right':
        snake.x += snake.size;
        break;
    }
    snake.checkCollision();
    snake.checkGrowth();
    snake.sections.push(snake.x + ',' + snake.y);
  },
  draw: function() {
    for (var i = 0; i < snake.sections.length; i++) {
      snake.drawSection(snake.sections[i].split(','));
      /*
      bravo bien de changer sont score
      */
    }    
  },
  drawSection: function(section) {
    game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color);
  },
  checkCollision: function() {
    if (snake.isCollision(snake.x, snake.y) === true) {
      game.stop();
    }
  },
  isCollision: function(x, y) {
    if (x < snake.size / 2 ||
        x > canvas.width ||
        y < snake.size / 2 ||
        y > canvas.height ||
        snake.sections.indexOf(x + ',' + y) >= 0) {
      return true;
    }
  },
  checkGrowth: function() {
    if (snake.x == food.x && snake.y == food.y) {
      game.score++;
      if (game.score % 5 == 0 && game.fps < 60) {
        game.fps++;
      }
      food.set();
    } else {
      snake.sections.shift();
    }
  }  
};
food = {
  size: null,
  x: null,
  y: null,
  color: '#C00000',
  set: function() {
    food.size = snake.size;
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
  },
  draw: function() {
    game.drawBox(food.x, food.y, food.size, food.color);
  }
};
var inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
  /*
  ouai par contre fait gaffe avec ça x)
  */
};
var keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32]
};
function getKey(value){
  for (var key in keys){
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
}
addEventListener("keydown", function (e) {
    var lastKey = getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
        && lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    }
}, false);
var requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;
function loop() {
  if (game.over == false) {
    game.resetCanvas();
    game.drawScore();
    snake.move();
    food.draw();
    snake.draw();
    game.drawMessage();
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
}
requestAnimationFrame(loop);