// Utility function to convert an array of objects to CSV string
export function convertToCSV(arr) {

    // First, extract the keys (column headers) from the first object in the array
    // and create an array with these keys as the first element.
    const array = [Object.keys(arr[0])].concat(arr);

    // Map over the array, converting each object (and the initial array of keys)
    // into a CSV string.
    return array.map(it => {

      // For each item (either the array of keys or an object from the original array),
      // convert its values to a string, each value quoted to handle commas within values.
      // Then, convert this array of quoted strings into a comma-separated string.
      return Object.values(it).map(value => `"${value}"`).toString();
    }).join('\n'); // Join each item with a newline character to form the final CSV string
  }
  
  // Function to trigger download of CSV file
  export function downloadCSV(csvString, filename) {

    // Create a new Blob object representing the CSV data as a text file.
    // Specify the MIME type to be 'text/csv' to indicate it's a CSV file.
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a"); // Create an invisible <a> (anchor) element in the document.

    // Create a URL for the Blob object and set it as the href attribute of the link.
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url); // This URL represents the CSV data as a file.

    // Set the download attribute of the link with the desired filename.
    // This tells the browser to download the file when the link is clicked.
    link.setAttribute("download", filename);

    link.style.visibility = 'hidden'; // Make the link invisible as it's not meant to be seen by the user.

    // Append the link to the document body, click it to trigger the download,
    // and then remove it from the body.
    // This process effectively simulates a file download action.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }