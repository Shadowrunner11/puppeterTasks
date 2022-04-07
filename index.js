import puppeteer from "puppeteer"

const options = {headless: true}
const pageOptions = {waitUntil: 'networkidle2'}
let browser
let page
let profilesUrls = []
const browserInit = async () =>{
    browser = await puppeteer.launch(options)
    page = await browser.newPage()
    //Incio de sesion
    await page.goto('https://www.linkedin.com/',pageOptions)
    await page.waitForSelector('input[autocomplete="username"]')
    const [usernameInput] = page.$('input[autocomplete="username"]')
    const [passworInput] = page.$('input[autocomplete="current-password"]')
    await usernameInput.type(process.env.LINKEDIN_USERNAME, {delay: 100})
    await passworInput.type(process.env.LINKEDIN_PASSWORD, {delay: 100})
    await passworInput.press('Enter')
    await page.waitForNavigation(pageOptions)

    await page.goto('https://www.linkedin.com/search/results/people/?keywords=fullstack')
    const profilesList = await page.$x('//h1/..//ul/li')

    profilesList.forEach(async (e)=> {
        const link =  await e.evaluate(handle=>handle.document.querySelector('a').href)
        profilesUrls.push(link)
        }
    )
    console.log(profilesList)
}

browserInit()




