import React from 'react';
import Firebase from './logic/Firebase.js';
import firebase from 'firebase';

import './css/App.css';
import Quiz from './comps/Quiz';
import Dictionary from './comps/Dictionary';
import { cardEnlarge, cardFlip, CORRECT_COLOUR, INCORRECT_COLOUR, initCanvas, resizeCanvas, startFlashAnimation } from './logic/Animations.js';
import SOUNDS from './gfx/sounds';
import { Navigation } from './comps/navigation/Navigation.js';

export function getDeterminer(word) {
  if (word && word.gender) {
    if (word.plural)
      return (word.gender == "masculine") ? "los" : "las";
    else
      return (word.gender == "masculine") ? "el" : "la";
  }
  else
    return "";
}

class App extends React.Component {
  flash;
  constructor() {
    super();

    this.state = {
      screen: 1,
      dictionary: [],
      questions: [],
      counter: 0,
      isStarted: false,
      word: undefined,
      isCardFlipped: false,
      isEnlarged: false,
      edited: undefined
    }

    this.dictRef = React.createRef();

    this.randomize = this.randomize.bind(this);
    this.changeScreen = this.changeScreen.bind(this);
    this.onAnswer = this.onAnswer.bind(this);
    this.onCorrect = this.onCorrect.bind(this);
    this.onWrong = this.onWrong.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addWord = this.addWord.bind(this);
    this.setQuestions = this.setQuestions.bind(this);
    this.onEditEnter = this.onEditEnter.bind(this);
    this.onEditDone = this.onEditDone.bind(this);

    firebase.auth().onAuthStateChanged((a) => {
      if (a) {
        let uid = a.uid;
        console.log("logged in", { uid });
      }
    })

    firebase.auth().getRedirectResult().then((result) => {
      if (result && result.user && result.user.uid) {
        let uid = result.user.uid;
        console.log({ uid });
        firebase.database().ref(`users/${uid}`).set({ test: { string: 'User creating test!' } });
      }
    }).catch((reason) => {
      console.log("error", reason);
    })

    Firebase.database().ref("words").on("child_added", (a) => {
      let word = Object.assign(a.val(), { key: a.key });
      this.setState({ dictionary: [...this.state.dictionary, Object.assign(a.val(), { key: a.key })] }, () => {
        if (this.state.dictionary.length - 2 >= 0 && word.es.charAt(0) < this.state.dictionary[this.state.dictionary.length - 2].es.charAt(0)) {
          this.setState({
            dictionary: this.state.dictionary.sort((a, b) => {
              return (a.es.trim() < b.es.trim()) ? -1 : 1;
            })
          }, () => {
            if (!this.state.isStarted) {
              this.setQuestions();
            }
          })
        }
        else if (!this.state.isStarted) {
          this.setQuestions();
        }
      });
    })
  }

  login() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  setQuestions() {
    this.setState({ questions: [...this.state.dictionary], counter: this.state.dictionary.length }, () => {
      this.randomize();
    });
  }

  componentDidMount() {
    initCanvas();
    resizeCanvas();
  }

  randomize() {
    if (this.state.questions.length > 0) {
      this.setState({ word: this.state.questions[Math.floor(Math.random() * this.state.questions.length)] }, () => { });
    }
    else {
      this.setState({ questions: [...this.state.dictionary] }, () => {
        this.randomize();
      });
    }
  }

  changeScreen(screen) {
    this.setState({ screen });
    if (this.dictRef.current)
      this.dictRef.current.state.endEdit();
  }

  onAnswer(value) {
    if (!this.state.isCardFlipped) {
      if (!this.state.isStarted)
        this.setState({ isStarted: true });

      let answer = ((getDeterminer(this.state.word)) ? getDeterminer(this.state.word) + " " : "") + this.state.word.es.toLocaleLowerCase();

      if (answer.trim() == value.trim().toLocaleLowerCase()) {
        this.onCorrect();
      }
      else
        this.onWrong(value.trim().length > 0 ? true : false);
    }
  }

