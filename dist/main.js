// Declarations - Selecting DOM elements
const JSONInput = document.querySelector('#json__field');
const JSONOutput = document.querySelector('#json__output');
const jsoncopyBtn = document.querySelector('.json__copy');
const jsonClearField = document.querySelector('#json__clear');
const CSVInput = document.querySelector('#csv__field');
const CSVOutput = document.querySelector('#csv__output');
const csvcopyBtn = document.querySelector('.csv__copy');
const csvClearField = document.querySelector('#csv__clear');

// File Inputs - Selecting file input elements
const jsonFileBtn = document.querySelector('.json__file');
const jsonFileInput = document.querySelector('#jsonfileInput');
const csvFileBtn = document.querySelector('.csv__file');
const csvFileInput = document.querySelector('#csvfileInput');

// Error alert - Selecting error message elements
const errorContainer = document.querySelector('.error__container');
const errorMessage = document.querySelector('.error__container-inner p');
const closeBtn = document.querySelector('.close__btn');

// Download buttons - Selecting download buttons
const downloadJsonButton = document.querySelector('.json__download');
const downloadCsvButton = document.querySelector('.csv__download');

// Field CTA - Selecting field call-to-action elements
const jsonCta = document.querySelector('.jsoncta');
const csvCta = document.querySelector('.csvcta');

// Fields - Selecting JSON and CSV field elements
const jsonField = document.querySelector('.json__field');
const csvField = document.querySelector('.csv__field');

// Set active field - Initializing activeField variable
let activeField = 'json';

// Display relevant field when JSON CTA is clicked
jsonCta.addEventListener('click', (e) => {
  if (activeField !== 'json') {
    activeField = 'json';

    // Activate field
    if (csvField.classList.contains('show')) {
      csvField.classList.remove('show');
      csvField.classList.add('hide');
      jsonField.classList.remove('hide');
      jsonField.classList.add('show');
    }
  }
});

// Event delegation for JSON section on input change
document.body.addEventListener('input', (e) => {
  if (activeField === 'json') {
    const target = e.target;

    // Check if the input element is related to JSON section
    if (target === JSONInput) {
      try {
        // Event listener for JSON textarea input change
        JSONInput.addEventListener('input', (e) => {
          try {
            // Parse JSON input and convert to CSV
            const jsonData = JSON.parse(e.target.value);
            const csvData = jsonToCsv(jsonData);
            
            // Display CSV data in the output textarea
            JSONOutput.textContent = csvData;
          } catch (error) {
            // Handle invalid JSON input
            if (JSONInput.textContent = '') {
              return;
            } else {
              JSONOutput.textContent = 'Invalid JSON input. Please enter valid JSON data.';
            }
          }
        });
      } catch (error) {
        // Handle parsing error
        errorMessage.textContent = 'Error parsing JSON';
        if (errorContainer.classList.contains('closed')) {
          errorContainer.classList.remove('closed');
          errorContainer.classList.add('open');
        }
      }
    }
  }
});

