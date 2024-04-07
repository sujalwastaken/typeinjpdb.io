let kind = document.querySelector('.kind');
let element = document.querySelector('.bugfix');
let startTime = Date.now();

// Define global variables to hold configuration values
let easyVocabTime, easyKanjiTime, timeBeforeAutoGradingVocab, timeBeforeAutoGradingKanji;

// Retrieve configuration variables from Chrome Storage API
chrome.storage.sync.get([
    'easyVocabTime',
    'easyKanjiTime',
    'timeBeforeAutoGradingVocab',
    'timeBeforeAutoGradingKanji'
], function (result) {
    // Use the retrieved values or default values if they're not set
    easyVocabTime = result.easyVocabTime || 5;
    easyKanjiTime = result.easyKanjiTime || 3;
    timeBeforeAutoGradingVocab = result.timeBeforeAutoGradingVocab || 7;
    timeBeforeAutoGradingKanji = result.timeBeforeAutoGradingKanji || 3;
    let state = localStorage.getItem('state');
    var rrvbox = document.querySelector('.vbox');
    let rr = document.querySelector('.review-reveal');
    if (state==0 && rr) {
        showResults(rr);
    }else if(state==1 && rrvbox){
        showResults(rrvbox);
    }
});


if (document.getElementById('grade-p')!=null){
    document.addEventListener('keydown', function(event) {
        if (event.key == 'j' || event.key == 'J') {
            document.getElementById('grade-p').click();
        }
        if (event.key == 'l' || event.key == 'L') {
            document.getElementById('grade-f').click();
        }
    });
}

if (document.getElementById('grade-5')!=null){
    document.addEventListener('keydown', function(event) {
        if (event.key == 'j' || event.key == 'J') {
            document.getElementById('grade-3').click();
        }
        if (event.key == 'l' || event.key == 'L') {
            document.getElementById('grade-1').click();
        }
    });
}

function showResults(rrElement) {
    let tt = localStorage.getItem('timeTaken');
    let state = localStorage.getItem('state');
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.flexDirection = 'column'; // Arrange items in a column
    inputContainer.style.gap = '3px'; // Add gap between input fields
    inputContainer.style.padding = '0 10px'; // Add padding on both sides

    const heading = document.createElement('h7');
    heading.textContent = 'Your answers ' + tt/1000 + 's';
    inputContainer.appendChild(heading);

    const text1 = document.createElement('a');
    text1.textContent=localStorage.getItem('inputField1');
    const text2 = document.createElement('a');
    text2.textContent=localStorage.getItem('inputField2');
    
    if (state==0 && document.getElementById('grade-p')==null) {
        const readings = [];
        rrElement.querySelectorAll('div.plain[style="display: flex; align-items: baseline;"] ruby').forEach(ruby => {
            // Check if <ruby> has an <rt> child
            const rt = ruby.querySelector('rt');
            if (rt === null) {
                // If <ruby> doesn't have an <rt> child, add its text content
                readings.push(ruby.textContent);
            }
            else {
                // If <ruby> has an <rt> child, add the text content of <rt>
                readings.push(rt.textContent);
            }
        });
        
        // If there are no ruby elements, use text content within the plain class
        if (readings.length === 0) {
            rrElement.querySelectorAll('div.plain[style="display: flex; align-items: baseline;"] a.plain').forEach(anchor => {
                readings.push(anchor.textContent);
            });
        }
        
        const readingsString = readings.join('');
        let answer1 = readingsString==text1.textContent
        let answers2 = rrElement.querySelector('.subsection-meanings').querySelectorAll('.description');
        let answer2 = false;
        answers2.forEach(answer => {            
            if (answer.textContent.includes(text2.textContent) && (text2.textContent).length!=0) {
                answer2=true;
            }
        });
        if (answer1 && answer2) {
            if (tt/1000<easyVocabTime) {
                text1.style.color = 'rgba(59, 125, 239, 1)';
                text2.style.color = 'rgba(59, 125, 239, 1)';
                document.getElementById('grade-5').click();
            }else{
                text1.style.color = 'rgba(79, 168, 37, 1)';
                text2.style.color = 'rgba(79, 168, 37, 1)';
                document.getElementById('grade-4').click();
            }
        }
        else if ((text1.textContent).length==0 && (text2.textContent).length==0) {
            text1.style.color = 'rgba(255, 59, 59, 1)';
            text2.style.color = 'rgba(255, 59, 59, 1)';
            text1.textContent = 'no answer';
            text2.textContent = 'no answer';
            text1.style.textDecoration = "line-through";
            text2.style.textDecoration = "line-through";
            setTimeout(() => {
                document.getElementById('grade-1').click();
            }, timeBeforeAutoGradingVocab*1000);
        }
        else if (answer1 || answer2) {
            text1.style.color = 'rgba(223, 109, 43, 1)';
            text2.style.color = 'rgba(223, 109, 43, 1)';
            if (!answer1) {
                if ((text1.textContent).length == 0) {
                    text1.textContent = 'no answer';
                }
                text1.style.textDecoration = "line-through";
            }
            if (!answer2) {
                if ((text2.textContent).length == 0) {
                    text2.textContent = 'no answer';
                }
                text2.style.textDecoration = "line-through";
            }
            setTimeout(() => {
                document.getElementById('grade-3').click();
            }, timeBeforeAutoGradingVocab*1000);
        }
        else{
            text1.style.color = 'rgba(255, 59, 59, 1)';
            text2.style.color = 'rgba(255, 59, 59, 1)';
            if ((text1.textContent).length == 0) {
                text1.textContent = 'no answer';
            }
            if ((text2.textContent).length == 0) {
                text2.textContent = 'no answer';
            }
            text1.style.textDecoration = "line-through";
            text2.style.textDecoration = "line-through";
            setTimeout(() => {
                document.getElementById('grade-2').click();
            }, timeBeforeAutoGradingVocab*1000);
        }
        inputContainer.appendChild(text1);
        inputContainer.appendChild(text2);
        rrElement.appendChild(inputContainer);
    }
    else if(state==1 && document.getElementById('grade-p')==null){
        let answer=rrElement.querySelector('.hbox.wrap > div:nth-child(2) .subsection').textContent;
        console.log(answer);
        if (text1.textContent==answer) {
            if (tt/1000<easyKanjiTime) {
                text1.style.color = 'rgba(59, 125, 239, 1)';
                document.getElementById('grade-5').click();
            }else{
                text1.style.color = 'rgba(79, 168, 37, 1)';
                document.getElementById('grade-4').click();
            }
        }
        else if ((text1.textContent).length==0) {
            text1.style.color = 'rgba(255, 59, 59, 1)';
            text1.textContent = 'no answer';
            text1.style.textDecoration = "line-through";
            setTimeout(() => {
                document.getElementById('grade-1').click();
            }, timeBeforeAutoGradingKanji*1000);
        }
        else if (answer.includes(text1.textContent)) {
            text1.style.color = 'rgba(223, 109, 43, 1)';
            setTimeout(() => {
                document.getElementById('grade-3').click();
            }, timeBeforeAutoGradingKanji*1000);
        }
        else{
            text1.style.color = 'rgba(255, 59, 59, 1)';
            text1.style.textDecoration = "line-through";
            setTimeout(() => {
                document.getElementById('grade-2').click();
            }, timeBeforeAutoGradingKanji*1000);
        }
        inputContainer.appendChild(text1);
        rrElement.appendChild(inputContainer);
    }
}

