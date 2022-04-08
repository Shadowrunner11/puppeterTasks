import puppeteer from "puppeteer"

const browserInit = async (options, pageOptions) =>{
    let browser = await puppeteer.launch(options)
    let page = await browser.newPage()
    //Incio de sesion
    await page.goto('https://www.linkedin.com/',pageOptions)
    await page.waitForSelector('input[autocomplete="username"]')
    const usernameInput = await page.$('input[autocomplete="username"]')
    const passworInput = await page.$('input[autocomplete="current-password"]')
    await usernameInput.type(process.env.LINKEDIN_USERNAME, {delay: 100})
    await passworInput.type(process.env.LINKEDIN_PASSWORD, {delay: 100})
    await passworInput.press('Enter')
    await page.waitForNavigation(pageOptions)
    return [browser, page]
}

export default browserInit