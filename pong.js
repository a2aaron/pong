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

    this.draw = function() {
        context.fillStyle = "white";
        if (is_human) {
            this.y_pos = mousePos.y - this.height/2 // Center paddle.
        }
        // Remember that top = close to zero.
        if (this.y_pos < this.top_border) {
            this.y_pos = this.top_border
        }
        else if (this.y_pos > this.bottom_border) {
            this.y_pos = this.bottom_border;
        }

        context.fillRect(this.x_pos, this.y_pos, this.width, this.height);
    }
}

var left_paddle = new paddle(true, canvas.height/2, true);
var right_paddle = new paddle(false, canvas.height/2, false);

function draw() {
    // Draw the background.
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
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
