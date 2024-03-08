// Utility function to convert an array of objects to CSV string
export function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr);
    return array.map(it => {
      return Object.values(it).map(value => `"${value}"`).toString();
    }).join('\n');
  }
  
  // Function to trigger download of CSV file
  export function downloadCSV(csvString, filename) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }