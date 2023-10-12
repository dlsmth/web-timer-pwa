let recentSites = [];
let selectedSite = "";
let selectedTime = 0;
let errorMessage;
let darkModeFlag = true
let timerInterval;

const ERROR_URL = 'Please enter a valid web address.';
const ERROR_TIME = 'Please enter a time.';

const SUGGESTIONS1 = 'www.kusc.org';
const SUGGESTIONS2 = 'www.wnyc.org/streams/';
const SUGGESTIONS3 = 'www.bbc.co.uk/sounds/play/live:bbc_world_service';

// Colors

const darkModeBg = '#000000';
const darkModeText = '#cccccc';
const darkModeButton = '#3282b8';

const lightModeBg = '#ffffff';
const lightModeText = '#333333';
const lightModeButton = '#3282b8';


// Gets

const inputArea = document.getElementById('input-area');

const websiteUrl = document.getElementById('website-url');

const urlErrorMessage = document.getElementById('url-error-message');

const suggestionsArea = document.getElementById('suggestions');

const suggestionsLink = document.getElementById('suggestions-link');

const quickStartArea = document.getElementById('quick-start-area');

const quickStartBtn1 = document.getElementById('quick-start-btn1');
const quickStartBtn2 = document.getElementById('quick-start-btn2');
const quickStartBtn3 = document.getElementById('quick-start-btn3');

const pickerArea = document.getElementById('picker-area');

const timeErrorMessage = document.getElementById('time-error-message');

const startTimerBtn = document.getElementById('start-timer-btn');

const darkModeArea = document.getElementById('dark-mode-area');

const learnMoreBtn = document.getElementById('learn-more-link');

const learnMoreArea = document.getElementById('learn-more-area');

const learnMoreModal = document.getElementById('learn-more-modal');

const lmCloseBtn = document.getElementById('lm-close-btn');

const sessionModal = document.getElementById('session-modal');

const sCloseBtn = document.getElementById('s-close-btn');

const sessionCountdown = document.getElementById('session-modal-title');

const sessionIFrame = document.getElementById('session-iframe');

const darkModeToggle = document.getElementById('dm-toggle');

const hOneText = document.getElementsByName('h1');

const suggestionLink1 = document.getElementById('suggestion-link-1');

const suggestionLink2 = document.getElementById('suggestion-link-2');

const suggestionLink3 = document.getElementById('suggestion-link-3');

// Listeners

startTimerBtn.addEventListener('click', startButtonPressed);

quickStartBtn1.addEventListener('click', () => {
  let time = 30;
  startButtonPressed(selectedSite, time);
});

quickStartBtn2.addEventListener('click', () => {
  let time = 60;
  startButtonPressed(selectedSite, time);
});

quickStartBtn3.addEventListener('click', () => {
  let time = 120;
  startButtonPressed(selectedSite, time);
});

suggestionsLink.addEventListener('click', openLearnMoreModal);

learnMoreBtn.addEventListener('click', openLearnMoreModal);

lmCloseBtn.addEventListener('click', closeLearnMoreModal);

sCloseBtn.addEventListener('click', endSession);

darkModeToggle.addEventListener('change', modeSwitch);

suggestionLink1.addEventListener('click', () => {
  loadSuggestion(SUGGESTIONS1);
});

suggestionLink2.addEventListener('click', () => {
  loadSuggestion(SUGGESTIONS2);
});

suggestionLink3.addEventListener('click', () => {
  loadSuggestion(SUGGESTIONS3);
});

// Input Value

// $(document).on('input', 'input[name="website-url"]', function() {
//   // Set the value into $value.
//   selectedSite = $(this).val();
//   console.log(selectedSite);
// });

$('#website-url').on('change', function(){
  selectedSite = $(this).val();
  console.log(selectedSite);
 })

// Dropdown Value

$(document).ready(function(){
  $("#timeOptions a").click(function(){
      $("#chooseTimeBtn").text($(this).text());
  });
});

$(document).ready(function() {
  $("#timeOptions li").click(function() {
      selectedTime = $(this).attr('data-value');
      resetError();
      console.log(selectedTime);
  });
});

// Functions

function getRecentSites() {

  const recentUl = document.querySelector('#dropdown-ul');

  while( recentUl.firstChild ){
    recentUl.removeChild( recentUl.firstChild );
  }

  const reversedRecentSites = recentSites.reverse();

  for (const site of recentSites) {
    const newLi = document.createElement('li');
    const newText = document.createTextNode(site);
    newLi.appendChild(newText);
    newLi.addEventListener('click', () => {
      loadRecent(site);
    });
    recentUl.appendChild(newLi);
  }

  if (recentSites.length === 0) {
    const newLi = document.createElement('li');
    const newText = document.createTextNode('You have no recent sites.');
    newLi.appendChild(newText);
    recentUl.appendChild(newLi);
  }
}

function loadRecent(url) {
  console.log(`${url} clicked.`);
  websiteUrl.value = url;
  selectedSite = url;
}

function loadSuggestion(url) {
  console.log(`${url} clicked.`);
  websiteUrl.value = url;
  selectedSite = url;
  resetError();
  closeLearnMoreModal();
}

function startButtonPressed(url, time) {
  console.log("Start Timer button pressed.");
  console.log(`Selected site: ${url}`);
  console.log(`Selected time: ${time}`);
  time ? selectedTime = time : selectedTime = selectedTime;

  errorCheck(selectedSite, selectedTime)
}

