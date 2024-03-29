// Declarations
const JSONInput = document.querySelector('#json__field')
const JSONOutput = document.querySelector('#json__output')
const jsoncopyBtn = document.querySelector('.json__copy')
const jsonClearField = document.querySelector('#json__clear')
const CSVInput = document.querySelector('#csv__field')
const CSVOutput = document.querySelector('#csv__output')
const csvcopyBtn = document.querySelector('.csv__copy')
const csvClearField = document.querySelector('#csv__clear')

// File Inputs
const jsonFileBtn = document.querySelector('.json__file')
const jsonFileInput = document.querySelector('#jsonfileInput')
const csvFileBtn = document.querySelector('.csv__file')
const csvFileInput = document.querySelector('#csvfileInput')

// Error alert
const errorContainer = document.querySelector('.error__container')
const errorMessage = document.querySelector('.error__container-inner p')
const closeBtn = document.querySelector('.close__btn')

// Download buttons
const downloadJsonButton = document.querySelector('.json__download');
const downloadCsvButton = document.querySelector('.csv__download');

// Field CTA
const jsonCta = document.querySelector('.jsoncta')
const csvCta = document.querySelector('.csvcta')

// Fields
const jsonField = document.querySelector('.json__field')
const csvField = document.querySelector('.csv__field')

// Set active field
let activeField = 'json'

// Display relevant field
jsonCta.addEventListener('click', (e) => {
  if (activeField !== 'json') {
    activeField = 'json'


    // Activate field
    if (csvField.classList.contains('show')) {
      csvField.classList.remove('show')
      csvField.classList.add('hide')
      jsonField.classList.remove('hide')
      jsonField.classList.add('show')
    }

  }
})

// Event delegation for JSON section
document.body.addEventListener('input', (e) => {
  if (activeField === 'json') {
    const target = e.target;

    // Check if the input element is related to JSON section
    if (target === JSONInput) {
      try {
        JSONInput.addEventListener('input', (e) => {
          try {
            const jsonData = JSON.parse(e.target.value);
            
            const csvData = jsonToCsv(jsonData);
        
            JSONOutput.textContent = csvData;
        
          } catch (error) {
            // Handle invalid JSON input
            if (JSONInput.textContent = '') {
              return
            } else {
              JSONOutput.textContent = 'Invalid JSON input. Please enter valid JSON data.';
            }
          }
        })
      } catch (error) {
        errorMessage.textContent = 'Error parsing JSON';
        if (errorContainer.classList.contains('closed')) {
          errorContainer.classList.remove('closed');
          errorContainer.classList.add('open');
        }
      }
    }
  }
});

