// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight - 50;


let balls = []
    // 生成随机数的函数

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function randomColor() {
    return 'rgb(' +
        random(0, 255) + ', ' +
        random(0, 255) + ', ' +
        random(0, 255) + ')';
}


function CirclePrototype(x, y, velX, velY, exist) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exist = exist;
}
CirclePrototype.prototype.testCy = function() {

}

function EvilCircle(x, y, velX, velY, exist) {
    CirclePrototype.call(this, x, y, velX, velY, exist);
    this.color = 'white';
    this.size = 10;
}
EvilCircle.prototype = Object.create(CirclePrototype.prototype);
EvilCircle.prototype.constructor = EvilCircle;
EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}
EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
        this.x = this.x - this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x = this.x + this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y = this.y - this.size;
    }

    if ((this.y - this.size) <= 0) {
        this.y = this.y + this.size;
    }
}
EvilCircle.prototype.setControls = function() {
    window.onkeydown = e => {
        switch (e.key) {
            case 'a':
                this.x -= this.velX;
                break;
            case 'd':
                this.x += this.velX;
                break;
            case 'w':
                this.y -= this.velY;
                break;
            case 's':
                this.y += this.velY;
                break;
        }
    };
}
EvilCircle.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        let ball = balls[j];
        if (this != balls[j] && ball.exist) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if ((distance < this.size + ball.size)) {
                ball.exist = false;
                ball.color = "black"
                balls.splice(j, 1);
            }
        }
    }
}

function Ball(x, y, velX, velY, color, size, exist) {
    CirclePrototype.call(this, x, y, velX, velY, exist);
    this.color = color;
    this.size = size;
    this.collidingBall = new Set();
}

Ball.prototype = Object.create(CirclePrototype.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (this != balls[j]) {
            let ball = balls[j];
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if ((distance < this.size + ball.size) && !ball.collidingBall.has(this) && !this.collidingBall.has(ball)) {
                ball.collidingBall.add(this);
                this.collidingBall.add(ball);
                ball.color = this.color = randomColor();
            } else if (distance > this.size + ball.size) {
                ball.collidingBall.delete(this);
                this.collidingBall.delete(ball);
            }
        }
    }
}


while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomColor(),
        size,
        true
    );
    balls.push(ball);
}
let evilCircle = new EvilCircle(width / 2, height / 2, 20, 20, true);
evilCircle.setControls();

function loop() {
    ctx.fillStyle = 'rgb(0,0,0,0.25)';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < balls.length; i++) {
        balls[i].update();
        balls[i].collisionDetect();
        balls[i].draw();
    }
    evilCircle.checkBounds();
    evilCircle.collisionDetect();
    evilCircle.draw();
    requestAnimationFrame(loop);
}

loop();