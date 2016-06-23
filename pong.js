var canvas = document.getElementById("pong_canvas");
var context = canvas.getContext("2d");
var i = 0;
var mousePos = {x: 0, y: 0}

function paddle(x_pos, y_pos, is_human) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.width = 25;
    this.height = 100;
    this.is_human = is_human;

    // Maximum allowed distance to the edges.
    this.min_y = 10;
    this.max_y = canvas.height - (10 + this.height);
    this.y_border = 50;

    this.draw = function() {
        context.fillStyle = "white";
        if (is_human) {
            this.y_pos = mousePos.y
        }
        if (this.y_pos > this.max_y) {
            this.y_pos = this.max_y;
        }
        else if (this.y_pos < this.min_y) {
            this.y_pos = this.min_y;
        }

        context.fillRect(this.x_pos, this.y_pos, this.width, this.height);
    }
}

var left_paddle = new paddle(15, canvas.height/2, true);
var right_paddle = new paddle(canvas.width - (25 + 15), canvas.height/2, false);

function draw() {
    // Draw the background.
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    white_width = canvas.width/4 + (Math.sin(i) * 100);
    heigh_width = canvas.height/4 + (Math.cos(i) * 100);
    context.fillRect(canvas.width/3, canvas.height/3, white_width, heigh_width);
    i = i + 0.01;

    left_paddle.draw();
    right_paddle.draw();
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


function main() {
    document.addEventListener("mousemove", function(e) {
        mousePos = getMousePosition(e);
    }, false);

    setInterval(draw, 50)
}
