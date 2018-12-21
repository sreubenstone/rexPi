const shell = require('shelljs');
const ngrok = require('ngrok');
require("dotenv").config();
const accountSid = process.env.TWILIO1
const authToken = process.env.TWILIO2
const client = require('twilio')(accountSid, authToken);

const rex = "raspivid -o - -t 0 -hf -w 800 -h 400 -fps 24 | cvlc -vvv stream:///dev/stdin --sout '#standard{access=http,mux=ts,dst=:8160}' :demux=h264"

shell.exec(rex)

const tunnel = async () => {
    const url = await ngrok.connect(8160);
    console.log('url:', url)
    const res = url.replace("https://", "");
    console.log('res:', res)
    const fixing = res.replace(".", "")
    console.log('ready:', fixing)
    const ready = fixing.replace("ngrok.io", "")
    console.log(ready)
    const family = ["5164265510", "5163840421", "5168573205", "5163614802"]
    try {
        family.forEach(element => {
            client.messages
                .create({
                    body: `Rex cam is now active on ${ready}.`,
                    from: '+19292425545',
                    statusCallback: 'http://postb.in/1234abcd',
                    to: element
                })
                .then(message => console.log(message.sid))
                .done();
        });
    } catch (error) {
        console.log(error)
    }
}


tunnel()