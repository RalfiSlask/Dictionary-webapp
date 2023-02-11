
const font = document.querySelector(".font");
const font_icon = document.querySelector(".font-choice");
const section_main = document.querySelector(".section-main");
const slider = document.querySelector(".slider");
const moon = document.querySelector(".moon");
const dropdown = document.querySelector(".dropdown-content");
const dropdown_content = document.querySelectorAll(".fonts")
const word_section = document.querySelector(".word-section");
const search_button = document.querySelector(".search-btn");
const input = document.querySelector(".search");
const whoops = document.querySelector(".no-word");

// toggle visibility of the dropdown menu when clicking dropdown arrow
font_icon.onclick = () => {
    dropdown.classList.toggle("hidden");
}

// changing font-family of the whole page when clicking on each separate font in the dropdown menu
const changeFontFamily = () => {
    dropdown_content.forEach(item => {
        item.onclick = () => {
            if(item.innerHTML == "Serif") {
                section_main.style.fontFamily = "lora";
                font.innerHTML = "Serif";
            } else if(item.innerHTML == "Sans Serif") {
                section_main.style.fontFamily = "Inter";
                font.innerHTML = "Sans Serif";
            } else if(item.innerHTML == "Mono") {
                section_main.style.fontFamily = "inconsolata";
                font.innerHTML = "Mono";
            }
        }
    })
}

changeFontFamily();

// changing the color depending on the sliders value in the top right corner
const changeColor = () => {
        if(slider.value == 2) {
            document.body.style.backgroundColor = "#050505"; 
            document.body.style.color = "#FFFFFF"; 
            slider.style.backgroundColor = "#8F19E8";
            dropdown.style.color = "#2D2D2D";
            moon.style.color = "#8F19E8";

        } else {
            document.body.style.backgroundColor = "#FFFFFF";
            document.body.style.color = "#2D2D2D"; 
            slider.style.backgroundColor = "#2D2D2D";
            moon.style.color = "#757575";
        }
}

setInterval(changeColor, 0);

