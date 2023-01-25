class Roulette {

    constructor(values) {
        this.options = values
        this.startAngle = 0;
        this.arc = Math.PI / (this.options.length / 2);
        this.spinTimeout = null;
        this.spinArcStart = 10;
        this.spinTime = 0;
        this.spinTimeTotal = 0;
        this.ctx;
        this.drawRouletteWheel();
        this.lastresultindex = undefined;
    }

    getColor(item) {
        let colors = ['#ff8906', '#f25f4c'];
        return colors[(item % 2 == 0) ? 0 : 1];
    }

    drawRouletteWheel() {
        this.canvas = document.getElementById("canvas");
        if (canvas.getContext) {
            var outsideRadius = 200;
            var textRadius = 160;
            var insideRadius = 125;

            this.ctx = canvas.getContext("2d");
            this.ctx.clearRect(0, 0, 500, 500);

            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;

            this.ctx.font = 'bold 15px Helvetica, Arial';

            for (var i = 0; i < this.options.length; i++) {
                var angle = this.startAngle + i * this.arc;
                //ctx.fillStyle = colors[i];
                this.ctx.fillStyle = this.getColor(i, this.options.length);

                this.ctx.beginPath();
                this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
                this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
                this.ctx.stroke();
                this.ctx.fill();

                this.ctx.save();
                this.ctx.shadowOffsetX = -1;
                this.ctx.shadowOffsetY = -1;
                this.ctx.shadowBlur = 0;
                this.ctx.shadowColor = "rgb(220,220,220)";
                this.ctx.fillStyle = "#fffffe";
                this.ctx.translate(250 + Math.cos(angle + this.arc / 2) * textRadius,
                    250 + Math.sin(angle + this.arc / 2) * textRadius);
                this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
                var text = this.options[i];
                this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
                this.ctx.restore();
            }

            //Arrow
            this.ctx.fillStyle = "#fffffe";
            this.ctx.beginPath();
            this.ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
            this.ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
            this.ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
            this.ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
            this.ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
            this.ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
            this.ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
            this.ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
            this.ctx.fill();
        }
    }

    spin() {

        if (this.lastresultindex != undefined) {
            this.reDraw();
        }
        this.spinAngleStart = Math.random() * 10 + 10;
        this.spinTime = 0;
        this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
        this.rotateWheel();


    }

    rotateWheel() {
        this.spinTime += 30;
        if (this.spinTime >= this.spinTimeTotal) {
            this.stopRotateWheel();
            return;
        }
        var spinAngle = this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
        this.startAngle += (spinAngle * Math.PI / 180);
        this.drawRouletteWheel();
        this.spinTimeout = setTimeout('roulette.rotateWheel()', 30);
    }

    stopRotateWheel() {
        clearTimeout(this.spinTimeout);
        var degrees = this.startAngle * 180 / Math.PI + 90;
        var arcd = this.arc * 180 / Math.PI;
        var index = Math.floor((360 - degrees % 360) / arcd);
        this.ctx.save();
        this.ctx.font = 'bold 30px Helvetica, Arial';
        var text = this.options[index];
        this.lastresultindex = index;
        this.ctx.fillText(text, 250 - this.ctx.measureText(text).width / 2, 250 + 10);
        this.ctx.restore();
    }

    reDraw() {
        this.options.splice(this.lastresultindex, 1);
        this.startAngle = 0;
        this.arc = Math.PI / (this.options.length / 2);
        this.spinTimeout = null;
        this.spinArcStart = 10;
        this.spinTime = 0;
        this.spinTimeTotal = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawRouletteWheel();
    }

    easeOut(t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

}


let roulette;


let html = `
<button type="button" onclick="roulette.spin()" class="btn btn-warning" style="color:#fffffe;background-color: #ff8906;">SPIN</button>
<canvas id="canvas" width="500" height="500"></canvas>
`;

function setroulette() {
    let partipants = document.getElementById("participants").value;
    document.getElementById('main').innerHTML = html;
    roulette = new Roulette(partipants.split(","));
}