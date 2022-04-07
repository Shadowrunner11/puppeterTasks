const getLinksInjection = handle => handle.querySelector('a').href.split('?')[0]


const getProfilesUrl = async (page) =>{

    await page.goto('https://www.linkedin.com/search/results/people/?keywords=fullstack')
    const profilesList = await page.$x('//h1/..//ul/li')

    let profilesUrls = []

    for (const element of profilesList) {

        const link =  await element.evaluate(getLinksInjection)
        profilesUrls.push(link)
        
    }
    return profilesUrls
}

export default getProfilesUrl