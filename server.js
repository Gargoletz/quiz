const fs = require("fs");

let data = JSON.parse(fs.readFileSync("./overview.json"));

data = data.vocab_overview;

let words = [];
let groups = {};
for (let i = 0; i < data.length; i++) {
    let w = { 'word': data[i].word_string, 'skill': data[i].skill, }
    if (data[i].normalized_string != w.word)
        w.normal = data[i].normalized_string
    if (data[i].gender)
        w.gender = data[i].gender;

    words.push(w);

    //Sortowanie po grupie
    if (!groups[tokenize(data[i].skill)])
        groups[tokenize(data[i].skill)] = [];
    groups[tokenize(data[i].skill)].push(w);
}

function tokenize(str) {
    let t = str.trim().split(" ");
    if (t.length == 1)
        return (isNaN(t[0].charAt(t[0].length - 1))) ? t[0].trim() : t[0].substring(0, t[0].length - 1).trim();
    else {
        let str = "";
        for (let i = 0; i < t.length; i++) {
            (isNaN(t[i])) ? str += t[i] + " " : ""
        }
        return str.trim();
    }
}

// for (let i = 0; i < Object.keys(groups).length; i++) {
//     final[tokenize(Object.keys(groups)[i])] = [];
// }

// console.log(groups);

fs.writeFile("./formatted.json", JSON.stringify(groups, null, "\t"), (err)=>{
    if(err)
        console.log("lipa");
    else
        console.log("gucci gang");
    
})