// Declarations
const JSONInput = document.querySelector('#json__field')
const JSONOutput = document.querySelector('#json__output')
const CSVInput = document.querySelector('#csv__field')
const CSVOutput = document.querySelector('#csv__output')
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

  // Extract header from the first object in the array
  const header = Object.keys(jsonData[0]);
  csvContent += header.join(",") + "\n";

  // Iterate through each object in the array
  jsonData.forEach((item) => {
    // Extract values in the same order as the header
    const row = header.map((key) => item[key]);

    // Convert values to CSV format and append to the content
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
}



JSONInput.addEventListener('input', (e) => {
  try {
    const jsonData = JSON.parse(e.target.value);
    
    const csvData = jsonToCsv(jsonData);
    console.log(CSVOutput.textContent)
    CSVOutput.textContent = csvData;
  } catch (error) {
    // Handle invalid JSON input
    CSVOutput.value = 'Invalid JSON input. Please enter valid JSON data.';
    console.log('Another run')
    console.log(error)
    console.log('JSON string:', e.target.value);
  }
  console.log('Runs')
})

// Example usage:
// const jsonData = [
//   { name: "John", age: 30, city: "New York" },
//   { name: "Alice", age: 25, city: "San Francisco" },
//   // Add more objects as needed
// ];

// const csvData = jsonToCsv(jsonData);
// console.log(csvData);
