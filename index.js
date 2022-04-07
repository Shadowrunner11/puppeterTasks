import {} from 'dotenv/config'
import puppeteer from "puppeteer"
import  Dayjs  from "dayjs";

const options = {headless: true}
const pageOptions = {waitUntil: 'networkidle2'}
let browser
let page
let anotherPage

const browserInit = async () =>{
    browser = await puppeteer.launch(options)
    page = await browser.newPage()
    //Incio de sesion
    await page.goto('https://www.linkedin.com/',pageOptions)
    await page.waitForSelector('input[autocomplete="username"]')
    const usernameInput = await page.$('input[autocomplete="username"]')
    const passworInput = await page.$('input[autocomplete="current-password"]')
    await usernameInput.type(process.env.LINKEDIN_USERNAME, {delay: 100})
    await passworInput.type(process.env.LINKEDIN_PASSWORD, {delay: 100})
    await passworInput.press('Enter')
    await page.waitForNavigation(pageOptions)

    await page.goto('https://www.linkedin.com/search/results/people/?keywords=fullstack')
    const profilesList = await page.$x('//h1/..//ul/li')

    let profilesUrls = []

    for (const element of profilesList) {

        const link =  await element.evaluate(handle=>handle.querySelector('a').href.split('?')[0])
        profilesUrls.push(link)
        
    }

    //for (const url of profilesUrls) {
        const person = {
            contact: {},
            education:[],
            experience:[]
        }
        const url = profilesUrls[0]
        anotherPage = await browser.newPage()
 
        await anotherPage.goto(url.concat("/overlay/contact-info/"), pageOptions)

       
        await anotherPage.waitForXPath('//div[@data-test-modal]')
  
        const [modal] = await anotherPage.$x('//div[@data-test-modal]')  
        
        await modal.waitForSelector('h3')
        const contactInfoNodeList = await modal.$x('(.//div[./section])[2]/section')
 
        for (const info of contactInfoNodeList) {
            const infoName = await (await info.$('h3')).evaluate(element=>element.textContent.trim('\n').trim())
            person.contact[infoName] = await (await info.$('h3 + div '))?.evaluate(element=>element.textContent.trim())
        }
        await anotherPage.goto(url, pageOptions)

        await anotherPage.evaluate(e=>{
            let y = 60
            const a = setInterval(()=>{if (y>document.scrollingElement.scrollHeight-document.scrollingElement.clientHeight){clearInterval(a)}; scroll(0,y); y+=60}, 500)
            })

       
        const  [education]  = await anotherPage.$x('.//main//section[.//span[contains(text(),"Educación")]]')
        
        const educationItems = await education?.$x("(.//ul)[1]/li")
       
        for (let item of educationItems) {
            const [Item]= await item.$x(".//div[2]//div//a")
            let name = await(await Item.$('div>span>span'))?.evaluate(element=>element.textContent.trim())
            let description = await(await Item.$('span:nth-child(2) > span:nth-child(1)'))?.evaluate(element=>element.textContent.trim())
            let date = await(await Item.$('span.t-black--light > span:nth-child(1)'))?.evaluate(element=>element.textContent.trim())
            

            let fecha = date?.split("·")[0].split("-").map(e=>Dayjs(e.trim()).$d)
            let [start, end] = fecha
            person.education.push({
                name,
                "description": description===date?null:description ,
                "date": {
                    start, end
                }
            })
        }

        const  [expirience]  = await anotherPage.$x('.//main//section[.//span[contains(text(),"Experiencia")]]')
        
        const expirienceItems = await expirience.$x("(.//ul)[1]/li")
        

        for (let item of expirienceItems) {
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
        
        
    //}
    browser.close()
    console.log(JSON.stringify(person))
    return person
}
/* 
//promesasss
const evaluate =async (val)=>{
    return await 
} */

browserInit()




