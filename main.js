const login = require("facebook-chat-api")
const request = require("request")
const utf8 = require("utf8")
const credentials = {email: "#email#", password: "#password#"}


const api_weather = "http://data.tmd.go.th/api/Weather3Hours/V1/?type=json&Province="

function sendMessage(api, message, threadID){
    api.sendMessage(message, threadID, (sendErr, messageInfo) => {
        if(sendErr) return console.error(sendErr)
    });
}

login(credentials, (loginErr, api) => {

    if(loginErr) return console.error(loginErr)

    api.listen((err, message) => {

        const messageRec = message.body
        const threadID = message.threadID
        const found = messageRec.match(/^สภาพอากาศจังหวัด(.*)/i)

        if(found.length > 1){

            const province = found[1]
            const url = api_weather+encodeURIComponent(province)

            request.get({ url: url }, (err, httpres, res) => {
                const json = JSON.parse(res)
                if(json.Stations.length > 0){

                    const target = json.Stations[0]
                    const messageSend = "จังหวัด : "+target.Province+"\n"+
                                        "วันที่ "+target.Observe.Time+"\n"+
                                        "อุณหภูมิ "+target.Observe.BarometerTemperature.Value+" องศา"
                    sendMessage(api, messageSend, threadID)
                }else{
                    const messageSend = "ไม่มีค่ะ"
                    sendMessage(api, messageSend, threadID)
                }
            })
        }
    })
})