document.addEventListener('DOMContentLoaded', function () {
    const configForm = document.getElementById('configForm');
  
    configForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      // Get values from input fields
      const easyVocabTime = parseInt(document.getElementById('easyVocabTime').value);
      const easyKanjiTime = parseInt(document.getElementById('easyKanjiTime').value);
      const timeBeforeAutoGradingVocab = parseInt(document.getElementById('timeBeforeAutoGradingVocab').value);
      const timeBeforeAutoGradingKanji = parseInt(document.getElementById('timeBeforeAutoGradingKanji').value);
  
      // Save values to browser storage
      chrome.storage.sync.set({
        easyVocabTime: easyVocabTime,
        easyKanjiTime: easyKanjiTime,
        timeBeforeAutoGradingVocab: timeBeforeAutoGradingVocab,
        timeBeforeAutoGradingKanji: timeBeforeAutoGradingKanji
      }, function () {
        // Notify user that settings are saved
        alert('Settings saved successfully!');
      });
    });
  });
  