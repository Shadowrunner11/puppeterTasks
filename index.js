import {} from 'dotenv/config'
import browserInit from './func/browserInit.js'
import getProfilesUrl from './func/getProfilesUrl.js'
import scrapProfile from './func/scrapProfile.js'

const options = {headless: false}
const pageOptions = {waitUntil: 'networkidle2'}


const scrapProfiles = async () =>{
    const persons = []
    let [browser, page] = await browserInit(options)

    const profilesUrls = await getProfilesUrl(page)
    
    //page = browser.newPage(pageOptions)
    for (const url of profilesUrls) {
        const person = await scrapProfile(url, page, pageOptions)
        persons.push(person)

    }
    
    //fire and forget
    browser.close()
    return persons
    
}

scrapProfiles()