// Event delegation for JSON section on click
document.body.addEventListener('click', (e) => {
  if (activeField === 'json') {
    const target = e.target;

    // Check if the click target is related to JSON section
    if (target === jsoncopyBtn) {
      // Event listener for JSON copy button click
      jsoncopyBtn.addEventListener('click', function() {
        // Select and copy text from the output textarea
        JSONOutput.select();
        JSONOutput.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');

        // Deselect the textarea
        JSONOutput.setSelectionRange(0, 0);

        // Provide feedback to the user
        alert('Text has been copied to the clipboard!');
      });
    } else if (target === jsonClearField) {
      // Event listener for JSON clear button click
      jsonClearField.addEventListener('click', (e) => {
        // Clear JSON input and output textareas
        JSONInput.value = '';
        JSONOutput.value = '';
      });
    } else if (target === jsonFileBtn) {
      // Event listener for JSON file input button click
      jsonFileBtn.addEventListener('click', (e) => {
        jsonFileInput.click();
      });

      // Event listener for JSON file input change
      jsonFileInput.addEventListener('change', function (event) {
        const fileInput = event.target;
        const file = fileInput.files[0];

        if (file) {
          const allowedExtensions = ['json', 'txt'];
          const fileNameParts = file.name.split('.');
          const fileExtension = fileNameParts[fileNameParts.length - 1];

          if (allowedExtensions.includes(fileExtension.toLowerCase())) {
            // Read and parse JSON content from the selected file
            const reader = new FileReader();
            reader.onload = function (e) {
              const fileContent = e.target.result;

              try {
                // Parse JSON content
                const jsonData = JSON.parse(fileContent);

                // Convert to CSV
                const csvContent = jsonToCsv(jsonData);

                // Set textarea values
                JSONInput.value = JSON.stringify(jsonData, null, 2);
                JSONOutput.value = csvContent;
              } catch (error) {
                // Handle parsing error
                errorMessage.textContent = 'Error parsing JSON';
                if (errorContainer.classList.contains('closed')) {
                  errorContainer.classList.remove('closed');
                  errorContainer.classList.add('open');
                }
              }
            };

            reader.readAsText(file); // Read the file as text
          } else {
            // Handle invalid file format
            errorMessage.textContent = 'Invalid file format. Please select a .json, .csv, or .txt file.';
            if (errorContainer.classList.contains('closed')) {
              errorContainer.classList.remove('closed');
              errorContainer.classList.add('open');
            }
            // Clear the file input
            fileInput.value = '';
          }
        }
      });
    } else if (target === downloadJsonButton) {
      // Event listener for JSON download button click
      downloadJsonButton.addEventListener('click', () => {
        const jsonContent = JSONOutput.value;

        // Create a Blob containing the JSON data
        const blob = new Blob([jsonContent], { type: 'application/json' });

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);

        // Set the file name
        downloadLink.download = 'converted_data.json';

        // Append the link to the body
        document.body.appendChild(downloadLink);

        // Trigger the click event to start the download
        downloadLink.click();

        // Remove the link from the body
        document.body.removeChild(downloadLink);
      });
    }
  }
});

// Converter section - Functions for converting JSON to CSV and CSV to JSON

// Function to convert JSON to CSV
function jsonToCsv(jsonData) {
  // Check if jsonData is an array and has at least one object
  if (!Array.isArray(jsonData)) {
    jsonData = [jsonData];
  }

  // Initialize variables
  let csvContent = "";

  // Check if the array is empty
  if (jsonData.length === 0) {
    throw new Error('Invalid JSON data. The array is empty.');
  }

  // Function to flatten nested objects
  function flattenObject(obj, parentKey = '') {
    let result = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursively flatten nested objects
          Object.assign(result, flattenObject(obj[key], newKey));
        } else {
          result[newKey] = obj[key];
        }
      }
    }
    return result;
  }

  // Flatten the first object in the array to get header
  const flattenedHeader = flattenObject(jsonData[0]);
  const header = Object.keys(flattenedHeader);
  csvContent += header.join(",") + "\n";

  // Iterate through each object in the array
  jsonData.forEach((item) => {
    const flattenedItem = flattenObject(item);
    // Extract values in the same order as the header
    const row = header.map((key) => flattenedItem[key]);

    // Convert values to CSV format and append to the content
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
}

// Function to convert CSV to JSON
function csvToJson(csvData) {
  // Split the CSV data into rows
  const rows = csvData.split('\n');

  // Extract header from the first row
  const header = rows[0].split(',');

  // Initialize an array to store the JSON objects
  let jsonData = [];

  // Iterate through each row starting from the second row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(',');

    // Create an object to store the row data
    let rowData = {};

    // Iterate through each value in the row
    for (let j = 0; j < header.length; j++) {
      const keys = header[j].split('.');
      let currentObject = rowData;

      // Create nested objects if needed
      for (let k = 0; k < keys.length - 1; k++) {
        currentObject[keys[k]] = currentObject[keys[k]] || {};
        currentObject = currentObject[keys[k]];
      }

      // Assign the value to the corresponding property
      currentObject[keys[keys.length - 1]] = row[j];
    }

    // Add the row data to the array
    jsonData.push(rowData);
  }

  return jsonData;
}

// Event listener for closing the error message
closeBtn.addEventListener('click', (e) => {
  errorContainer.classList.remove('open');
  errorContainer.classList.add('closed');
});