document.body.addEventListener('click', (e) => {
  if (activeField === 'json') {
    const target = e.target;

    // Check if the click target is related to JSON section
    if (target === jsoncopyBtn) {
      // Copy function
      jsoncopyBtn.addEventListener('click', function() {

        // Select the text in the textarea
        JSONOutput.select();
        JSONOutput.setSelectionRange(0, 99999); // For mobile devices

        // Copy the selected text to the clipboard
        document.execCommand('copy');

        // Deselect the textarea
        JSONOutput.setSelectionRange(0, 0);

        // Provide some feedback to the user
        alert('Text has been copied to the clipboard!');
      });
    } else if (target === jsonClearField) {
      // Clear Fields
      jsonClearField.addEventListener('click', (e) => {
        JSONInput.value = ''
        JSONOutput.value = ''
      }, {once: true})
    } else if (target === jsonFileBtn) {

      // Read and convert files
      jsonFileBtn.addEventListener('click', (e) => {
        jsonFileInput.click()
      }, {once: true})

      jsonFileInput.addEventListener('change', function (event) {
        const fileInput = event.target;
        const file = fileInput.files[0];

        if (file) {
          const allowedExtensions = ['json', 'txt'];
          const fileNameParts = file.name.split('.');
          const fileExtension = fileNameParts[fileNameParts.length - 1];

          if (allowedExtensions.includes(fileExtension.toLowerCase())) {
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
                errorMessage.textContent = 'Error parsing JSON';
                if (errorContainer.classList.contains('closed')) {
                  errorContainer.classList.remove('closed');
                  errorContainer.classList.add('open');
                }
              }
            };

            reader.readAsText(file); // Read the file as text
          } else {
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
      // Download functions
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


csvCta.addEventListener('click', (e) => {
  if (activeField !== 'csv') {
    activeField = 'csv'

    // Activate field
    if (jsonField.classList.contains('show')) {
      jsonField.classList.remove('show')
      jsonField.classList.add('hide')
      csvField.classList.remove('hide')
      csvField.classList.add('show')
    }
  }
})

// Event delegation for CSV section
document.body.addEventListener('input', (e) => {
  if (activeField === 'csv') {
    const target = e.target;

    // Check if the input element is related to CSV section
    if (target === CSVInput) {
        CSVInput.addEventListener('input', (e) => {
          try {
            const csvData = e.target.value;
            
            const jsonData = csvToJson(csvData);
        
            CSVOutput.textContent = JSON.stringify(jsonData);
        
          } catch (error) {
            // Handle invalid JSON input
            if (CSVInput.textContent = '') {
              return
            } else {
              CSVOutput.textContent = 'Invalid JSON input. Please enter valid JSON data.';
            }
          }
        })
    }
  }
});


document.body.addEventListener('click', (e) => {
  if (activeField === 'csv') {
    const target = e.target;

    // Check if the click target is related to CSV section
    if (target === csvcopyBtn) {
      csvcopyBtn.addEventListener('click', function() {
        // Select the text in the textarea
        CSVOutput.select();
        CSVOutput.setSelectionRange(0, 99999); // For mobile devices
      
        // Copy the selected text to the clipboard
        document.execCommand('copy');
      
        // Deselect the textarea
        CSVOutput.setSelectionRange(0, 0);
      
        // Provide some feedback to the user (you can customize this part)
        alert('Text has been copied to the clipboard!');
      }, {once: true});
    } else if (target === csvClearField) {
      csvClearField.addEventListener('click', (e) => {
        CSVInput.value = ''
        CSVOutput.value = ''
      }, {once: true})
    } else if (target === csvFileBtn) {
      csvFileBtn.addEventListener('click', (e) => {
        csvFileInput.click()
        
      }, {once: true})
      
      csvFileInput.addEventListener('change', function(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];
      
        if (file) {
          const allowedExtensions = ['csv', 'txt'];
          const fileNameParts = file.name.split('.');
          const fileExtension = fileNameParts[fileNameParts.length - 1];
      
      
          if (allowedExtensions.includes(fileExtension.toLowerCase())) {
            
            const reader = new FileReader();
      
            reader.onload = function(e) {
              const fileContent = e.target.result;
              
              CSVInput.value = fileContent;

              const jsonData = csvToJson(fileContent);
              
              CSVOutput.value = JSON.stringify(jsonData, null, 2);
            };
      
            reader.readAsText(file); // Read the file as text
          } else {
            errorMessage.textContent = 'Invalid file format. Please select a .json, .csv, or .txt file.'
            if (errorContainer.classList.contains('closed')) {
              errorContainer.classList.remove('closed')
              errorContainer.classList.add('open')
            }
            // Clear the file input
            fileInput.value = '';
          }
        }
      });
    } else if (target === downloadCsvButton) {
      downloadCsvButton.addEventListener('click', () => {
        const csvContent = CSVOutput.value;
      
        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });
      
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
      
        // Set the file name
        downloadLink.download = 'converted_data.csv';
      
        // Append the link to the body
        document.body.appendChild(downloadLink);
      
        // Trigger the click event to start the download
        downloadLink.click();
      
        // Remove the link from the body
        document.body.removeChild(downloadLink);
      }, {once: true});
    }
  }
});

// Converter section
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

// CSV to JSON
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

// Error field
closeBtn.addEventListener('click', (e) => {
  errorContainer.classList.remove('open')
  errorContainer.classList.add('closed')
})