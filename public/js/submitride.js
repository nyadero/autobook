const imageSelector = document.querySelector(".images")
const previewImage = document.querySelector(".preview")
const previewContainer = document.querySelector(".preview-container")

let files = []


const handleFiles = () => {
    files = [...imageSelector.files]
    // console.log(files);
    if(files){
        displayImages(files)
    }
}

imageSelector.addEventListener("change", handleFiles)

function displayImages (files) {
   files.forEach((file, index) => {
            console.log({file});
            const name = file.name
            previewContainer.innerHTML += 
            `<div class="image-container">
            <img src="${URL.createObjectURL(file)}" alt="image" class="image" />
            <span onclick="deleteImage(${index})">&times;</span>
            </div>`
    })
}

function deleteImage(index) {
    alert(index)
    const cloneFiles = files.slice()
    const newFiles = files.splice(index, 1)
    console.log({newFiles, cloneFiles});
    displayImages()
}
