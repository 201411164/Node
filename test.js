import { executablePath } from 'puppeteer';

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const pluginProxy = require('puppeteer-extra-plugin-proxy');
// const fetch = require("node-fetch");
const sqlite3 = require('sqlite3').verbose();
console.log('Program started');
var axios = require('axios');
const userAgents = require('user-agents');


puppeteer.use(StealthPlugin());
puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())


// database.js의 insertTable()을 호출한다.

const database = require('./database.js');
const UserAgent = require('user-agents');

async function setUserAgent(page, isMobile) {
  const userAgent = isMobile ? new UserAgent({ deviceCategory: 'mobile' }).toString() : new UserAgent({ deviceCategory: 'desktop' }).toString();
  await page.setUserAgent(userAgent);
  return userAgent;
}

async function compareUserAgents(page, isMobile) {
  const oldUserAgent = await page.evaluate(() => navigator.userAgent);
  const newUserAgent = await setUserAgent(page, isMobile);
  console.log(`Old User-Agent: ${oldUserAgent}`);
  console.log(`New User-Agent: ${newUserAgent}`);
}


async function getCookieAndHeader(page) {
  // 쿠키 정보 가져오기
  const cookies = await page.cookies();

  // 헤더 정보 가져오기
  const headers = await page.evaluate(() => {
    const headers = {};
    for (const header of Object.keys(navigator)) {
      if (typeof navigator[header] === "string") {
        headers[header] = navigator[header];
      }
    }
    return headers;
  });

  console.log("쿠키 정보:", cookies);
  console.log("헤더 정보:", headers);
}






// https://api.asocks.com/v2/proxy/ports?apikey=Vqtab8brLo3l1g7tMyqqsLzf50VFrxptHvsFdexoYEUPmvbHYDzMRXMVwlRxj1bU 에 get 요청을 보내서 포트를 받아온다. 
// apikey는 Vqtab8brLo3l1g7tMyqqsLzf50VFrxptHvsFdexoYEUPmvbHYDzMRXMVwlRxj1bU
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});



async function getProxyData(index) {
  console.log('index: ', index)

  const query = 'SELECT proxyHost, proxyPort, proxyUser, proxyPass FROM proxies LIMIT 1 OFFSET '+index;

  return new Promise((resolve, reject) => {
    db.get(query, [], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        reject(new Error(`Invalid index: ${index}`));
      } else {
        const { proxyHost, proxyPort, proxyUser, proxyPass } = row;
        resolve({
          proxyHost,
          proxyPort,
          proxyUser,
          proxyPass
        });
      }
    });
  });
}

async function getProxyNum() {
  console.log('getProxyNum 시작됨');
  const query = 'SELECT COUNT(*) AS total FROM proxies where proxyPass not null';

  return new Promise((resolve, reject) => {
    db.get(query, [], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        reject(new Error(`Invalid index: ${index}`));
      } else {
        console.log('getProxyNum 결과 출력');
        console.log(row);
        resolve(row.total-1);
      }
      
    });
  });
  
}

async function getMidAndKeywords(loginId){
  // 임의의 loginId가 일치하는 한 행을 뽑아서 usernvmid와 keyword를 리턴한다.
  console.log('getMidAndKeywords 시작됨')  
  const query = 'SELECT usernvmid, keyword FROM midAndKeywords where loginId = "'+loginId+'" ORDER BY RANDOM() LIMIT 1';
  
  return new Promise((resolve, reject) => {
    db.get(query, [], (err, row) => {
      if (err) {
        reject(err);
      }
      else if (!row) {
        reject(new Error(`Invalid index: ${index}`));
      }
      else {
        const { usernvmid, keyword } = row;
        console.log('getMidAndKeywords 결과 출력');
        console.log(usernvmid, keyword);
        resolve([usernvmid, keyword]);
        
    }
    });  
  });
}



function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}



//  Loop over this task 'loopnumber' times
console.log('for문 시작하기')

