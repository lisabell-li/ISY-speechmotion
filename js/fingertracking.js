var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

Leap.loop({frameEventName: "animationFrame"}, function(frame) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    frame.pointables.forEach(function(pointable) {
        var position = pointable.stabilizedTipPosition;
        var normalized = frame.interactionBox.normalizePoint(position);

        var x = ctx.canvas.width * normalized[0];
        var y = ctx.canvas.height * (1 - normalized[1]);

        ctx.beginPath();
        ctx.rect(x, y, 20, 20);
        ctx.fill();
    });
});