import React from 'react';
import './css/App.css';
import Quiz from './Quiz';
import { isMethod, thisExpression } from '@babel/types';
import _hearts from './gfx/hearts.png';
import { COPYFILE_EXCL } from 'constants';
import _words from './words.js';
import { Heart, Confetti, entities, setEntities, Palabra } from './Entity.js';
import Tree from './Tree';

let canvas, ctx;
let hearts;
let flash = { active: false, duration: 0, maxdur: 12, dir: 1 };
let words = {};
let words_backup;

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      screen: 1,
      word: { key: "", answer: "" },
      cooldown: 5,
      points: 0,
      level: 0,
      isCardFlipped: false
    }

    this.randomize = this.randomize.bind(this);
    this.answer = this.answer.bind(this);
    this.correct = this.correct.bind(this);
    this.wrong = this.wrong.bind(this);
    this.spawn = this.spawn.bind(this);
    this.cardFlip = this.cardFlip.bind(this);
    this.setScreen = this.setScreen.bind(this);
  }

  setScreen(screen) {
    this.setState({ screen });
  }

  randomize() {
    let w = [];
    for (let i = 0; i < this.getWords().length; i++) {
      if (!this.getWords()[i].done)
        w.push(this.getWords()[i]);
    }
    this.setState({ word: w[Math.floor(Math.random() * w.length)] })
  }


  componentDidMount() {
    words.groups = [..._words.groups];
    for (let i = 0; i < words.groups.length; i++) {
      words.groups[i].length = words.groups[i].words.length;
    }
    let g = { name: "todos las palabras", translation: "wszystkie słowa", color: 325, words: [] }
    for (let i = 0; i < words.groups.length; i++) {
      for (let j = 0; j < words.groups[i].words.length; j++) {
        g.words.push(words.groups[i].words[j]);
      }
    }
    g.length = g.words.length;
    words.groups.push(g);
    this.randomize();

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

      // //Hearths spawn
      // cldw++;
      // if (cldw >= _app.state.cooldown) {
      //   _app.spawn(_app.state.level + 1);
      //   cldw = 0;
      // }
    }

    setInterval(tick, 1000 / 60);
  }

  //Spawning new hearths
  spawn(num) {
    for (let i = 0; i < num; i++) {
      if (entities.length < 500)
        new Palabra(Math.floor(Math.random() * (canvas.width + 50)) - 25, canvas.height + Math.floor(Math.random() * canvas.height));
        // new Heart(Math.floor(Math.random() * (canvas.width + 50)) - 25, canvas.height + Math.floor(Math.random() * canvas.height), hearts);
      else return
    }
  }

  //Checking the answer
  answer(val) {
    if (this.state.word.answer instanceof Array) {
      for (let i = 0; i < this.state.word.answer.length; i++) {
        if (this.state.word.answer[i].toLowerCase() == val.toLowerCase()) {
          this.correct();
          return;
        }
      }
      this.wrong();
    }
    else {
      if (val.toLowerCase() == this.state.word.answer.toLowerCase())
        this.correct();
      else
        this.wrong();
    }
    console.log(val, this.state.word.answer);
  }

  getGroup() {
    return (words.groups) ? words.groups[this.state.level] : [];
  }

  getWords() {
    return this.getGroup().words;
  }

  setWords(w) {
    words.groups[this.state.level].words = w;
  }

  //Handling correct answer
  async correct() {
    //Clearing input
    document.getElementById("quiz-input").value = ""

    //Removing word from list
    for (let i = 0; i < this.getWords().length; i++) {
      if (this.getWords()[i] == this.state.word)
        this.getWords()[i].done = true
    }

    //Score-bar animation
    let bar = document.getElementsByClassName("quiz-progress-bar")[0];
    bar.style.animation = "enlarge .2s";
    setTimeout(() => { bar.style.animation = "" }, 250);

    ////Adding score
    let points = this.state.points + 1;
    //Level up check
    console.log(this.getWords().length, 10, this.state.points);
    if (points >= Math.min(this.getGroup().length, 10)) {
      //Granting another level
      if (this.state.level + 1 < words.groups.length)
        await this.setState({ points: 0, level: this.state.level + 1 });
      else {
        for (let i = 0; i < this.getWords().length; i++)
          this.getWords()[i].done = false;
        await this.setState({ points: 0 });
      }
      //Undone all words
      for (let i = 0; i < this.getWords().length; i++)
        this.getWords()[i].done = false;

      //Score-icon animation
      let icon = document.getElementById("quiz-progress-icon");
      icon.style.animation = "enlarge-big .125s";
      setTimeout(() => { icon.style.animation = "" }, 250);
      //Confetti animation
      let iconBCR = icon.getBoundingClientRect();
      new Confetti(iconBCR.left + iconBCR.width / 2, iconBCR.top + iconBCR.height / 2, this.getGroup().color);
      //Showing popup
      this.showPopup();
    }
    else
      this.setState({ points })

    //Randomizing word
    this.randomize();
  }

  showPopup() {
    let popup = document.getElementsByClassName("quiz-popup")[0];
    popup.style.display = "block";
    popup.style.animation = "slidein 5s"
    popup.style.animationFillMode = "forwards";
    setTimeout(() => { popup.style.animation = ""; }, 5000);
  }

  wrong() {
    //Flashing animation
    flash.active = true;
    flash.duration = 0;
    flash.dir = 1;

    //Resetting heart cooldown
    // this.setState({ cooldown: 60 });

    //Clearing all entities
    setEntities([]);

    //Flipping card
    this.cardFlip();
  }

  async cardFlip() {
    let state = this.state.isCardFlipped;
    //If card is flipped when clicked randomize new word
    if (state) {
      this.randomize();
    }
    //Erasing value from input
    //Flipping the card state
    await this.setState({ isCardFlipped: !this.state.isCardFlipped });

    if (!state) {
      setTimeout(() => {
        document.getElementById("quiz-input").value = ""
        this.setState({ isCardFlipped: !this.state.isCardFlipped });
        this.randomize();
      }, 1600);
    }
  }

  render() {
    return (
      <div style={{ position: "absolute", width: "100vw", height: "100%" }}>
        {/* <p style={{ position: "absolute", top: "0px", left: "8px"}}>{this.state.cooldown}|{this.state.amount}</p> */}
        <canvas></canvas>
        {(this.state.screen == 0) ?
          <Tree setScreen={this.setScreen}></Tree>
          :
          <Quiz group={this.getGroup()} setScreen={this.setScreen} isFlipped={this.state.isCardFlipped} onClick={this.cardFlip} word={this.state.word} points={this.state.points} level={this.state.level} answer={(val) => { this.answer(val) }} />}
      </div>
    );
  }
}

export default App;
