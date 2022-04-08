import  Dayjs  from "dayjs";


const scrapProfile =async (url, page, pageOptions)=>{


    const person = {
        contact: {},
        education:[],
        experience:[]
    }
    try {
        await page.goto(url.concat("/overlay/contact-info/"), pageOptions)
    
    } catch (error) {
        console.log(error)
    }
    await page.waitForXPath('//div[@data-test-modal]')

    const [modal] = await page.$x('//div[@data-test-modal]')  
    
    await modal.waitForSelector('h3')
    const contactInfoNodeList = await modal.$x('(.//div[./section])[2]/section')


    for (const info of contactInfoNodeList) {
        console.log("into nodal:", info)
        const infoName = await (await info.$('h3')).evaluate(element=>element.textContent.trim('\n').trim())
        person.contact[infoName] = await (await info.$('h3 + div '))?.evaluate(element=>element.textContent.trim())
        console.log("saleindo del bucle del modal")
    }
    await page.goto(url, pageOptions)

    await page.evaluate(async e=>{
        const autoscroll = new Promise((resolve, reject)=>{
            let y = 60
            const a = setInterval(()=>{
                if (y>document.scrollingElement.scrollHeight-document.scrollingElement.clientHeight){
                    clearInterval(a);
                    resolve(true)
                }; scroll(0,y); y+=60}, 500)
        })
        await autoscroll
    })



    const  [education]  = await page.$x('.//main//section[.//span[contains(text(),"Educación")]]')
    
    const educationItems = await education?.$x("(.//ul)[1]/li")


    for (let item of educationItems) {
        const [Item]= await item.$x(".//div[2]//div//a")
        let name = await(await Item.$('div>span>span'))?.evaluate(element=>element.textContent.trim())
        let description = await(await Item.$('span:nth-child(2) > span:nth-child(1)'))?.evaluate(element=>element.textContent.trim())
        let date = await(await Item.$('span.t-black--light > span:nth-child(1)'))?.evaluate(element=>element.textContent.trim())
    

        let fecha = date?.split("·")[0].split("-").map(e=>Dayjs(e.trim()).$d)
        let start
        let end
        if (fecha){
            
            [start, end] = fecha 
            console.log(start, end)
        }
        person.education.push({
            name,
            "description": description===date?null:description ,
            "date": {
                start, end
            }
        })
    }

    const  [experience]  = await page.$x('.//main//section[.//span[contains(text(),"Experiencia")]]')
    
    const experienceItems = await experience.$x("(.//ul)[1]/li")
    

    for (let item of experienceItems) {
        const [Item]= await item.$x(".//div[2]//div//div")
        let name = await(await Item.$('div>span>span'))?.evaluate(element=>element.textContent.trim())
        let description = await(await Item.$('span:nth-child(2) > span:nth-child(1)'))?.evaluate(element=>element.textContent.trim())
        let date = await(await Item.$('span.t-black--light > span:nth-child(1)'))?.evaluate(element=>element.textContent.trim())
        
        //elementos de fecha
        let fecha = date?.split("·")[0].split("-").map(e=>Dayjs(e.trim()).$d)
        
        let start
        let end
        if (fecha){
            
            [start, end] = fecha 
            console.log(start, end)
        }
        person.experience.push({
            name,
            "description": description===date?null:description ,
            "date": {
                start, end
            }
        })
    
    }
    console.log(JSON.stringify(person))
    
    return person

}

export default scrapProfile