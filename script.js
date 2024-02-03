const fileInput = document.querySelector(".file-input");
const requestUrl = 'http://127.0.0.1:5000/scraper'
let myArray = [];

// functions ---------------------------------
function validateFileExtension(filename) {
    ext = filename.split('.').pop();
    if (ext == 'csv') {
        return true
    } else {
        return false
    }
}

function getHeaderIndex(csvHeader, headerName) {
    let headerIdx = undefined;
    for (let i = 0; i < csvHeader.length; i++) {
        headerItem = csvHeader[i].replace(/['"]+/g, '').trim()
        if (headerItem === headerName) {
            headerIdx = i;
            break
        }
    }
    return headerIdx
}

function handleReceivedData(inputData) {
    const header = Object.keys(inputData).toString();
    const original = inputData.original;
    const modified = inputData.modified;

    let dataText = []

    for(i=0; i < modified.length; i++){
        line = `${modified[i]},${original[i]}`
        dataText.push(line)
    }

    dataText = dataText.join('\n')

    const csv = [header, dataText].join('\n');
    startCSVDownload(csv)
    // console.log(csv);
}

function startCSVDownload(input){
    const blob = new Blob([input], {type: 'application/csv'});
    const url = URL.createObjectURL(blob);

    const getFile = document.createElement('a');
    getFile.download = 'test-output.csv';
    getFile.href = url;
    getFile.style.display = 'none';

    document.body.appendChild(getFile);

    getFile.click();

    getFile.remove();
    URL.revokeObjectURL(url);
}



const postLinks = async (url, arr) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ links: arr })
    });

    response.json()
        .then(data => handleReceivedData(data));
}

fileInput.addEventListener('change', () => {

    const myFile = fileInput.files[0];
    const reader = new FileReader()

    reader.readAsText(myFile)

    reader.onload = (event) => {

        let csvdata = event.target.result
        let rowdata = csvdata.split('\n')
        let headIdx = getHeaderIndex(rowdata[0].split(','), "data")

        for (let i = 1; i < rowdata.length - 1; i++) {
            let row = rowdata[i].split(',')[headIdx]
            myArray.push(row)
        }

        // remove whitespaces in case if needed
        myArray.forEach((item, index, arr) => {
            arr[index] = item.trim()
        })

        postLinks(requestUrl, myArray)
    }

})








