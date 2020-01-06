import React from 'react';
import './css/App.css';
import Quiz from './Quiz';
import { isMethod, thisExpression } from '@babel/types';
import _hearts from './gfx/hearts.png';
import { COPYFILE_EXCL } from 'constants';
import _words from './data/words.js';
import { Heart, Confetti, entities, setEntities, Palabra } from './Entity.js';
import Tree from './Tree';
import Group from './Group';

let canvas, ctx;
let hearts;
let flash = { active: false, duration: 0, maxdur: 12, dir: 1 };
let words = {};
let words_backup;

export function startFlashAnimation() {
  flash.active = true;
  flash.duration = 0;
  flash.dir = 1;
}

export function playAnim(element, params, duration) {
  if (element) {

  }
}

class App extends React.Component {
  flash;
  constructor() {
    super();

    this.state = {
      screen: 0,
      word: { key: "", answer: "" },
      lesson: undefined,
      cooldown: 5,
      points: 0,
      level: 0,
      isCardFlipped: false
    }

    this.randomize = this.randomize.bind(this);
    this.setScreen = this.setScreen.bind(this);
  }

  async setScreen(screen, title) {
    await this.setState({ screen, lesson: title });
    this.randomize();
  }

  randomize() {
    if (this.state.lesson)
      this.state.lesson.getWord();
  }

  async componentDidMount() {
    //local storage setup
    // let lessons = localStorage.getItem("lessons");
    let _groups = [];
    if (!localStorage.getItem("lessons")) {
      localStorage.setItem("lessons", JSON.stringify(_words.groups));
    }
    let lessons = localStorage.getItem("lessons");

    if (lessons) {
      lessons = JSON.parse(lessons);
      for (let i = 0; i < lessons.length; i++) {
        _groups = [..._groups, new Group(this, lessons[i].name, lessons[i].translation, lessons[i].words, lessons[i].level, lessons[i].experience)];
        // await this.setState({ groups: [...this.state.groups, lessons[i]] });
        // console.log(lessons)
      }
      this.setState({ groups: _groups, lesson: _groups[0] });
    }
    else {
      localStorage.setItem("lessons", JSON.stringify(_words.groups));
      this.setState({ groups: _groups, lesson: _groups[0] });
    }

    canvas = document.getElementsByTagName("canvas")[0];
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let wrapper = document.getElementById("quiz-wrapper");
    // wrapper.style.height = canvas.height + "px";

    hearts = new Image();
    hearts.src = _hearts;

    window.addEventListener("resize", (e) => {
      if (document.getElementById("quiz-wrapper") != undefined)
        canvas.width = document.getElementById("quiz-wrapper").clientWidth;
      // canvas.height = document.getElementById("quiz-wrapper").clientHeight;
      tick();
    })

    let _app = this;

    let cldw = 0;
    function tick() {
      //Cleaning the screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //Flash animation computing
      if (flash.active) {
        ctx.fillStyle = `rgba(255, 0, 0, ${flash.duration / flash.maxdur})`;
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

      //Entities handling
      for (let i = 0; i < entities.length; i++) {
        entities[i].tick();
        entities[i].update();
        entities[i].draw(ctx);
      }

      //Removing toRemove entities
      let _temp = [];
      for (let i = 0; i < entities.length; i++) {
        if (!entities[i].destroyed)
          _temp.push(entities[i]);
        else {
          // console.log("entitiy destroyed!", entities[i]);
        }
      }
      setEntities(_temp);
    }

    setInterval(tick, 1000 / 60);
  }

  render() {
    return (
      <div style={{ position: "absolute", width: "100vw", height: "100%" }}>
        {/* <p style={{ position: "absolute", top: "0px", left: "8px"}}>{this.state.cooldown}|{this.state.amount}</p> */}
        <canvas style={{}}></canvas>
        {(this.state.screen == 0) ?
          <Tree groups={this.state.groups} setScreen={this.setScreen}></Tree>
          :
          (this.state.lesson) ? <Quiz group={this.state.lesson} setScreen={this.setScreen} isFlipped={this.state.isCardFlipped} onClick={this.state.lesson.cardFlip} word={this.state.word} answer={(val) => { this.state.lesson.answer(val) }} /> : ""}
      </div>
    );
  }
}

export default App;
