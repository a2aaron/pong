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
            this.y_pos = mousePos.y; // Center paddle.
        } else {
            this.y_pos = this.y_pos + (ball.y_pos - this.y_pos)/10;
        }

        this.prevent_exit();
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
    this.y_pos = y_pos;
    this.width = 10;
    this.height = 10;
    this.top_border = 3
    this.bottom_border = canvas.height - 3;
    this.left_border = 3;
    this.right_border = canvas.width - 3;

    this.update = function() {
        this.y_pos = canvas.height/2 + canvas.height * Math.sin(ticks/50);
        this.x_pos = canvas.width/2 + canvas.height * Math.cos(ticks/50); 
        this.prevent_exit();
    }

    this.move = function(x, y) {
        this.x_pos += x;
        this.y_pos += y;
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

var left_paddle = new paddle(true, canvas.height/2, true);
var right_paddle = new paddle(false, canvas.height/2, false);
var ball = new ball(canvas.width/2, canvas.height/4);

function draw() {
    // Draw the background.
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    left_paddle.draw();
    right_paddle.draw();
    ball.draw();
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

    left_paddle.update();
    right_paddle.update(ball);
    ball.update();
    draw();
    ticks += 1;
}

document.addEventListener("mousemove", function(e) {
    mousePos = getMousePosition(e);
}, false);

setInterval(main, 20);