import request from 'request-promise'
import { Readable } from 'stream'

const username = process.env.WATSON_SPEECHTOTEXT_USERNAME
const password = process.env.WATSON_SPEECHTOTEXT_PASSWORD
const url = 'https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?model=pt-BR_NarrowbandModel'
const headers = {
    'Content-Type': 'audio/wav'
}

class Watson {
    
    static recognize(record) {
        const options = {
            url: url,
            method: 'POST',
            headers: headers,
            auth: {
                "username": username,
                "password": password
            },
            json: true,
            encoding: null
        }
        const readable = new Readable()
        readable._read = () => {} // _read is required but you can noop it
        readable.push(record)
        readable.push(null)
        return readable.pipe(request(options))
    }

}

export { Watson }