function errorCheck(url, time) {
  if (url == '') {
    urlErrorMessage.innerHTML = ERROR_URL;
    urlErrorMessage.style.display = 'block';
    inputArea.style.borderWidth = '1px';
    return;
  } else {
    urlErrorMessage.style.display = 'none';
    inputArea.style.borderWidth = '0px';
  }

  if (time < 1) {
    timeErrorMessage.innerHTML = ERROR_TIME;
    timeErrorMessage.style.display = 'block';
    pickerArea.style.borderWidth = '1px';
    return;
  } else {
    timeErrorMessage.style.display = 'none';
    pickerArea.style.borderWidth = '0px';
  }

  addRecent(url);
  startSession(url, time);
  clearUI();
}

function resetError() {
  inputArea.style.borderWidth = '0px';
  urlErrorMessage.style.display = 'none';
  pickerArea.style.borderWidth = '0px';
  timeErrorMessage.style.display = 'none';
}

function clearUI() {
  resetError();
  websiteUrl.value = '';
  document.getElementById('timeOptions').selectedIndex = 0;
  
}

function startSession(url, time) {
  learnMoreArea.style.display = 'none';
  darkModeArea.style.display = 'none';
  sessionModal.style.transform = 'translateY(0vh)';
  time = 60 * time;
  startTimer(url, time, sessionCountdown);
  // openSessionModal(time);
}

// function openSessionModal(time) {
//   learnMoreArea.style.display = 'none';
//   darkModeArea.style.display = 'none';
//   // let sessionCountdown = document.getElementById('session-modal-title').innerText = `${time}:00`;
//   // document.getElementById('session-modal-url').innerHTML = url;
//   // document.getElementById('session-modal-time').innerHTML = time;
//   sessionModal.style.transform = 'translateY(0vh)';
//   time = 60 * time;
//   startTimer(time, sessionCountdown);
// }

// function stopTimer() {
//   clearInterval(timerInterval);
//   console.log("ClearInterval fired.");
// }

function startTimer(url, duration, display) {

  sessionIFrame.src = `https://${url}`;

  let timer = duration, minutes, seconds;

  timerInterval = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.innerText = minutes + ":" + seconds;

      if (--timer < 0) {
          timer = duration;
          console.log('Timer is done.');
          endSession();          
      }
  }, 1000);

}


function endSession() {
  clearInterval(timerInterval);
  sessionIFrame.src = 'about: blank';
  closeSessionModal();
}

function openLearnMoreModal() {
  learnMoreArea.style.display = 'none';
  darkModeArea.style.display = 'none';
  learnMoreModal.style.transform = 'translateY(0vh)';
}

function closeLearnMoreModal() {
  learnMoreArea.style.display = 'block';
  darkModeArea.style.display = 'block';
  learnMoreModal.style.transform = 'translateY(100vh)';
}

function closeSessionModal() {
  sessionIFrame.src = 'about: blank';
  sessionModal.style.transform = 'translateY(100vh)';
  learnMoreArea.style.display = 'block';
  darkModeArea.style.display = 'block';

  // document.getElementById('session-iframe').src = 'about:blank';
  // $('#session-iframe').remove();

  // getRecentSites();
  // checkSuggestions();

  clearUI();
}

function checkSuggestions() {
  console.log(recentSites.length);
  if (recentSites.length < 3) {
    suggestionsArea.style.display = 'block';
    quickStartArea.style.display = 'none';
  } else {
    suggestionsArea.style.display = 'none';
    quickStartArea.style.display = 'block';
  }
}

function modeSwitch() {
  if (darkModeFlag) {
    console.log("Changing to Light Mode.");
    darkModeFlag = false;
    document.body.style.backgroundColor = lightModeBg;
    $('.mode-class').css({'color' : lightModeText});
    $('#start-timer-btn').css({'background' : lightModeButton});
    // document.getElementById("start-timer-btn").style.background = lightModeButton;

  } else {
    console.log("Changing to Dark Mode.");
    darkModeFlag = true;
    document.body.style.backgroundColor = darkModeBg;
    $('.mode-class').css({'color' : darkModeText});
    $('#start-timer-btn').css({'background' : darkModeButton});
    // document.getElementById("start-timer-btn").style.background = darkModeButton;
  }

  // darkModeFlag ? !darkModeFlag : darkModeFlag;

  darkModeFlag ? console.log("Dark Mode On.") : console.log("Dark Mode Off.")
}

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

function startUp() {

  console.log('Starting up...');

  let localCheck = localStorage.getItem('recentsites');
  localCheck ? false : localStorage.setItem('recentsites', JSON.stringify(recentSites));
  recentSites = JSON.parse(localStorage.getItem('recentsites'));

  getRecentSites();
  checkSuggestions();
}

function addRecent(newSite) {

  if (!recentSites.includes(newSite)) {
    recentSites.push(newSite);
  } else {
    recentSites.splice(recentSites.indexOf(newSite), 1);
    recentSites.push(newSite);
    }

  if (recentSites.length === 10) {
    recentSites.shift();
  }

  localStorage.setItem('recentsites', JSON.stringify(recentSites));

  getRecentSites();
  checkSuggestions();
}

window.onload = startUp();