  removeQuestion(question, onRemoved) {
    this.setState({ questions: this.state.questions.filter((v) => v.es != question.es) }, () => {
      onRemoved();
    });
  }

  onCorrect() {
    this.removeQuestion(this.state.word, () => {
      if (SOUNDS.correct.paused)
        SOUNDS.correct.play();
      else
        SOUNDS.correct.currentTime = 0;
      startFlashAnimation(CORRECT_COLOUR);
      cardEnlarge(this);
      setTimeout(this.randomize, 250);
    });
  }

  onWrong(doRandomize) {
    if (doRandomize) {
      if (SOUNDS.incorrect.paused)
        SOUNDS.incorrect.play();
      else
        SOUNDS.incorrect.currentTime = 0;
      startFlashAnimation(INCORRECT_COLOUR);
    }
    cardFlip(this, () => {
      if (doRandomize) {
        this.randomize();
      }
    });
  }

  addWord(word, callback) {
    if (word && word.es && word.pl) {
      this.onEditDone(word);
      let filter = this.state.dictionary.filter((e) => e.es.trim() == word.es.trim());
      if (filter.length == 1) {
        Object.assign(filter[0], word);
        this.setState({ dictionary: [...this.state.dictionary] })
      }
      if (callback)
        callback();
      Firebase.database().ref(`words/${word.es.trim()}`).set(word);
    }
  }

  removeWords(words) {
    this.setState({
      dictionary: this.state.dictionary.filter((e) => !words.includes(e))
    }, () => {
      words.forEach((e) => {
        if (e.key) {
          Firebase.database().ref(`words/${e.key}`).set(null);
        }
      })
    });
  }

  onEditEnter(word) {
    if (word) {
      word.es = `${getDeterminer(word)} ${word.es}`;
      this.setState({ dictionary: [...this.state.dictionary] });
    }
  }

  onEditDone(word) {
    if (word) {
      let es = word.es.trim();
      let determiner = es.substring(0, es.indexOf(" ", 0)).trim().toLocaleLowerCase();
      word.es = es.substring(es.indexOf(" ") + 1, es.length).trim();
      console.log({ determiner }, word.es);
      if (["el", "la", "los", "las"].includes(determiner)) {
        console.log(determiner);
        word.plural = (determiner.length == 3);
        word.gender = (determiner == "el" || determiner == "los") ? "masculine" : "feminine"
      }
      else {
        delete word.gender;
        delete word.plural;
      }

      word.pl = word.pl.trim().toLocaleLowerCase();
      word.es = word.es.trim().toLocaleLowerCase();

      this.setState({ dictionary: [...this.state.dictionary.sort((a, b) => { return (a.es.trim() < b.es.trim()) ? -1 : 1; })] }, () => {
        let copy = { ...word };
        delete copy.key;
        if (word.key)
          Firebase.database().ref(`words/${word.key}`).set(copy);
      });
    }
  }

  onChange(word, value) {
    Object.assign(word, value);
    this.setState({ dictionary: [...this.state.dictionary] });
  }

  render() {
    return (
      <div id="container"
        onMouseDown={(e) => {
          if (e.target.id == "container" || e.target.id == "nav")
            if (this.dictRef.current)
              this.dictRef.current.state.endEdit();
        }}>
        <canvas style={{}}></canvas>
        <Navigation change={this.changeScreen} />
        {(this.state.screen == 0) ?
          <Quiz word={this.state.word} isEnlarged={this.state.isEnlarged} isFlipped={this.state.isCardFlipped} onAnswer={this.onAnswer} getProgress={() => {
            return ((this.state.counter - this.state.questions.length) / this.state.counter)
          }} getWordsLeft={() => this.state.questions.length}></Quiz>
          : <Dictionary ref={this.dictRef} dictionary={this.state.dictionary}
            onChange={(word, value, preventSending) => { this.onChange(word, value, preventSending) }}
            addWord={this.addWord}
            removeWords={(words) => { this.removeWords(words); }}
            onEditEnter={(word) => { this.onEditEnter(word); }}
            onEditDone={(word) => { this.onEditDone(word); }}
          ></Dictionary>}

      </div >
    );
  }
}

export default App;
