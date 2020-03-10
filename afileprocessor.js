// There are many different ways to do this.
// Another way I might have done this,
// would be to open the file with a file 
// pointer and read in one line at a time and 
// output each line to the proper file so
// I did not use up lots of memory pulling
// in large files. There are other refactor
// things I could do like using a map instead
// of a for loop for es6 convention.
// I just used stdin because it was fast when I started it.
// I'll probably change it to readline.

// Since this code only dealt with file
// processing there was no reason to
// use async/awaits.


const fs = require('fs');

let questions = [
  "\nWhere is the file located?",
  "\nWhat is the file format?\n1. CSV \n2. TSV",
  "\nHow many fields should each record contain?"
];
let currentQuestion = 1;
let answers = [];
let choice = undefined;
let theFile = undefined;
let outputFilename = undefined;


function askQuestion(index){
  console.log(questions[index]);
  process.stdout.write(`> `);
}

process.stdin.on('data', function(data){

  switch(currentQuestion){
    case 1:
      choice = data.toString().trim();

      if(choice == "q" || choice == "quit"){
        console.log(`Thank you, Goodbye...\n\n`)
        process.exit();  
      } else {
        console.log(`\nTrying to open ${choice}`);
        try {
          theFile = fs.readFileSync(choice, `utf8`);
          console.log(`Openned ${choice}\n\n`);

          answers.push(choice);
          currentQuestion++;
        } catch(err){
          console.log(` ${choice} can not be found, please try again or 'quit' \n`);
        }
        break;
      }

    case 2:
      currentQuestion++;
      choice = data.toString().trim();
      choice = parseInt(choice);

      if(!isNaN(choice)){
        if(choice === 1){
          console.log(`Ok, it's a cvs file\n`);
          answers.push(data);
        } else if(choice === 2){
          console.log(`Oh Boy, Tab separated file!\n`);
          answers.push(choice);
        } else {
          console.log(`Oops, pick 1 or 2 please!`);
          currentQuestion--;
        }
      } else {
        console.log(`Oops, pick 1 or 2 please!`);
        currentQuestion--;
      }
      break;

    case 3:
      choice = data.toString().trim();
      choice = parseInt(choice);

      if(!isNaN(choice)){
        console.log(`Alright, ${choice} fields\n\nOk processing the file....`);
        answers.push(choice);
        currentQuestion++;

        let inputFileRows = theFile.split('\n');
        let numberOfRows = inputFileRows.length;
        let splitter = `,`;
        let fileExtention = `.csv`;
        if(answers[1] === 2){
          splitter = `\t`;
          fileExtention = `.tsv`;
        }

        for(let i = 0; i < numberOfRows; i++){
          if(i === 0 || i === numberOfRows - 1) continue;
          let currentRow = inputFileRows[i];
          let currentFields = currentRow.split(splitter)
          
          if(currentFields.length === answers[2]){
            outputFilename = 'correct';
          } else {
            outputFilename = 'incorrect';
          }
          outputFilename += fileExtention;

          fs.appendFileSync(outputFilename,currentRow);
          fs.appendFileSync(outputFilename, `\n`);
        }
        console.log(`Pocessing complete.`);
        process.exit();

      } else {
        console.log(`please choose a number for how many fields you expect the file to have in a record:\n`);
      }
      break;

    default:
      console.log('uh this is bad!');
      process.exit();
  }

  if(currentQuestion < 4){
    askQuestion(answers.length);
  }
});

askQuestion(0);

process.stdin.setEncoding("utf8");