if (kind) {
    if (kind.textContent=='Vocabulary') {
        // Create a container for the input fields
        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.flexDirection = 'column'; // Arrange items in a column
        inputContainer.style.gap = '3px'; // Add gap between input fields
        inputContainer.style.padding = '0 10px'; // Add padding on both sides
    
        const inputField1 = document.createElement('input');
        inputField1.type = 'text';
        inputField1.placeholder = 'Reading';
        inputField1.style.textAlign = 'center';
        inputField1.style.borderWidth = '3px';
        inputField1.style.backgroundColor = 'transparent';
        inputField1.style.fontSize = '17px';
        inputField1.style.color = 'rgba(255, 255, 255, 1)';
    
        const inputField2 = document.createElement('input');
        inputField2.type = 'text';
        inputField2.placeholder = 'Meaning';
        inputField2.style.textAlign = 'center';
        inputField2.style.borderWidth = '3px';
        inputField2.style.backgroundColor = 'transparent';
        inputField2.style.fontSize = '17px';
        inputField2.style.color = 'rgba(255, 255, 255, 1)';
    
        // Append input fields to the container
        inputContainer.appendChild(inputField1);
        inputContainer.appendChild(inputField2);
    
        // Insert the container before the answer button
        element.appendChild(inputContainer)
    
        inputField1.focus();
    
        // Add event listener to inputField1
        inputField1.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                inputField2.focus();
            }
        });
    
        // Add event listener to inputField2
        inputField2.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                document.getElementById('show-answer').click();
            }
        });
    
        document.getElementById('show-answer').addEventListener('click', function() {
            let endTime = Date.now();
            localStorage.setItem('state', 0);
            localStorage.setItem('inputField1', inputField1.value);
            localStorage.setItem('inputField2', inputField2.value);
            localStorage.setItem('timeTaken', endTime-startTime);
            var checkElementInterval = setInterval(function() {
                var rr = document.querySelector('.review-reveal');
                if(rr) {
                    clearInterval(checkElementInterval);
                    showResults(rr);
                }
                if (document.getElementById('grade-5')!=null){
                    document.addEventListener('keydown', function(event) {
                        if (event.key == 'j' || event.key == 'J') {
                            document.getElementById('grade-3').click();
                        }
                        if (event.key == 'l' || event.key == 'L') {
                            document.getElementById('grade-1').click();
                        }
                    });
                }
            }, 1); // Check every 1ms
        });
    
    }
    else {
        // Create a container for the input fields
        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.flexDirection = 'column'; // Arrange items in a column
        inputContainer.style.gap = '3px'; // Add gap between input fields
        inputContainer.style.padding = '0 10px'; // Add padding on both sides
    
        const inputField1 = document.createElement('input');
        inputField1.type = 'text';
        inputField1.placeholder = 'Keyword';
        inputField1.style.textAlign = 'center';
        inputField1.style.borderWidth = '3px';
        inputField1.style.backgroundColor = 'transparent';
        inputField1.style.fontSize = '17px';
        inputField1.style.color = 'rgba(255, 255, 255, 1)';
    
        // Append input fields to the container
        inputContainer.appendChild(inputField1);
    
        // Insert the container before the answer button
        element.appendChild(inputContainer)
    
        inputField1.focus();
    
        // Add event listener to inputField1
        inputField1.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                document.getElementById('show-answer').click();
            }
        });
    
        document.getElementById('show-answer').addEventListener('click', function() {
            let endTime = Date.now();
            localStorage.setItem('state', 1);
            localStorage.setItem('inputField1', inputField1.value);
            localStorage.setItem('timeTaken', endTime-startTime);
            var checkElementInterval = setInterval(function() {
                var rrvbox = document.querySelector('.vbox');
                if(rrvbox) {
                    clearInterval(checkElementInterval);
                    showResults(rrvbox);
                }
                if (document.getElementById('grade-5')!=null){
                    document.addEventListener('keydown', function(event) {
                        if (event.key == 'j' || event.key == 'J') {
                            document.getElementById('grade-3').click();
                        }
                        if (event.key == 'l' || event.key == 'L') {
                            document.getElementById('grade-1').click();
                        }
                    });
                }
            }, 1); // Check every 1ms
        });    
    }
}

var keysToDisable = [' '];

var disableKey = function(e) {
    if (keysToDisable.includes(e.key)) {
        e.stopImmediatePropagation();
    }
};

window.addEventListener('keydown', disableKey, true);
window.addEventListener('keypress', disableKey, true);
window.addEventListener('keyup', disableKey, true);
