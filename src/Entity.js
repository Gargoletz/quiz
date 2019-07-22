import { thisExpression } from "@babel/types";

var entities = [];
export { entities };

function setEntities(array) {
    entities = array;
}
export { setEntities }

export class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        entities.push(this);
        // console.log("new entity created!", this);
    }

    tick() { }
    update() { }
    draw(ctx) { }
}

export class Heart extends Entity {
    constructor(x, y, sprite) {
        super(x, y);
        this.speed = 8;
        this.sprite = sprite;
        this.image = Math.floor(Math.random() * (sprite.width / 64));
    }

    update() {
        this.y -= this.speed;

        if (this.y <= -50)
            this.destroyed = true;
    }

    draw(ctx) {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(this.sprite, 64 * this.image, 0, 64, 64, this.x, this.y, 64, 64);
    }
}

export class Confetti extends Entity {
    constructor(x, y, color) {
        super(x, y);

        this.particles = [];


        let pos = { x, y };
        new Particle(x, y);
        for (let i = 0; i < 100; i++) {
            new Particle(this.x, this.y, color);
        }
    }

    update() {

    }
}

let colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'];

export class Particle extends Entity {
    constructor(x, y, color) {
        super(x, y);

        this.angle = Math.floor(Math.random() * 360);
        this.speed = Math.random() * 5 + 3;

        this.velocity = { x: Math.cos(Math.PI / 180 * this.angle) * this.speed, y: Math.sin(Math.PI / 180 * this.angle) * this.speed }

        this.size = Math.floor(Math.random() * 10) + 4;

        this.color = `hsl(${color}, ${Math.floor(Math.random() * 20) + 80}%, ${Math.floor(Math.random() * 30) + 40}%)`;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.velocity.y += 0.1;

        let canvas = document.getElementsByTagName("canvas")[0];
        if (this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
            this.destroyed = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}