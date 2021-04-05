chrome.runtime.onMessage.addListener(function(message, sender, reply) {
  if(sender.url.includes("/maps") && message.title === "spotforest_buttonPressed"){
    reply(handleMessage(message))
  }
  

});

function handleMessage(message){
  let res = "ok"
  const splitted = message.data.split(",")
  const lat = parseFloat(splitted[0])
  const lng = parseFloat(splitted[1])
  let zoom = 17 // Fallback zoom
  let zoomStr = splitted[2]
  let metresZoom
  // Loop chars to get the unit
  for(let char of zoomStr){
    // z char is good value
    // use the zoomStr.split because it can contain query params etc.
    if(char === "z"){
      let parsed = parseFloat(zoomStr.split("z")[0])
      if(!isNaN(parsed)){
        zoom = parsed
      }
      break
    }
    // m or a char needs some calculation
    else if(char === "m"){
      let parsed = parseFloat(zoomStr.split("m")[0])
      if(!isNaN(parsed)){
        metresZoom = parsed
      }
      break
    }
    else if(char === "a"){
      let parsed = parseFloat(zoomStr.split("a")[0])
      if(!isNaN(parsed)){
        metresZoom = parsed / 1.5
      }
      break
    }
  }
  
  if(metresZoom){
    // Okay do the calculation
    zoom = getZoomFromMetres(metresZoom)
  }

  if(lat < 73 && lat > 55 && lng > 8 && lng < 45 ){
    chrome.tabs.query({url: "https://spottimetta.fi/webapp*"}, function(results) {
      if (results.length > 0) {
        changeTab(results[0].id, zoom, lat, lng)
      }
      else{
        createTab("https://spottimetta.fi/webapp", zoom, lat, lng)
      }
    });
  }

  else if(lat < 45 && lat > 31 && lng > -14 && lng < 6){
      chrome.tabs.query({url: "https://spotforest.com/spain*"}, function(results) {
        if (results.length > 0) {
          changeTab(results[0].id, zoom, lat, lng)
        }
        else{
          createTab("https://spotforest.com/spain", zoom, lat, lng)
        }
      });
  }

  else{
    res = "You are not currently in any Spotforest area"
    return res
  }

  return res

}//handleMessage


function createTab(url, zoom, lat, lng){
  chrome.tabs.create({active: true, url: url}, function(tab){
    chrome.tabs.executeScript(tab.id,{file: "changeMapView.js"}, function(){
      setTimeout(function(){chrome.tabs.sendMessage(tab.id, {title: "spotforest_changeCoord", zoom, lat, lng});}, 2000)
    })
  })
}

function changeTab(tabId, zoom, lat, lng){
  chrome.tabs.update(tabId, {highlighted: true}, function(){
    chrome.tabs.executeScript(tabId,{file: "changeMapView.js"}, function(){
          chrome.tabs.sendMessage(tabId, {title: "spotforest_changeCoord", zoom, lat, lng});
        })
  });
}
function getZoomFromMetres(metresZoom){
  let numberArray = []
  for(const key in metersToZoom){
    // Make an array of meters
    numberArray.push(key)
  }


  // Order number array with difference of meters
  numberArray.sort((a, b) => {
      return Math.abs(metresZoom - a) - Math.abs(metresZoom - b);
  })
  let zVal = metersToZoom[numberArray[0]]
  return zVal
}

const metersToZoom = {
  1200000: 6,
  500000: 7,
  300000: 8,
  170000: 9,
  80000: 10,
  40000: 11,
  20000: 12,
  10000: 13,
  5000: 14,
  3000: 15,
  1480: 16,
  740: 17,
  370: 18,
  200: 19,
  100: 20,
}

