var canvas = document.getElementById("pong_canvas");
var context = canvas.getContext("2d");
var mousePos = {x: 0, y: 0}

function paddle(is_left, y_pos, is_human) {
    this.width = 25;
    this.height = 100;

    // Coordinates refer to the upper left corner of the paddle.
    // IDEA: Change to exact center of paddle.
    if(is_left) {
        this.x_pos = 20;
    } else {
        this.x_pos = canvas.width - (this.width + 20)
    }
    this.y_pos = y_pos;
    this.is_human = is_human;

    // Maximum allowed distance to the edges.
    this.top_border = 10;
    this.bottom_border = canvas.height - (this.top_border + this.height);
    this.left_border = 20;
    this.right_border = 20;

    this.update = function() {
        if (is_human) {
            this.y_pos = mousePos.y - this.height/2 // Center paddle.
        } else {
            this.y_pos = canvas.height/2 + Math.cos(ticks/10)*canvas.height/4;
        }

        // Prevent paddle from leaving screen.
        // Remember that top = close to zero.
        if (this.y_pos < this.top_border) {
            this.y_pos = this.top_border
        }
        else if (this.y_pos > this.bottom_border) {
            this.y_pos = this.bottom_border;
        }
    }


    this.draw = function() {
        context.fillRect(this.x_pos, this.y_pos, this.width, this.height);
    }
}

function ball(x_pos, y_pos) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.width = 10;
    this.height = 10;
    this.top_border = 3;
    this.bottom_border = canvas.height - (this.height + 3);
    this.left_border = 3 + this.width;
    this.right_border = 3 - this.width;

    this.update = function() {
        this.move(20*Math.cos(ticks/5),20*Math.sin(ticks/10));
    }

    this.move = function(x, y) {
        this.x_pos += x;
        this.y_pos += y;
        if (this.y_pos < this.top_border) {
            this.y_pos = this.top_border;
        } else if (this.y_pos > this.bottom_border) {
            this.y_pos = this.bottom_border;
        }

        if (this.x_pos < this.left_border) {
            this.x_pos = this.left_border;
        } else if (this.x_pos < this.right_border) {
            this.x_pos = this.right_border
        }
    }

    this.draw = function() {
        context.fillRect(this.x_pos, this.y_pos, this.width, this.height);
    }
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
    document.addEventListener("mousemove", function(e) {
        mousePos = getMousePosition(e);
    }, false);
    left_paddle.update();
    right_paddle.update();
    ball.update();
    draw();
    ticks += 1;
}


setInterval(main, 50)