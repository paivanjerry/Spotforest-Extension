


if(!document.getElementById("spotforest-extension-script")){

  chrome.runtime.onMessage.addListener(function(message) {

    if(message.title = "spotforest_changeCoord" ) {
      var script_tag = document.createElement('script');
      script_tag.id = "spotforest-extension-script";
      script_tag.text = 
      `
        map.setZoom(${message.zoom});
        map.panTo({ lat: ${message.lat}, lng: ${message.lng} });
      `;
      document.body.appendChild(script_tag);
    }
  });
}