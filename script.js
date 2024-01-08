const fileInput = document.querySelector(".file-input");
let myArray = [];

// functions ---------------------------------
function validateFileExtension(filename) {
    ext = filename.split('.').pop();
    if (ext == 'csv'){
        return true
    } else {
        return false
    }
}

function getHeaderIndex(csvHeader, headerName){
    let headerIdx=undefined;
    for(let i=0; i<csvHeader.length; i++){
        headerItem = csvHeader[i].replace(/['"]+/g, '').trim()
        if(headerItem===headerName){
            headerIdx = i;
            break
        }
    }
    return headerIdx
}

const sendLinks = async (url, arr) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({links: arr})
    });

    response.json().then(data => {
        console.log('request sent!')
    });
}

fileInput.addEventListener('change', ()=>{

    const myFile = fileInput.files[0];
    const reader = new FileReader()

    reader.readAsText(myFile)

    reader.onload = (event) => {

        let csvdata = event.target.result
        let rowdata = csvdata.split('\n')
        let headIdx = getHeaderIndex(rowdata[0].split(','), "data")

        for(let i=1; i< rowdata.length-1; i++){
            let row = rowdata[i].split(',')[headIdx]
            myArray.push(row)
        }

        // remove whitespaces in case if needed
        myArray.forEach((item, index, arr)=>{
            arr[index] = item.trim()
        })

        
    }

})








