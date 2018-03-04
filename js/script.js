const RIGHT=1;
const UP=2;
const LEFT=3;
const DOWN=4;

class game {
  constructor( aEl ) {
    if( aEl ) {
      this.ctx = aEl.getContext( "2d" );
      this.canvas = aEl;
    }
  }

  fillPg() {
    let ctx = this.ctx;
    let canvas = this.canvas;

    ctx.fillStyle = '#2c3e50';
    ctx.fillRect( 0, 0, canvas.width, canvas.height )
  }

  fillSnake( aTrail, aSnake ) {
    let ctx = this.ctx;
    let canvas = this.canvas;

    ctx.fillStyle = '#8e44ad';

    for( var i = 0; i < aTrail.length; i++ ) {
      ctx.fillRect( aTrail[i].x * 20, aTrail[i].y * 20, 18, 18 );

      if( aSnake.curX == aTrail[i].x && aSnake.curY == aTrail[i].y ) {
        aSnake.setPoints( 0 );
        aSnake.resetTailSize();
      }
    }
  }

  getCanvasWidth() {
    let canvas = this.canvas;
    return( canvas.width );
  }

  getCanvasHeight() {
    let canvas = this.canvas;
    return( canvas.height );
  }

  getContext() {
    return( this.ctx );
  }
};

class snake {
  constructor() {
    this.tailsize = 5;
    this.trail = [];
    this.curX = 10;
    this.curY = 10;
    this.direction = RIGHT;
    this.width=20;
    this.height=20;
    this.points = 0;
    this.newDirection = [];
  }

  setNewDirection( aDirection ) {
    this.newDirection.push( aDirection );
  }

  getNewDirection() {
    return( this.newDirection );
  }

  incPoints() {
    this.points += 200;
  }

  setPoints( aPoints ) {
    this.points = aPoints;
  }

  getPoints() {
    return( this.points );
  }

  getTailSize() {
    return( this.tailsize );
  }

  incTailSize() {
    this.tailsize++;
  }

  resetTailSize() {
    this.tailsize = 5;
  }

  setDirection( aDirection ) {
    this.direction = aDirection;
  }

  getDirection() {
    return( this.direction );
  }

  getTrail() {
    return( this.trail );
  }

  pushTrail( anewX, anewY ) {
    this.trail.push({ x: anewX, y: anewY });
  }
}

class food {
  constructor() {
    this.posX = Math.floor( Math.random()  * 30 );
    this.posY = Math.floor( Math.random() * 30 );
  }

  newPos() {
    this.posX = Math.floor( Math.random()  * 30 );
    this.posY = Math.floor( Math.random() * 30 );
  }

  draw( aCtx ) {
    aCtx.fillStyle = '#27ae60'
    aCtx.fillRect( this.posX * 20, this.posY * 20, 18, 18 );
  }
}

gameLoop = ( agameObj, asnakeObj, afoodObj ) => {
  agameObj.fillPg();
  afoodObj.draw( agameObj.getContext() );

  let nx = 0;
  let ny = 0;

  let newDirection = asnakeObj.getNewDirection();
  let currentDirection = asnakeObj.getDirection();
  let allowedDirections = [];

  if( newDirection.length > 0 ) {
    switch( currentDirection ) {
      case UP       : allowedDirections = [ LEFT, RIGHT ]; break;
      case DOWN     : allowedDirections = [ LEFT, RIGHT ]; break;
      case LEFT     : allowedDirections = [ UP, DOWN ]; break;
      case RIGHT    : allowedDirections = [ UP, DOWN ]; break;
      default       : allowedDirections = [ UP, DOWN, LEFT, RIGHT ]; break;
    }

    if( allowedDirections.indexOf( newDirection[0] ) > -1 ) {
      asnakeObj.setDirection( newDirection[0] );
    }

    newDirection.shift();
  }

  switch( asnakeObj.getDirection() ) {
    case RIGHT : nx =  1; break;
    case LEFT  : nx = -1; break;
    case UP    : ny = -1; break;
    case DOWN  : ny =  1; break;
  }

  asnakeObj.curX += nx;
  asnakeObj.curY += ny;

  agameObj.fillSnake( asnakeObj.getTrail(), asnakeObj );

  if( asnakeObj.curX > (agameObj.getCanvasWidth() / 20) - 1  )
    asnakeObj.curX = 0;
  if( asnakeObj.curX < 0 )
    asnakeObj.curX = (agameObj.getCanvasWidth() / 20) - 1;
  if( asnakeObj.curY < 0 )
    asnakeObj.curY = (agameObj.getCanvasHeight() / 20) - 1;
  if( asnakeObj.curY > (agameObj.getCanvasHeight() / 20) - 1 )
    asnakeObj.curY = 0;

  asnakeObj.pushTrail( asnakeObj.curX, asnakeObj.curY );

  while( asnakeObj.getTrail().length > asnakeObj.getTailSize() ) {
    asnakeObj.getTrail().shift();
  }

  if( asnakeObj.curX == afoodObj.posX && asnakeObj.curY == afoodObj.posY ) {
    asnakeObj.incTailSize();
    asnakeObj.incPoints();
    afoodObj.newPos();
  }

  let elementPoints = document.getElementById( 'points' );
  if( elementPoints )
    elementPoints.innerHTML = asnakeObj.getPoints();
}

handleKeyDown = ( aSnakeObj, event ) => {
  switch( event.keyCode ) {
    case 37 :
      aSnakeObj.setNewDirection( LEFT );
      break;
    case 38 :
      aSnakeObj.setNewDirection( UP );
      break;
    case 39 :
      aSnakeObj.setNewDirection( RIGHT );
      break;
    case 40 :
      aSnakeObj.setNewDirection( DOWN );
      break;
  }
}

window.onload = () => {
  let pg = document.getElementById( "pg" );
  let gameObj = new game( pg );
  let snakeObj = new snake();
  let foodObj = new food();

  document.addEventListener( 'keydown', handleKeyDown.bind( this, snakeObj ) )
  setInterval( gameLoop.bind( this, gameObj, snakeObj, foodObj ), 1000/20 );
}
