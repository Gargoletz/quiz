import React from 'react';
import './css/App.css';
import Quiz from './Quiz';
import Dictionary from './Dictionary';
import _hearts from './gfx/hearts.png';

import Firebase from './firebase.js';

import { cardEnlarge, cardFlip, CORRECT_COLOUR, INCORRECT_COLOUR, initCanvas, resizeCanvas, startFlashAnimation } from './Animations.js';

import correct_file from './gfx/correct.mp3';
import incorrect_file from './gfx/incorrect.mp3';

const correct_sound = new Audio(correct_file);
const incorrect_sound = new Audio(incorrect_file);

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
      screen: 0,
      dictionary: [],
      questions: [],
      counter: 0,
      isStarted: false,
      word: undefined,
      isCardFlipped: false,
      isEnlarged: false,
      edited: undefined
    }

    this.myRef = React.createRef();

    this.randomize = this.randomize.bind(this);
    this.onAnswer = this.onAnswer.bind(this);
    this.onCorrect = this.onCorrect.bind(this);
    this.onWrong = this.onWrong.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addWord = this.addWord.bind(this);
    this.setQuestions = this.setQuestions.bind(this);
    this.onEditEnter = this.onEditEnter.bind(this);
    this.onEditDone = this.onEditDone.bind(this);

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
      if (correct_sound.paused)
        correct_sound.play();
      else
        correct_sound.currentTime = 0;
      startFlashAnimation(CORRECT_COLOUR);
      cardEnlarge(this);
      setTimeout(this.randomize, 250);
    });
  }

  onWrong(doRandomize) {
    if (doRandomize) {
      if (incorrect_sound.paused)
        incorrect_sound.play();
      else
        incorrect_sound.currentTime = 0;
      startFlashAnimation(INCORRECT_COLOUR);
    }
    cardFlip(this, () => {
      if (doRandomize) {
        this.randomize();
      }
    });
  }

  addWord(word) {
    if (word && word.es && word.pl) {
      this.onEditDone(word);
      let filter = this.state.dictionary.filter((e) => e.es.trim() == word.es.trim());
      if (filter.length == 1) {
        Object.assign(filter[0], word);
        this.setState({ dictionary: [...this.state.dictionary] })
      }
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
        // word.es = es;
      }

      word.pl = word.pl.toLocaleLowerCase();
      word.es = word.es.toLocaleLowerCase();

      this.setState({ dictionary: [...this.state.dictionary.sort((a, b) => { return (a.es.trim() < b.es.trim()) ? -1 : 1; })] }, () => {
        let copy = { ...word };
        delete copy.key;
        if (word.key)
          Firebase.database().ref(`words/${word.key}`).set(copy);
      });
    }
  }

  onChange(word, value, preventSending) {
    // if (value.es != undefined) {
    //   let es = value.es;
    //   if (es.charAt(0) == "") {
    //     let _temp = "";
    //     for (let i = 0; i < es.length; i++) {
    //       if (es[i] != " ") {
    //         _temp = es.substring(i, es.length);
    //         break;
    //       }
    //     }
    //     es = _temp;
    //   }
    //   console.log(es);
    //   let determiner = es.substring(0, es.indexOf(" ", 0)).trim();
    //   value.es = es.substring(es.indexOf(" ") + 1, es.length);
    //   if (["el", "la", "los", "las"].includes(determiner)) {
    //     console.log(determiner);
    //     value.plural = (determiner.length == 3);
    //     value.gender = (determiner == "el" || determiner == "los") ? "masculine" : "feminine"
    //   }
    //   else {
    //     delete word.gender;
    //     delete word.plural;
    //     value.es = es;
    //   }
    // }

    Object.assign(word, value);
    this.setState({ dictionary: [...this.state.dictionary] });
  }

  render() {
    return (
      <div id="container"
        onMouseDown={(e) => {
          if (e.target.id == "container" || e.target.id == "quiz-navigation")
            this.myRef.current.state.endEdit();
        }}>
        <canvas style={{}}></canvas>
        <div id="quiz-navigation" className="">
          <div>
            <div className={"quiz-navigation-button " + ((this.state.screen == 0) ? "--active" : "")} onClick={() => { this.setState({ screen: 0 }); this.myRef.current.state.endEdit() }}>
              <img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9Il8xNC10ZXN0IiBkYXRhLW5hbWU9IjE0LXRlc3QiPjxnIGlkPSJnbHlwaCI+PHBhdGggZD0ibTE4NCAxMjRoMTQ0YTEyIDEyIDAgMCAwIDEyLTEydi01NmExMiAxMiAwIDAgMCAtMTItMTJoLTIxLjRhNTIuMDA4IDUyLjAwOCAwIDAgMCAtMTAxLjIgMGgtMjEuNGExMiAxMiAwIDAgMCAtMTIgMTJ2NTZhMTIgMTIgMCAwIDAgMTIgMTJ6bTcyLTgwYTEyIDEyIDAgMSAxIC0xMiAxMiAxMiAxMiAwIDAgMSAxMi0xMnoiLz48cGF0aCBkPSJtMTY4IDIyMGg0OGExMiAxMiAwIDAgMCAxMi0xMnYtNDhhMTIgMTIgMCAwIDAgLTEyLTEyaC00OGExMiAxMiAwIDAgMCAtMTIgMTJ2NDhhMTIgMTIgMCAwIDAgMTIgMTJ6bTEyLTQ4aDI0djI0aC0yNHoiLz48cGF0aCBkPSJtMTY4IDMyNGg0OGExMiAxMiAwIDAgMCAxMi0xMnYtNDhhMTIgMTIgMCAwIDAgLTEyLTEyaC00OGExMiAxMiAwIDAgMCAtMTIgMTJ2NDhhMTIgMTIgMCAwIDAgMTIgMTJ6bTEyLTQ4aDI0djI0aC0yNHoiLz48cGF0aCBkPSJtMjY0IDE3MmExMiAxMiAwIDAgMCAwIDI0aDcyYTEyIDEyIDAgMCAwIDAtMjR6Ii8+PHBhdGggZD0ibTMzNiAyNzZoLTcyYTEyIDEyIDAgMCAwIDAgMjRoNzJhMTIgMTIgMCAwIDAgMC0yNHoiLz48cGF0aCBkPSJtNDA0IDU2djI2NGE5OS4zOCA5OS4zOCAwIDAgMSA0OCAxMi4zdi0yNjQuM2EyNC4wMjcgMjQuMDI3IDAgMCAwIC0yNC0yNGgtMzZhMTIgMTIgMCAwIDEgMTIgMTJ6Ii8+PHBhdGggZD0ibTEyMCA0MjBhMTIgMTIgMCAwIDEgLTEyLTEydi0zNTJhMTIgMTIgMCAwIDEgMTItMTJoLTM1YTI0LjAyNyAyNC4wMjcgMCAwIDAgLTI0IDI0djM3NmEyNC4wMjcgMjQuMDI3IDAgMCAwIDI0IDI0aDIzMS4zYTk5LjM4IDk5LjM4IDAgMCAxIC0xMi4zLTQ4eiIvPjxwYXRoIGQ9Im00MDQgMzMyYTg4IDg4IDAgMSAwIDg4IDg4IDg4LjEgODguMSAwIDAgMCAtODgtODh6bTQ4LjQ4NSA3Mi40ODUtNDggNDhhMTIgMTIgMCAwIDEgLTE2Ljk3IDBsLTI0LTI0YTEyIDEyIDAgMCAxIDE2Ljk3LTE2Ljk3bDE1LjUxNSAxNS41MTQgMzkuNTE1LTM5LjUxNGExMiAxMiAwIDAgMSAxNi45NyAxNi45N3oiLz48L2c+PC9nPjwvc3ZnPg==" />
              <p>QUIZ</p>
            </div>
            <div className={"quiz-navigation-button " + ((this.state.screen == 1) ? "--active" : "")} onClick={() => { this.setState({ screen: 1 }) }}>
              <img src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTEyIDUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Im00NjQgMGgtMzc2Yy0zMC44NzggMC01NiAyNS4xMjItNTYgNTZ2NDAwYzAgMzAuODc4IDI1LjEyMiA1NiA1NiA1NmgzNzZjOC44MzYgMCAxNi03LjE2NCAxNi0xNiAwLTE0LjUyOSAwLTIwNC4yODEgMC00ODAgMC04LjgzNi03LjE2NC0xNi0xNi0xNnptLTE2IDQwMGgtMzIwdi0zNjhoMzIwem0tMzg0LTM0NGMwLTEzLjIzMyAxMC43NjctMjQgMjQtMjRoOHYzNjhjLTguODI1IDAtMTkuMTQ0LS43MzMtMzIgNS4zNzV6bTM4NCA0MjRoLTM2MGMtMTMuMjMzIDAtMjQtMTAuNzY3LTI0LTI0IDAtMTMuMjU0IDEwLjc0NS0yNCAyNC0yNGgzNjB6Ii8+PHBhdGggZD0ibTMxNC45NCAyNzEuMTc5YzguMzgyIDIuNzk3IDE3LjQ0NC0xLjczNSAyMC4yMzgtMTAuMTE5bDQuMzUzLTEzLjA2aDQwLjkzNmw0LjM1MyAxMy4wNmMyLjc5NCA4LjM4NCAxMS44NTUgMTIuOTE0IDIwLjIzOCAxMC4xMTkgOC4zODMtMi43OTQgMTIuOTE0LTExLjg1NSAxMC4xMTktMjAuMjM4LTcuMTkxLTIxLjU3My0xOC45LTU2LjctMjkuNDctODguNDExLTguMjEyLTI0LjYzOC00My4yLTI0LjY1My01MS40MTcgMC0zLjY0MSAxMC45MjItNS45MzQgMTcuODAzLTI5LjQ3IDg4LjQxMS0yLjc5MyA4LjM4MiAxLjczNyAxNy40NDQgMTAuMTIgMjAuMjM4em01NC44NjEtNTUuMTc5aC0xOS42MDJsOS44MDEtMjkuNDAzeiIvPjxwYXRoIGQ9Im0xNzYgMTIwaDEuNDQ4YzMuNDE4IDE4LjgxOCAxMi41MzggMzQuNzA2IDIzLjE3NCA0Ny41MjEtNi45NTQgNC42MjUtMTMuMjQ0IDguMjg4LTE3LjEwMyAxMC4zMzYtNy44MTEgNC4xMzItMTAuNzkzIDEzLjgxMy02LjY2MiAyMS42MjUgNC4xMzEgNy44MSAxMy44MTEgMTAuNzk1IDIxLjYyNSA2LjY2MiAyLjMwNi0xLjIyIDEzLjE3Ni03LjA5OSAyNS42OTMtMTUuOTMgMTIuODU3IDEwLjA4MiAyMy41NDUgMTUuNTM2IDI0LjY3IDE2LjA5OCA3LjkyMiAzLjk2IDE3LjQ4NC43MTkgMjEuNDMyLTcuMTMgMy45NjQtNy44ODEuNzg0LTE3LjQ5Mi03LjA4Ny0yMS40NzUtLjE3OC0uMDktNS45OTgtMy4wOTItMTMuNzkzLTguNjM0IDUuMjM1LTUuNDA2IDkuODc2LTExLjE3NiAxMy4yOC0xNy4xNjMgNC4zNjgtNy42ODEgMS42ODMtMTcuNDQ5LTUuOTk5LTIxLjgxNy03LjY4MS00LjM2Ny0xNy40NDgtMS42ODMtMjEuODE3IDUuOTk5LTIuMTYxIDMuNzk5LTUuMzY0IDcuNjg4LTkuMTU1IDExLjUwMy02LjYxNi03Ljg2OC0xMi4zNTgtMTcuMTI1LTE1LjM5Ny0yNy41OTRoNjEuNjkxYzguODM2IDAgMTYtNy4xNjQgMTYtMTZzLTcuMTY0LTE2LTE2LTE2aC0zMnYtOGMwLTguODM2LTcuMTY0LTE2LTE2LTE2cy0xNiA3LjE2NC0xNiAxNnY4aC0zMmMtOC44MzYgMC0xNiA3LjE2NC0xNiAxNnM3LjE2NCAxNS45OTkgMTYgMTUuOTk5eiIvPjwvZz48L3N2Zz4=" />
              <p>PALABRAS</p>
            </div>
            {/* <div className={"quiz-navigation-button " + ((this.state.screen == 2) ? "--active" : "")} onClick={() => { this.setState({ screen: 2 }) }}>
              <img src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTEyIDUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Im00NjQgMGgtMzc2Yy0zMC44NzggMC01NiAyNS4xMjItNTYgNTZ2NDAwYzAgMzAuODc4IDI1LjEyMiA1NiA1NiA1NmgzNzZjOC44MzYgMCAxNi03LjE2NCAxNi0xNiAwLTE0LjUyOSAwLTIwNC4yODEgMC00ODAgMC04LjgzNi03LjE2NC0xNi0xNi0xNnptLTE2IDQwMGgtMzIwdi0zNjhoMzIwem0tMzg0LTM0NGMwLTEzLjIzMyAxMC43NjctMjQgMjQtMjRoOHYzNjhjLTguODI1IDAtMTkuMTQ0LS43MzMtMzIgNS4zNzV6bTM4NCA0MjRoLTM2MGMtMTMuMjMzIDAtMjQtMTAuNzY3LTI0LTI0IDAtMTMuMjU0IDEwLjc0NS0yNCAyNC0yNGgzNjB6Ii8+PHBhdGggZD0ibTMxNC45NCAyNzEuMTc5YzguMzgyIDIuNzk3IDE3LjQ0NC0xLjczNSAyMC4yMzgtMTAuMTE5bDQuMzUzLTEzLjA2aDQwLjkzNmw0LjM1MyAxMy4wNmMyLjc5NCA4LjM4NCAxMS44NTUgMTIuOTE0IDIwLjIzOCAxMC4xMTkgOC4zODMtMi43OTQgMTIuOTE0LTExLjg1NSAxMC4xMTktMjAuMjM4LTcuMTkxLTIxLjU3My0xOC45LTU2LjctMjkuNDctODguNDExLTguMjEyLTI0LjYzOC00My4yLTI0LjY1My01MS40MTcgMC0zLjY0MSAxMC45MjItNS45MzQgMTcuODAzLTI5LjQ3IDg4LjQxMS0yLjc5MyA4LjM4MiAxLjczNyAxNy40NDQgMTAuMTIgMjAuMjM4em01NC44NjEtNTUuMTc5aC0xOS42MDJsOS44MDEtMjkuNDAzeiIvPjxwYXRoIGQ9Im0xNzYgMTIwaDEuNDQ4YzMuNDE4IDE4LjgxOCAxMi41MzggMzQuNzA2IDIzLjE3NCA0Ny41MjEtNi45NTQgNC42MjUtMTMuMjQ0IDguMjg4LTE3LjEwMyAxMC4zMzYtNy44MTEgNC4xMzItMTAuNzkzIDEzLjgxMy02LjY2MiAyMS42MjUgNC4xMzEgNy44MSAxMy44MTEgMTAuNzk1IDIxLjYyNSA2LjY2MiAyLjMwNi0xLjIyIDEzLjE3Ni03LjA5OSAyNS42OTMtMTUuOTMgMTIuODU3IDEwLjA4MiAyMy41NDUgMTUuNTM2IDI0LjY3IDE2LjA5OCA3LjkyMiAzLjk2IDE3LjQ4NC43MTkgMjEuNDMyLTcuMTMgMy45NjQtNy44ODEuNzg0LTE3LjQ5Mi03LjA4Ny0yMS40NzUtLjE3OC0uMDktNS45OTgtMy4wOTItMTMuNzkzLTguNjM0IDUuMjM1LTUuNDA2IDkuODc2LTExLjE3NiAxMy4yOC0xNy4xNjMgNC4zNjgtNy42ODEgMS42ODMtMTcuNDQ5LTUuOTk5LTIxLjgxNy03LjY4MS00LjM2Ny0xNy40NDgtMS42ODMtMjEuODE3IDUuOTk5LTIuMTYxIDMuNzk5LTUuMzY0IDcuNjg4LTkuMTU1IDExLjUwMy02LjYxNi03Ljg2OC0xMi4zNTgtMTcuMTI1LTE1LjM5Ny0yNy41OTRoNjEuNjkxYzguODM2IDAgMTYtNy4xNjQgMTYtMTZzLTcuMTY0LTE2LTE2LTE2aC0zMnYtOGMwLTguODM2LTcuMTY0LTE2LTE2LTE2cy0xNiA3LjE2NC0xNiAxNnY4aC0zMmMtOC44MzYgMC0xNiA3LjE2NC0xNiAxNnM3LjE2NCAxNS45OTkgMTYgMTUuOTk5eiIvPjwvZz48L3N2Zz4=" />
              <p>GRUPY</p>
            </div> */}
          </div>
        </div>
        {(this.state.screen == 0) ?
          <Quiz word={this.state.word} isEnlarged={this.state.isEnlarged} isFlipped={this.state.isCardFlipped} onAnswer={this.onAnswer} getProgress={() => {
            return ((this.state.counter - this.state.questions.length) / this.state.counter)
          }} getWordsLeft={() => this.state.questions.length}></Quiz>
          : <Dictionary ref={this.myRef} dictionary={this.state.dictionary}
            onChange={(word, value, preventSending) => { this.onChange(word, value, preventSending) }}
            addWord={(word) => { this.addWord(word); }}
            removeWords={(words) => { this.removeWords(words); }}
            onEditEnter={(word) => { this.onEditEnter(word); }}
            onEditDone={(word) => { this.onEditDone(word); }}
          ></Dictionary>}

      </div >
    );
  }
}

export default App;
