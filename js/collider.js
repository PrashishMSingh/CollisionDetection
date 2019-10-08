const INTERVAL_SPEED = 40;
const MAIN_CONTAINER_WIDTH = 300;
const MAIN_CONTAINER_HEIGHT = 300;

function BallController(ballCount, parentClass, ballType){
  this.ballList = []
  this.xSpeed = 2;
  this.ySpeed = 2;
  this.DEFAULT_BALL_SIZE = 12;
  this.ballCount = ballCount
  this.DEFAULT_X_POSITION = 0;
  this.DEFAULT_Y_POSITION = 0;
  this.parentElement = document.getElementsByClassName(parentClass)[0];

  this.ballsXPositionList = []
  this.ballsYPositionList = []
  this.ballType =  ballType;

  this.setDefaultParentStyle = function(){
      this.parentElement.style.position = 'relative';
      this.parentElement.style.height =MAIN_CONTAINER_HEIGHT + 'px';
      this.parentElement.style.width =MAIN_CONTAINER_WIDTH + 'px';
      this.parentElement.style.backgroundColor = '#dcdcdc';
      return this
  }

  this.create = function(){
    for(var i = 0; i< this.ballCount; i++){
      var xPos = Math.floor(Math.random() * MAIN_CONTAINER_WIDTH) - 1;
      var yPos = (Math.floor(Math.random() * MAIN_CONTAINER_WIDTH) + 1);
      var ball = new Ball(this.DEFAULT_BALL_SIZE, xPos, yPos, this.xSpeed, this.ySpeed).init();
      if(this.ballType ==='circle'){
        ball.createCircle()
      }
      this.parentElement.appendChild(ball.getElement())
      this.ballList.push(ball)
    }
  }

  this.update = function(){
    setInterval((function(){
      this.parentElement.style.border = '0'
      // for every element in list
      for(var i = 0 ; i<this.ballCount; i++ ){
        var ballPos = this.ballList[i].getPosition()
        // check if the ball has colided in the left and right border
        if(ballPos.x >= MAIN_CONTAINER_WIDTH - this.DEFAULT_BALL_SIZE){
          this.ballList[i].setXSpeed(-(this.xSpeed))
          this.parentElement.style.borderRight = '2px solid red';
        }
        else if(ballPos.x < 0){
          this.ballList[i].setXSpeed(Math.abs(this.xSpeed))
          this.parentElement.style.borderLeft = '2px solid red';
        }

        // check if the ball has colided in the bottom border
        var y = ballPos.y;
        if(ballPos.y >= MAIN_CONTAINER_HEIGHT - this.DEFAULT_BALL_SIZE){
          this.ballList[i].setYSpeed(-(this.ySpeed))
          this.parentElement.style.borderBottom = '2px solid red';
        }

        if(ballPos.y < 0 ){
          this.ballList[i].setYSpeed(Math.abs(this.ySpeed))
          this.parentElement.style.borderTop = '2px solid red';
        }

        var collisionOutput = this.checkCollision(i)

        // check which ball had collision and from where
        if(collisionOutput){
          var collidedBall = collisionOutput.collidedBall
          var verticalCollision = collisionOutput.verticalCollision
          var horizontalCollision = collisionOutput.horizontalCollision
          console.log("vertical : ", verticalCollision)
          console.log("horizontal : ", horizontalCollision)

          switch(horizontalCollision){
            case 'left':
              this.ballList[i].setXSpeed(Math.abs(collidedBall.xSpeed * 1.2))
              collidedBall.setXSpeed(-collidedBall.xSpeed * 1.2)
              break

            case 'right':
              this.ballList[i].setXSpeed(-collidedBall.xSpeed * 1.2)
              collidedBall.setXSpeed(Math.abs(collidedBall.xSpeed) * 1.2)
              break
          }

        switch(verticalCollision){
          case 'top':
            this.ballList[i].setYSpeed(-collidedBall.ySpeed)
            collidedBall.setYSpeed(Math.abs(collidedBall.ySpeed))
            break

          case 'bottom':
            this.ballList[i].setYSpeed(Math.abs(collidedBall.ySpeed))
            collidedBall.setYSpeed(-collidedBall.ySpeed)
            break

        }
        this.ballList[i].move()
        this.ballList[i].draw()
        collidedBall.move()
        collidedBall.draw()

        collidedBall.getElement().style.backgroundColor = 'red'
        this.ballList[i].getElement().style.backgroundColor = 'black'
      }

        this.ballList[i].move()
        this.ballList[i].draw()

      }
    }).bind(this), INTERVAL_SPEED)
  }


  this.checkCollision = function(index){
    var ball = this.ballList[index]
    for(var i = 0; i<this.ballList.length; i++){
      if(i !== index){
        var leftCollision = (ball.x + ball.size) >= this.ballList[i].x
        var rightCollision = ball.x <= (this.ballList[i].x + this.ballList[i].size)
        var bottomCollision = (ball.y + ball.size) >= this.ballList[i].y
        var topCollision = ball.y <= (this.ballList[i].y + this.ballList[i].size)

        var verticalCollisionPlace = ''
        var horizontalCollisionPlace = ''

        if(topCollision){
          verticalCollisionPlace = 'bottom'
        }else if(bottomCollision){
          verticalCollisionPlace = 'top'
        }

        if(leftCollision){
          horizontalCollisionPlace = 'left'
        }else if(rightCollision){
          horizontalCollisionPlace = 'right'
        }

        if(ball.getBallType() === 'square'){
          if(leftCollision && rightCollision && topCollision && bottomCollision){
            return {
              collidedBall : this.ballList[i],
              verticalCollision: verticalCollisionPlace,
              horizontalCollision: horizontalCollisionPlace
            }
          }
        }

        else if(ball.getBallType() === 'circle'){
          var radius = ball.size/2
          var xDiff = ((ball.x) - (this.ballList[i].x))**2
          var yDiff = ((ball.y) - (this.ballList[i].y))**2

          if((xDiff + yDiff) < (radius)**2){
            return{
              collidedBall:this.ballList[i],
              verticalCollision: verticalCollisionPlace,
              horizontalCollision: horizontalCollisionPlace
            }
          }
        }
      }
    }
  }
}

var ballController = new BallController(6, 'ball-container', 'circle')
ballController.setDefaultParentStyle()
ballController.create()
ballController.update()

var squareController = new BallController(6, 'square-container', 'square')
squareController.setDefaultParentStyle()
squareController.create()
squareController.update()
