import React from 'react';
import { Firebase, initFirebaseStuff, loginGoogle } from './logic/Firebase.js';
import firebase from 'firebase';

import './css/App.css';
import Quiz from './comps/Quiz';
import Dictionary from './comps/Dictionary';
import { cardEnlarge, cardFlip, CORRECT_COLOUR, INCORRECT_COLOUR, initCanvas, resizeCanvas, startFlashAnimation } from './logic/Animations.js';
import SOUNDS from './gfx/sounds';
import LoginScreen from './comps/login/LoginScreen';
import AppContent from './comps/AppContent.js';
import AppContext from './AppContext';
import Navigation from './comps/navigation/Navigation.js';

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

    this.dictRef = React.createRef();

    this.state = {
      conected: false,
      screen: 1,
      groups: [],
      dictionary: [],
      questions: [],
      counter: 0,
      isStarted: false,
      word: undefined,
      isCardFlipped: false,
      isEnlarged: false,
      edited: undefined,
      randomize: this.randomize,
      changeScreen: this.changeScreen,
      onAnswer: this.onAnswer,
      onCorrect: this.onCorrect,
      onWrong: this.onWrong,
      onChange: this.onChange,
      addWord: this.addWord,
      addGroup: this.addGroup,
      removeWords: this.removeWords,
      removeGroups: this.removeGroups,
      setQuestions: this.setQuestions,
      onEditEnter: this.onEditEnter,
      onEditDone: this.onEditDone,
      onGroupChange: this.onGroupChange,
    }

    initFirebaseStuff(() => this.setState({ conected: true }), (user) => {
      this.setState({ user });
    }, (dictionary) => {
      console.log("set dictionary");
      this.setState({ dictionary }, () => {
        this.setQuestions();
      })
    }, (groups) => {
      this.setState({ groups })
    }, () => {
      this.setState({ user: undefined });
    });
  }

  componentDidMount() {
    initCanvas();
    resizeCanvas();
  }

  setQuestions = () => {
    this.setState({ questions: [...this.state.dictionary], counter: this.state.dictionary.length }, () => {
      this.randomize();
    });
  }

  randomize = () => {
    if (this.state.questions.length > 0) {
      this.setState({ word: this.state.questions[Math.floor(Math.random() * this.state.questions.length)] }, () => { });
    }
    else {
      if (this.state.dictionary.length > 0) {
        this.setState({ questions: [...this.state.dictionary] }, () => {
          this.randomize();
        });
      }
    }
  }

  changeScreen = (screen) => {
    this.setState({ screen });
    if (this.dictRef.current)
      this.dictRef.current.state.endEdit();
  }

  onAnswer = (value) => {
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

  removeQuestion = (question, onRemoved) => {
    this.setState({ questions: this.state.questions.filter((v) => v.es != question.es) }, () => {
      onRemoved();
    });
  }

  onCorrect = () => {
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

  onWrong = (doRandomize) => {
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

  addWord = (word, callback) => {
    if (this.state.user && word && word.es && word.pl) {
      this.onEditDone(word);
      let filter = this.state.dictionary.filter((e) => e.es.trim() == word.es.trim());
      if (filter.length == 1) {
        Object.assign(filter[0], word);
        this.setState({ dictionary: [...this.state.dictionary] })
      }
      if (callback)
        callback();
      Firebase.database().ref(`dicts/${this.state.user}/${word.es.trim()}`).set(word);
    }
  }

  addGroup = (group, callback) => {
    if (this.state.user && group.title) {
      Firebase.database().ref(`groups/${this.state.user}`).push(group);
      if (callback)
        callback();
    }
  }

  removeWords = (words) => {
    if (this.state.user) {
      words.forEach((e) => {
        if (e.key) {
          Firebase.database().ref(`dicts/${this.state.user}/${e.key}`).set(null);
        }
      })
    }
  }

  removeGroups = (groups) => {
    if (this.state.user) {
      groups.forEach((g) => {
        if (g.key) {
          Firebase.database().ref(`groups/${this.state.user}/${g.key}`).set(null);
        }
      })
    }
  };

  onEditEnter = (word) => {
    if (word) {
      word.es = `${getDeterminer(word)} ${word.es}`;
      this.setState({ dictionary: [...this.state.dictionary] });
    }
  }

  onEditDone = (word) => {
    if (this.state.user && word) {
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
          Firebase.database().ref(`dicts/${this.state.user}/${word.key}`).set(copy);
      });
    }
  }

  onGroupChange = (group, obj) => {
    Object.assign(group, obj);
    this.setState({ groups: [...this.state.groups] }, () => {
      if (group.key) {
        let __copy = { ...group };
        delete __copy.key;
        Firebase.database().ref(`groups/${this.state.user}/${group.key}`).set(__copy);
      }
    });
  }

  onChange = (word, value) => {
    Object.assign(word, value);
    this.setState({ dictionary: [...this.state.dictionary] });
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <div id="container"
          onMouseDown={(e) => {
            if (e.target.id == "container" || e.target.id == "nav")
              if (this.dictRef.current)
                this.dictRef.current.state.endEdit();
          }}>
          <canvas style={{}}></canvas>
          <Navigation />
          <AppContent />
        </div >
      </AppContext.Provider>
    );
  }
}

export default App;