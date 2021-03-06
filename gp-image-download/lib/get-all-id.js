const fs = require('fs')
const url = require('url')
const http = require('http')

const URL = "http://urp.njnu.edu.cn/authorizeUsers.portal"
const STU_FILE = "data/students.json"
const YEAR = new Date().getFullYear()
// http://urp.njnu.edu.cn  登陆cookie
const COOKIE = "njnuurpnew=ac16c83bd341d8ba0c3f2f092378; JSESSIONID=0001gcUXI0GWjdQg_ptI6NGAFaf:-5B0INP"

const get = (options) =>
    new Promise((resolve, reject) => {
        // console.log(options)
        http.request(options, (res) => { 
            let str = ''
            res.on('data', (data) => {
                str += data.toString()
                // console.log(data.toString());
            })
            res.on('end', () => {resolve(str)}) 
        }).end()
    })

async function getLimit() {
    try {
        const x = await get({
            ...url.parse(URL),
            headers: { cookie: COOKIE }
        })
        // console.log('xx', x)
        const json = JSON.parse(x)
        return json.recordCount
    } catch (ex) {
        console.error(ex);
    }
}

async function getStuIds(limit) {
    try {
        const x = await get({
            ...url.parse(URL+"?limit="+limit),
            headers: { cookie: COOKIE }
        })

        const json = JSON.parse(x)
        return json.principals.filter(x=>{
            let metier = x.metier.trim();
            return metier=='本专科生'
        })
    } catch (ex) {
        console.error(ex);
    }
}

writeStudents()
// assignStuIds()

async function writeStudents() {
    const limit = await getLimit()
    const stus = await getStuIds(limit)

    console.log('writing "%s"', STU_FILE)
    fs.writeFileSync(STU_FILE, JSON.stringify(stus, null, 4))

    assignStuIds()
}

function assignStuIds() {
    const stus = JSON.parse(fs.readFileSync(STU_FILE))

    let all = stus.reduce((p, n) => {
        //19130126
        if(/^[\d]{8}$/.test(n.id)) {
            let num = n.id.substr(2, 2);
            let year = "20"+num;
            if(year>YEAR || isNaN(num)) return p
            p[year] = p[year] || ''
            p[year] += n.id+'\r\n'
        }
        return p
    }, {})

    Object.keys(all).forEach(k =>{
        let v = all[k];
        console.log('writing "%s"', "data/student-ids-"+k+".txt")
        fs.writeFile("data/student-ids-"+k+".txt", v.replace(/\r\n$/, ''), ()=>{})
    })
}