// if pressing Enter when in input we will call the API
input.addEventListener("keypress", (event) => {
  if(event.key == "Enter") {
    event.preventDefault();
    let endpoint = `${input.value}`;
    if(input.value.length < 1) {
      whoops.style.visibility = "visible";
      input.onfocus = () => {
        input.style.border = "1px solid red";
      }
    } else {
      whoops.style.visibility = "hidden";
  
    }
        const getWordDefinitions = async () => {
            const adress = `https://api.dictionaryapi.dev/api/v2/entries/en/`;
            const urlToFetch = `${adress}${endpoint}`;
            try {
                const response = await fetch(urlToFetch);
                if(response.ok) {
                    const jsonResponse = await response.json();
                    
                    // looping over the phonetics array in the API and finding the audio file
                    let audioarr = jsonResponse[0].phonetics 
                    let audio;
                    for(let i = 0; i < audioarr.length; i++) {
                      if(audioarr[i].audio.includes("https")) {
                        audio = audioarr[i].audio;
                      } else if(audioarr[i] == "") {
                        return audioarr[i];
                      }
                    }
                  
                    let nounArr = [];
                    let verbArr = [];
                    let exampleArr = [];
                    
                    for(let i = 0; i < jsonResponse.length; i++) {
                        // logic for finding different definitions if the word is uses as a noun
                        if(jsonResponse[i]?.meanings[0]?.partOfSpeech == "noun") {
                            let definition_array = jsonResponse[i].meanings[0].definitions;
                            for(let y = 0; y < definition_array.length; y++) {
                                nounArr.push(definition_array[y].definition);
                                exampleArr.push(definition_array[y].example);

                            }
                        } 
                        // logic for finding different definitions if the word is uses as a verb
                        if(jsonResponse[i]?.meanings[1]?.partOfSpeech == "verb") {     
                            let definition_array_verb = jsonResponse[i].meanings[1].definitions;
                            for(let y = 0; y < definition_array_verb.length; y++) {
                                verbArr.push(definition_array_verb[y].definition);
                                exampleArr.push(definition_array_verb[y].definition);
                            }
                        }
                        if(jsonResponse[i]?.meanings[0]?.partOfSpeech == "verb") {
                            let definition_array_verb = jsonResponse[i].meanings[0].definitions;
                            for(let y = 0; y < definition_array_verb.length; y++) {
                                verbArr.push(definition_array_verb[y].definition);
                                exampleArr.push(definition_array_verb[y].definition);
                            }
                        
                        }
                    }
                    
                    let example;
                    for(let i = 0; i < exampleArr.length; i++) {
                      if(exampleArr[i] != undefined) {
                        example = exampleArr[i]
                      }
                    }

                    // creating the variable for a random verb definition, only need one
                    let randomNumb = Math.floor(Math.random())
                    let verbDef = verbArr[randomNumb * verbArr.length];
                   
                    // generating an array with unique random numbers in it
                    const generateRandNumsArray = (count, max) => {
                      const rands = [];
                      const r = Math.floor(Math.random() * max)
                      while (rands.length < count) {
                        const r = Math.floor(Math.random() * max)
                        if(rands.indexOf(r) === -1) {
                          rands.push(r)
                        }
                      }
                      return rands;
                    }

                    let randNumbArr = (generateRandNumsArray(nounArr.length, nounArr.length))

                    // creating noun meaning variables from the first three indexes of the nounArray
                    const nounDefOne = nounArr[randNumbArr[0]];
                    const nounDefTwo = nounArr[randNumbArr[1]];
                    const nounDefThree = nounArr[randNumbArr[2]];
                    const synonyms = jsonResponse[0].meanings[0].synonyms[0];
                    const source = jsonResponse[0].sourceUrls;
                    const phonetic = jsonResponse[0].phonetic;
                    // appending the variables from the API to the HTML text down under
                    word_section.innerHTML = 
        `<div class="container-word">
        <div class="panel-word">
          <div class="word">${endpoint}</div>
          <div class="pronounce">/${phonetic}/</div>
        </div>
        <div class="panel-play">
          <svg xmlns="http://www.w3.org/2000/svg" class="play" width="75" height="75" viewBox="0 0 75 75"><g fill="currentcolor" fill-rule="evenodd"><circle cx="37.5" cy="37.5" r="37.5" opacity="0.25"/><path d="M29 27v21l21-10.5z"/></g></svg>
        </div>
      </div>
      <div class="panel-noun">
        <div class="word-class">noun</div>
        <div class="line"></div>
      </div>
      <section class="noun-container">
        <div class="heading">Meaning</div>
        <ul class="meaning-list">
          <li class="noun-one meaning">${nounDefOne}</li>
          <li class="noun-two meaning">${nounDefTwo}</li>
          <li class="noun-three meaning">${nounDefThree}</li>
        </ul>
        <div class="panel-synonyms">
          <div class="heading">Synonyms</div>
          <div class="synonym">${synonyms}</div>
        </div>
      </section>
        <div class="panel-verb">
          <div class="word-class">verb</div>
          <div class="line"></div>
        </div>
      <section class="verb-container">
        <div class="heading">Meaning</div>
          <ul class="meaning-list">
            <li class="meaning">${verbDef}</li>
          </ul>
        <div class="undertext">"${example}"</div>
      </section>
      <div class="line line--footer"></div>
      <div class="source-panel">
        <div class="source">Source</div>
        <a href=${source} class="link">${source}</a>
        <svg xmlns="http://www.w3.org/2000/svg" class="copy" width="14" height="14" viewBox="0 0 14 14"><path fill="none" stroke="#838383" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.09 3.545H2.456A1.455 1.455 0 0 0 1 5v6.545A1.455 1.455 0 0 0 2.455 13H9a1.455 1.455 0 0 0 1.455-1.455V7.91m-5.091.727 7.272-7.272m0 0H9m3.636 0V5"/></svg>
      </div>`

        // creating variables from the word-section that is created

        const meaning = document.querySelectorAll(".meaning");
        const word_containers = document.querySelectorAll(".word-class");
        const link = document.querySelector(".link");
        const copy = document.querySelector(".copy");
        const noun_two = document.querySelector(".noun-two");
        const noun_three = document.querySelector(".noun-three");
        const play = document.querySelector(".play");

        play.onhover = () => {

        }


        // hiding noun definitions in case the API data does not have enougn data points     
  
        if(nounDefTwo == undefined) {
          noun_two.classList.add("hidden")
        } 
        if(nounDefThree == undefined) {
          noun_three.classList.add("hidden")
        } 
        
        // changing the word section

        const changeColorWord = () => {
            meaning.forEach((item) => {
                if(slider.value == 2) {
                    item.style.color = "#FFFFFF";
                    dropdown.style.color = "#2D2D2D";
                    link.style.color = "#FFFFFF"
                } else {
                    item.style.color = "#2D2D2D";
                    link.style.color = "#2D2D2D"
                }
            })
            word_containers.forEach((wordclass) => {
                if(slider.value == 2) {
                    wordclass.style.color = "#FFFFFF";
                } else { 
                    wordclass.style.color = "#2D2D2D";
               }
            })
        }
        setInterval(changeColorWord, 0);

        // coping the link text when pressing the button besides it

        const copyText = () => {
          copy.onclick = () => {
            const copyContent = async () => {
              try {
                await navigator.clipboard.writeText(link.innerHTML);
                console.log("content copeid to clipboard")
              } catch(error) {
                console.log("Failed to copy", error)
              }
            }
            copyContent();
          }
        }
      copyText();
        
      // playing the audio when pressing the play button
     
      play.onclick = () => {
      let wordaudio = new Audio(audio)
      wordaudio.play();
      } 
                }
            } catch(error) {
                console.log(error)
            }
        }
        getWordDefinitions();
      }
})




