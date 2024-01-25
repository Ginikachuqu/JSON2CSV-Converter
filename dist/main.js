// Declarations
const JSONInput = document.querySelector('#json__field')
const JSONOutput = document.querySelector('#json__output')
const jsoncopyBtn = document.querySelector('.json__copy')
const CSVInput = document.querySelector('#csv__field')
const CSVOutput = document.querySelector('#csv__output')
const csvcopyBtn = document.querySelector('.csv__copy')
const svgBox = document.querySelector(".second__column");
const first__column = document.querySelector(".first__column");
const third__column = document.querySelector(".third__column");

// SVG box transition
svgBox.addEventListener("click", (e) => {
  svgBox.classList.toggle("rotate");
  first__column.classList.toggle('translate__first')
  third__column.classList.toggle('translate__third')
})

// Converter section
// function convertToJson(text) {
  
// }

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


JSONInput.addEventListener('input', (e) => {
  try {
    const jsonData = JSON.parse(e.target.value);
    
    const csvData = jsonToCsv(jsonData);

    CSVOutput.textContent = csvData;

  } catch (error) {
    // Handle invalid JSON input
    if (JSONInput.textContent = '') {
      return
    } else {
      CSVOutput.textContent = 'Invalid JSON input. Please enter valid JSON data.';
    }
    console.log(error)
  }
})

CSVInput.addEventListener('input', (e) => {
  try {
    const csvData = e.target.value;
    
    const jsonData = csvToJson(csvData);

    JSONOutput.textContent = JSON.stringify(jsonData);

  } catch (error) {
    // Handle invalid JSON input
    if (CSVInput.textContent = '') {
      return
    } else {
      JSONOutput.textContent = 'Invalid JSON input. Please enter valid JSON data.';
    }
    console.log(error)
  }
})


// Copy function
jsoncopyBtn.addEventListener('click', function() {

  // Select the text in the textarea
  JSONOutput.select();
  JSONOutput.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text to the clipboard
  document.execCommand('copy');

  // Deselect the textarea
  JSONOutput.setSelectionRange(0, 0);

  // Provide some feedback to the user (you can customize this part)
  alert('Text has been copied to the clipboard!');
});

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
});

