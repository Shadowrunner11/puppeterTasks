const autoscroll = new Promise((resolve, reject)=>{
    let y = 60
    const a = setInterval(()=>{
        if (y>document.scrollingElement.scrollHeight-document.scrollingElement.clientHeight){
            clearInterval(a);
            resolve(true)
        }; scroll(0,y); y+=60}, 500)
})

export default autoscroll