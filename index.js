import {} from 'dotenv/config'
import puppeteer from "puppeteer"

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

        const link =  await element.evaluate(handle=>handle.querySelector('a').href)
        profilesUrls.push(link)
        
    }

    //for (const url of profilesUrls) {
        const person = {}
        const [url] = profilesUrls 
        anotherPage = await browser.newPage()
        console.log('nav1')
        await anotherPage.goto(url, pageOptions)
        console.log('nav')
        const [contactInfoHandler] = await anotherPage.$x('(//main//section[1]//a)[2]')
        console.log(contactInfoHandler)
        await contactInfoHandler.click()
        console.log('nav')
        await anotherPage.waitForXPath('//div[@data-test-modal]')
        console.log('nav')
        const [modal] = await anotherPage.$x('//div[@data-test-modal]')
        console.log(modal)
        await modal.waitForSelector('h3')
        const contactInfoNodeList = await modal.$x('(.//div[./section])[2]/section')
        console.log(contactInfoNodeList)
        for (const info of contactInfoNodeList) {
            console.log('bucle')
            const infoName = await (await info.$('h3')).evaluate(element=>element.textContent)
            person[infoName] = await (await info.$('h3 + div')).evaluate(element=>element.textContent.trim())
        }
        
    //}
    console.log(person)
    return person
}

browserInit()




