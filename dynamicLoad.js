function dynamicLoadJs(url) {
  // var head = document.getElementsByTagName('head')[0];
  // var script = document.createElement('script');
  // script.type = 'text/javascript';
  // script.src = url;
  // let loadState = false
  // script.onload = script.onreadystatechange = function () {
  //   if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
  //     // callback();
  //     loadState = true
  //     script.onload = script.onreadystatechange = null;
  //     console.log('dynamicLoadJs')

  //     return true

  //   }
  // };
  // script.onerror = () => {
  //   return false
  // }
  // head.appendChild(script);
  // console.log(loadState, 'loadState')
  // return loadState
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    // script.type = "text/javascript";
    script.src = url;
    script.onload = () => {
      resolve(true)     // qq实际是一个对象，其中包含maps，maps也是一个对象，封装了腾讯地图api的功能
    }
    script.onerror = () => {
      reject(false)
    };
    document.head.appendChild(script);
  })
}

