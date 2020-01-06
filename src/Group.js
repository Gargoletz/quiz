import { Confetti } from './Entity.js';
import { startFlashAnimation } from './App';

class Group {
    constructor(app, name, translation, words, level, experience) {
        this.app = app;
        this.name = name;
        this.translation = translation;
        this.words = words;
        this.level = (!!level) ? level : 1;
        this.experience = (!!experience) ? experience : 0;
    }

    getAvalible() {
        return this.words.slice(0, this.level);
    }

    getWord() {
        let w = [];
        for (let i = 0; i < this.words.length; i++) {
            if (!this.words[i].done)
                w.push(this.words[i]);
        }
        this.word = w[Math.floor(Math.random() * w.length)];
        this.reload();
    }

    answer(val) {
        if (val.trim() == "") {
            this.cardFlip();
            return;
        }

        if (this.word.answer instanceof Array) {
            for (let i = 0; i < this.word.answer.length; i++) {
                if (this.word.answer[i].toLowerCase() == val.toLowerCase()) {
                    this.correct();
                    return;
                }
            }
            this.wrong();
        }
        else {
            if (val.toLowerCase() == this.word.answer.toLowerCase())
                this.correct();
            else
                this.wrong();
        }
    }

    //Handling correct answer
    async correct() {
        //Clearing input
        document.getElementById("quiz-input").value = ""

        //Removing word from list
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i] == this.word)
                this.words[i].done = true
        }

        //Score-bar animation
        let bar = document.getElementsByClassName("quiz-progress-bar")[0];
        bar.style.animation = "enlarge .2s";
        setTimeout(() => { bar.style.animation = "" }, 250);

        ////Adding score
        this.experience += 100;
        //Level up check
        if (this.experience >= 100) {
            this.level += 1;
            this.experience = 0;
            //Undone all words
            for (let i = 0; i < this.words.length; i++)
                this.words[i].done = false;
            //Score-icon animation
            let icon = document.getElementById("quiz-progress-icon");
            icon.style.animation = "enlarge-big .125s";
            setTimeout(() => { icon.style.animation = "" }, 250);
            //Confetti animation
            let iconBCR = icon.getBoundingClientRect();
            new Confetti(iconBCR.left + iconBCR.width / 2, iconBCR.top + iconBCR.height / 2, 69);
            //Showing popup
            this.showPopup(3000);
        }

        //Randomizing word
        this.getWord();
    }

    showPopup(duration, text) {
        let speech = document.getElementById("speech-content");
        if (speech) {
            if (text)
                speech.innerText = text;
            else
                document.getElementById("speech-bubble").innerText = "<Wiadomość>";
            speech.style.animation = "speech-show 1s";
            speech.style.animationFillMode = "forwards";
        }
        console.log(duration);
        setTimeout(() => { speech.style.animation = "speech-hide 1s" }, (duration) ? duration : 1000);
    }

    wrong() {
        //Flashing animation
        // this.app.flash.active = true;
        // this.app.flash.duration = 0;
        // this.app.flash.dir = 1;

        //Resetting heart cooldown
        // this.setState({ cooldown: 60 });

        //Clearing all entities
        // setEntities([]);

        startFlashAnimation();
        //Flipping card
        this.cardFlip();
    }

    async cardFlip() {
        let state = this.app.state.isCardFlipped;
        //If card is flipped when clicked randomize new word
        if (state) {
            this.app.state.lesson.getWord();
        }
        //Erasing value from input
        //Flipping the card state
        await this.app.setState({ isCardFlipped: true });

        if (!state) {
            setTimeout(() => {
                document.getElementById("quiz-input").value = ""
                this.app.setState({ isCardFlipped: false });
                this.getWord();
            }, 1600);
        }
    }

    async reload() {
        if (this.app) {
            let _grps = [...this.app.state.groups];
            for (let i = 0; i < _grps.length; i++) {
                if (_grps[i].name == this.name)
                    _grps[i] = this;
            }
            console.log(_grps)
            this.app.setState({ groups: _grps });
            // localStorage.setItem("groups", JSON.stringify(_grps));
            this.save(_grps);
        }
    }

    save(groups) {
        let data = [];
        for (let i = 0; i < groups.length; i++) {
            data.push({ name: groups[i].name, translation: groups[i].translation, words: groups[i].words, level: groups[i].level, experience: groups[i].experience });
        }
        localStorage.setItem("lessons", JSON.stringify(data));
    }
}

export default Group;