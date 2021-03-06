var canvas = document.getElementById("pong_canvas");
var context = canvas.getContext("2d");
var mousePos = {x: 0, y: 0}

function paddle(is_left, y_pos, is_human) {
    this.width = 25;
    this.height = 100;

    // Coordinates refer to the upper left corner of the paddle.
    // IDEA: Change to exact center of paddle.
    if(is_left) {
        this.x_pos = 30;
    } else {
        this.x_pos = canvas.width - (this.width/2 + 30)
    }
    this.y_pos = y_pos;
    this.is_human = is_human;

    // Maximum allowed distance to the edges.
    this.top_border = 10;
    this.bottom_border = canvas.height - 10;
    this.left_border = 20;
    this.right_border = canvas.width - 20;

    this.update = function(ball) {
        if (is_human) {
            this.y_pos = mousePos.y;
        } else {
            // Attempt to position midpoint of paddle at same level of ball.
            this.y_pos = this.y_pos + (ball.y_pos - this.y_pos)/10;
        }
        this.prevent_exit();
        this.paddle_bounce(ball);
        
    }

    this.paddle_bounce = function(ball) {
        // context.fillStyle = "red";
        // context.fillRect(this.x_pos, this.y_pos, this.width/2 + ball.width/2, this.height/2 + ball.height/2);
        var x_dist = Math.abs(this.x_pos - ball.x_pos);
        var y_dist = Math.abs(this.y_pos - ball.y_pos);
        // If ball is at left or right side of paddle and
        // ball is between top and bottom parts of paddle,
        // then do a horizontal bounce.
        if (Math.abs(4 - x_dist) < this.width/2 + ball.width/2 &&
            y_dist < this.height/2 + ball.height/2) {
            ball.horizontal_wall_bounce();
            ball.x_vel *= 1.1;
            ball.y_vel *= 1.1;
        } 
        // Also, if ball is at top or bottom side of battle and
        // ball is between left and right sides of paddle, 
        // then do a vertical bounce and horizontal bounce.
        else if (Math.abs(4 - y_dist) < this.height/2 + ball.height/2 &&
                 x_dist < this.width/2 + ball.width/2) {
            ball.vertical_wall_bounce();
            ball.horizontal_wall_bounce();
        }
    }

    this.prevent_exit = function() {
        if (this.y_pos < this.top_border + this.height/2) {
            this.y_pos = this.top_border + this.height/2;
        } else if (this.y_pos > this.bottom_border - this.height/2) {
            this.y_pos = this.bottom_border - this.height/2;
        }

        if (this.x_pos < this.left_border + this.width/2) {
            this.x_pos = this.left_border + this.width/2;
        } else if (this.x_pos > this.right_border - this.width/2) {
            this.x_pos = this.right_border - this.width/2;
        }
    }

    this.draw = function() {
        centered_rect(this);
        cross_hairs(this);
    }
}

function ball(x_pos, y_pos) {
    this.x_pos = x_pos;
    this.x_vel = Math.random()*10 - 5;
    this.y_pos = y_pos;
    this.y_vel = Math.random()*10 - 5;
    this.width = 10;
    this.height = 10;
    this.top_border = 3
    this.bottom_border = canvas.height - 3;
    this.left_border = 3;
    this.right_border = canvas.width - 3;

    this.update = function() {
        this.move(this.x_vel, this.y_vel);
        this.prevent_exit();
        //this.width = Math.abs(Math.cos(ticks/1000) * 30);
        //this.height = Math.abs(Math.cos(ticks/1000) * 30);
    }

    this.move = function(x, y) {
        this.x_pos += x;
        this.y_pos += y;
    }

    this.prevent_exit = function() {
        if (this.y_pos < this.top_border + this.height/2) {
            this.vertical_wall_bounce();
            //this.y_pos = this.top_border + this.height/2;
        }

        if (this.y_pos > this.bottom_border - this.height/2) {
            this.vertical_wall_bounce();
            //this.y_pos = this.bottom_border - this.height/2;
        }

        if (this.x_pos < this.left_border + this.width/2) {
            this.horizontal_wall_bounce();
            //this.x_pos = this.left_border + this.width/2;
        }

         if (this.x_pos > this.right_border - this.width/2) {
            this.horizontal_wall_bounce();
            //this.x_pos = this.right_border - this.width/2;
        }
    }

    this.draw = function() {
        centered_rect(this);
        cross_hairs(this);
    }

    this.vertical_wall_bounce = function() {
        this.y_vel = -this.y_vel;
    }

    this.horizontal_wall_bounce = function() {
        this.x_vel = -this.x_vel;
    }
}

function goal(width, height, is_left) {
    this.width = width;
    this.height = height;

    if (is_left) {
        this.x_pos = this.width/2
    } else {
        this.x_pos = canvas.width - this.width/2
    }
    this.y_pos = canvas.height/2

    this.left_border = this.x_pos - this.width/2;
    this.right_border = this.x_pos + this.width/2;
    this.top_border = this.y_pos - this.height/2;
    this.bottom_border = this.y_pos + this.height/2;

    this.check_ball = function(ball) {
        if (Math.abs(this.x_pos - ball.x_pos) < this.width + ball.width/2 &&
            Math.abs(this.y_pos - ball.y_pos) < this.height + this.height/2) {
            this.reset_ball(ball);
        }
    }

    this.reset_ball = function(ball) {
        ball.x_pos = canvas.width/2;
        ball.y_pos = canvas.height/2;
        ball.x_vel = Math.random()*10 - 5;
        ball.y_vel = Math.random()*10 - 5;
    }
}

// TODO: move to super class?
function centered_rect(obj) {
    context.fillRect(obj.x_pos - obj.width/2, obj.y_pos - obj.height/2,
                     obj.width, obj.height);
}

// TODO: move to super class?
function cross_hairs(obj) {
    context.fillRect(0, obj.y_pos, canvas.width, 1);
    context.fillRect(obj.x_pos, 0, 1, canvas.height);
}

var ball = new ball(canvas.width/2, canvas.height/4);
var left_paddle = new paddle(true, canvas.height/2, true);
var right_paddle = new paddle(false, canvas.height/2, false);
var left_goal = new goal(10, canvas.height, true);
var right_goal = new goal(10, canvas.height, false);

function draw() {
    // Draw the background.
    // if (ticks % 100 == 0) {
    //     draw_background();
    // }
    
    
    left_paddle.draw();
    right_paddle.draw();
    ball.draw();
}

function draw_background() {
    context.fillStyle = "black"; 
    context.fillRect(0, 0, canvas.width, canvas.height);    
}

function getMousePosition(e) {
    // event.clientX and clientY return the
    // absolute position of the mouse in the entire window.
    // Thus we must take the difference between the window's position
    // and the canvas's position to get the canvas mouse position.
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

var ticks = 0;
function main() {
    context.fillStyle = "black";
    draw_background();
    context.fillStyle = "white";
    left_paddle.update(ball);
    right_paddle.update(ball);
    ball.update();
    left_goal.check_ball(ball);
    right_goal.check_ball(ball);

    draw();
    ticks += 1;
}

document.addEventListener("mousemove", function(e) {
    mousePos = getMousePosition(e);
}, false);

setInterval(main, 10);