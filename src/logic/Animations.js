let canvas, ctx;
export const CORRECT_COLOUR = "149, 251, 149";
export const INCORRECT_COLOUR = "255, 100, 100";
let flash = { active: false, color: INCORRECT_COLOUR, duration: 0, maxdur: 12, dir: 1 };

export function initCanvas() {
    canvas = document.getElementsByTagName("canvas")[0];
    ctx = canvas.getContext("2d");

    window.addEventListener("resize", resizeCanvas);

    setInterval(() => {
        //Cleaning the screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Flash animation computing
        if (flash.active) {
            ctx.fillStyle = `rgba(${flash.color}, ${flash.duration / flash.maxdur})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            flash.duration += 1 * flash.dir;
            if (flash.duration >= flash.maxdur)
                flash.dir = -1;
            if (flash.duration <= 0) {
                flash.active = false;
                flash.duration = 0;
                flash.dir = 1;
            }
        }

        // //Entities handling
        // for (let i = 0; i < entities.length; i++) {
        //     entities[i].tick();
        //     entities[i].update();
        //     entities[i].draw(ctx);
        // }

        // //Removing toRemove entities
        // let _temp = [];
        // for (let i = 0; i < entities.length; i++) {
        //     if (!entities[i].destroyed)
        //         _temp.push(entities[i]);
        //     else {
        //         // console.log("entitiy destroyed!", entities[i]);
        //     }
        // }
        // setEntities(_temp);
    }, 1000 / 60);
}

export function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // if (document.getElementById("quiz-wrapper") != undefined) {
    //     console.log("resize")
    //     canvas.width = document.getElementById("quiz-wrapper").clientWidth;
    //     canvas.height = document.getElementById("quiz-wrapper").clientHeight;
    // }
}

export function startFlashAnimation(color) {
    flash.active = true;
    flash.duration = 0;
    flash.dir = 1;
    if(color)
        flash.color = color;
}

export async function cardFlip(app, onEnd) {
    if (!app.state.isCardFlipped) {
        app.setState({ isCardFlipped: true }, () => {
            setTimeout(() => {
                app.setState({ isCardFlipped: false }, () => {
                    setTimeout(() => {
                        onEnd();
                    }, 225);
                });
            }, 1000);
        });
    }
}

export function cardEnlarge(app, onEnd) {
    if (!app.state.isEnlarged) {
        app.setState({ isEnlarged: true }, () => {
            setTimeout(() => {
                app.setState({ isEnlarged: false }, () => {

                });
            }, 200);
        });
    }
}