async function launchTraffic(loginId, isMobile){


  const maxBrowsers = 5; // 최대 브라우저 창 수
  let browserCount = 0; // 현재 실행 중인 브라우저 창 수
  
  console.log('launchTraffic 시작됨')
  
  const loopnumber = await getProxyNum();

  console.log('loopnumber: ', loopnumber)

  const launchBrowser = async (i) => {
    const { proxyHost, proxyPort, proxyUser, proxyPass } = await getProxyData(i);
    console.log('proxyHost: ', proxyHost)
    console.log('proxyPort: ', proxyPort)
    console.log('proxyUser: ', proxyUser)
    console.log('proxyPass: ', proxyPass)

    const [usernvmid, keyword] = await getMidAndKeywords(loginId);
    console.log(`usernvmid: ${usernvmid}, keyword: ${keyword}`);

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--proxy-server=http://${proxyHost}:${proxyPort}`
      ],
      headless: false,
      executablePath: executablePath(),
    });

    let page = await browser.newPage();
    await page.authenticate({ username: proxyUser , password:proxyPass });
    await page.setDefaultNavigationTimeout(0);
    
    // print current useragent
    let userAgent = await page.evaluate(() => navigator.userAgent)
    console.log('userAgent before: ', userAgent)
    // set random user agent
    setUserAgent(page,isMobile)
    userAgent = await page.evaluate(() => navigator.userAgent)
    console.log('userAgent after: ', userAgent)

    // do something with the page

    try {
      console.log('Loop: ', i)     

      // // PC User-Agent 비교
      // await compareUserAgents(page, false);
      
      // Mobile User-Agent 비교
      await compareUserAgents(page, true);
      
      await page.goto('https://ip.pe.kr/');     

      await page.waitForSelector('.cover-heading');
      const ip = await page.$eval('.cover-heading', el => el.innerText);
      console.log('Current IP: ', ip);

      await page.goto('https://shopping.naver.com/home');
      
      const searchInputSelector = 'input._searchInput_search_text_3CUDs';
      const mobileSearchInputSelector = 'input._ac_input _searchInput_input_text_gLhFA'

      // 만약 isMobile이 true면 모바일 검색창으로 검색
      if (isMobile) {
        await page.waitForSelector(mobileSearchInputSelector);
        await page.click(mobileSearchInputSelector);
        await page.type(mobileSearchInputSelector, keyword);
        await Promise.all([page.keyboard.press('Enter'), page.waitForNavigation()]);
      } else {
      await page.waitForSelector(searchInputSelector);
      await page.click(searchInputSelector);
      await page.type(searchInputSelector, keyword);
      await Promise.all([page.keyboard.press('Enter'), page.waitForNavigation()]);
      }
      let isFound = false;
      let elemtoClick = null;
      let loopIdx = 0;

      while (!isFound) {
        const elements = await page.$$('.basicList_link__JLQJf');
        const mobileelemenets = await page.$$('.product_info_main__piyRs');
        console.log('Number of elements: ', elements.length);

        for (let j = 0; j < elements.length; j++) {
          const href = await page.evaluate(el => el.href, elements[j]);
          console.log('href: ', href)
          if (href.includes(usernvmid)) {
            console.log('Found href!! ', href);
            isFound = true;
            elemtoClick = elements[j];
            break;
          }
        }
        
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });

        if (++loopIdx > 10) {
          break;
        }
      }

      if (elemtoClick) {        
        
        await elemtoClick.click();        

        console.log('링크 클릭!!');
        console.log('New tab opened')
        // 새 탭이 열릴 때까지 기다린다.
        
        const pages = await browser.pages();
        const newPage = pages[pages.length - 1];
                
        // 새 페이지가 열리면 새 페이지로 이동한다.
        page = newPage;       

        await page.bringToFront();
        await page.waitForTimeout(4000)
        // 300~350초동안 랜덤하게 화면을 스크롤하며 대기한다.
        const stayTime = Math.floor(Math.random() * 50) + 300;
        console.log('stayTime: ', stayTime);
        const scrollCount = Math.floor(stayTime / 1);
        console.log('scrollCount: ', scrollCount);

        for (let i = 0; i < scrollCount; i++) {
          await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
          });
          await page.waitForTimeout(1000);
        }

        // print current useragent
        userAgent = await page.evaluate(() => navigator.userAgent)
        console.log('final userAgent : ', userAgent)
        database.createLog(loginId, 'test', proxyHost, proxyPort, ipAddress, access_time, accessUrl, keyword, mid, stayTime); 

        await newPage.close();        

      } else{
        console.log('링크 없음')
      }      
          
      
      
    } catch (error) {
      console.log(error);
      console.log('에러 발생!');
    }

    finally{

      await browser.close();
      
      // promise를 해제한다.
      promises.splice(promises.indexOf(launchBrowser), 1);
      console.log('browser 닫기!!');      
      // // 열려있는 모든 페이지를 닫는다.
      // console.log('Closing all pages')
      // const pages = await browser.pages();
      // for (let i = 0; i < pages.length; i++) {
      //   await pages[i].close();
      // }
      // // 모든 메모리를 해제한다.
      // await page.evaluate(() => {
      //   window.open('about:blank', '_self').close();
      // });           
      
    }
    
  }

  const promises = [];

  for (let i = 1; i <= loopnumber; i++) {
    console.log('loop i:', i);
    
    if (promises.length >= maxBrowsers) {
      const finishedPromise = await Promise.race(promises);
      console.log('finishedPromise:', finishedPromise);
      console.log('promises.length:', promises.length);
    }
    
    console.log('push 시작');
    console.log('promises.length:', promises.length);
    promises.push(launchBrowser(i));
    
    if (promises.length === maxBrowsers || i === loopnumber) {
      await Promise.all(promises);
      promises.length = 0; // 배열 초기화
      console.log('모든 작업 완료');
    }
  }
     
}


async function test() {
     // Launch the browser in headless mode and set up a page.
     const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true })
     const page = await browser.newPage()
  
     // Navigate to the page that will perform the tests.
     const testUrl = 'https://intoli.com/blog/' +
       'not-possible-to-block-chrome-headless/chrome-headless-test.html'
     await page.goto(testUrl)
  
     // Save a screenshot of the results.
     const screenshotPath = '/tmp/headless-test-result.png'
     await page.screenshot({path: screenshotPath})
     console.log('have a look at the screenshot:', screenshotPath)
  
     await browser.close()
}

async function test2(){




puppeteer.launch({ headless: true }).then(async browser => {
  
  
  console.log('Running tests..')
  const page = await browser.newPage()
  // print current useragent
  let userAgent = await page.evaluate(() => navigator.userAgent)
  console.log('userAgent before: ', userAgent)
  // set random user agent
  setUserAgent(page,true)
  userAgent = await page.evaluate(() => navigator.userAgent)
  console.log('userAgent after: ', userAgent)
 
  
  await page.goto('https://bot.sannysoft.com')
  await page.waitForTimeout(5000)
  await page.screenshot({ path: 'testresult.png', fullPage: true })
  await browser.close()
  console.log(`All done, check the screenshot. ✨`)
})
}

//test()
  
//test2()
   
//database.setUpDatabase();
// database.insertTable();

// database.selectTable();

async function launch() {
  for (let i = 1; i <= 100; i++) {
    console.log('i')
    await launchTraffic('test', true);
  }
}

launch();
