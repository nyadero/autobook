// alert("Welcome")

window.onload = () => {
    const loader = document.querySelector(".loading")
    loader.classList.toggle("hide-loader")

    const toggleBtn = document.querySelector(".toggle-btn")
const links = document.querySelector(".links")

toggleBtn.addEventListener("click", () => {
    links.classList.toggle("show-links")
})
}
