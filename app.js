import {Parse} from './parser.js';
import {Nokia,ToVcards} from './serializer.js';

document.getElementById('fileInput').addEventListener('change', function(event) {
  processFile();
});

function processFile() {
  const fileInput = document.getElementById('fileInput');
  if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = function(e) {
        let msg = "File processed."
        const vCardData = e.target.result;
        try {
          const parsedCards = Parse(vCardData);
          const nokiaJson = parsedCards.map(Nokia);
          const newVCardString = nokiaJson.map(ToVcards).join('');
          downloadVCard(newVCardString);
        } catch (error) {
          msg = "There was an error processing the file.";
        }
        document.getElementById('status').textContent = msg;
      };
      reader.onerror = function() {
          document.getElementById('status').textContent = 'Failed to read the file.';
      };
      reader.readAsText(file);
  } else {
      document.getElementById('status').textContent = 'Please select a file to process.';
  }
}

function downloadVCard(vCardString) {
  const blob = new Blob([vCardString], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'processed_vcards.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

