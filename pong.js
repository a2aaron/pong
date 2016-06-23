var canvas = document.getElementById("pong_canvas");
var canvas_width = canvas.width;
var canvas_height = canvas.height;
var context = canvas.getContext("2d");
var i = 0;

function paddle(x_pos, y_pos, is_human) {
    // Maximum allowed distance to the edges.
    this.min_y = 100;
    this.max_y = canvas_width - 100;
    this.y_border = 50;

    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.width = 25;
    this.height = 100;
    this.is_human = is_human;

    this.draw = function() {
        context.fillStyle = "white";
        context.fillRect(this.x_pos, this.y_pos, this.width, this.height);
    }
}

var left_paddle = new paddle(15, canvas_width/2, false);

function draw() {
    // Draw the background.
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas_width, canvas_height);
    context.fillStyle = "white";
    white_width = canvas_width/4 + (Math.sin(i) * 100);
    heigh_width = canvas_height/4 + (Math.cos(i) * 100);
    context.fillRect(canvas_width/3, canvas_height/3, white_width, heigh_width);
    i = i + 0.01;

    left_paddle.draw();
}




function main() {
    setInterval(draw, 25);
}