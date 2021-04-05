

(function() {
  let button = document.createElement("input")
  button.setAttribute("id", "spotforest-button")
  button.setAttribute("type", "image")
  button.setAttribute("src", "https://spottimetta.fi/favicon.ico")
  button.setAttribute("title", "Open current view in Spotforest")
  button.style.position = "fixed"
  button.style.zIndex = 100000
  button.style.right = "20px"
  button.style.top = "100px"
  document.body.appendChild(button)
  button.addEventListener("click", buttonPressed)

})()

function buttonPressed(){
  let path = window.location.pathname
  let dataStr = path.split("@")[1]

  chrome.runtime.sendMessage({data: dataStr, title: "spotforest_buttonPressed"}, function(response) {
    if(response !== "ok"){
      showToast(response)
    }
  });
}


function showToast(response){

  let toast = document.createElement("div")
  toast.textContent = response
  toast.style.position = "fixed"
  toast.style.zIndex = 100000
  toast.style.right = "80px"
  toast.style.top = "100px"
  toast.style.color = "white"
  toast.style.background = "#5ece5e"
  toast.style.padding = "10px"
  toast.style.textShadow = "1px 0px 10px black"
  toast.style.borderRadius = "5px"
  document.body.appendChild(toast)
  setTimeout(()=>{
    toast.outerHTML = ""
  }, 2000)

}
