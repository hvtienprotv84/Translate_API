// selecting required elemeents:

const selectTags = document.querySelectorAll("select");
const translateButton = document.querySelector("#translate-button");
const fromInput = document.querySelector(".from-text");
const toInput = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const icons = document.querySelectorAll(".row i");

// pushing supported languages to each select tags
selectTags.forEach((selectTag,index) => {
    for(const language_code in languages){ 
        // selecting English by default FROM language, Vietnamese by default TO language 
        let selected;
        if(index == 0 && language_code == 'en-GB'){
            selected = 'selected';
        }
        else if(index == 1 && language_code == 'vi-VN'){
            selected = 'selected';
        }   

        // creating option tag for each select tag
        let optionTag = `<option value="${language_code}" ${selected}>${languages[language_code]}</option>`
        
        // adding options to select tag
        selectTag.insertAdjacentHTML("beforeend", optionTag);
    }
})

// sending request to api 
async function getDataFromAPI(url){
    let response = await fetch(url);

    if(response.status == 200){
        let json = (await response.json());
        return json;
    }

    throw new Error("unknown error");
}

translateButton.addEventListener("click", () => {
    let fromText = fromInput.value != "" ? fromInput.value : null,
    translateFrom = selectTags[0].value,
    translateTo = selectTags[1].value;

    let API_UEL = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${translateFrom}|${translateTo}`

    getDataFromAPI(API_UEL)
    .then(response => {
        console.log(response)
        console.log(response.responseData.translatedText)
        toInput.value = response.responseData.translatedText;
    })
})

// this function will triggered with clicking exchange icon
exchangeIcon.addEventListener("click", () => {
    let tempText, tempLang;
    // exchanging texts in textareas
    tempText = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = tempText;
    // exchanging languages in select tags
    tempLang = selectTags[0].value;
    selectTags[0].value = selectTags[1].value;
    selectTags[1].value = tempLang;
})

// copy and volume icons events
icons.forEach((icon) => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains('fa-copy')){
            if (target.id == 'from') {
                navigator.clipboard.writeText(fromInput.value);
            } else {
                navigator.clipboard.writeText(toInput.value);
            }
        }
        else {
            let utterance;
            if (target.id == 'from') {
                utterance = new SpeechSynthesisUtterance(fromInput.value);
                utterance.lang = selectTags[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toInput.value);
                utterance.lang = selectTags[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    })
})