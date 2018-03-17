import request from 'request-promise'

const baseUrl = 'https://api.voicepin.com'
const basePath = '/rest/v1/verifier'
const apiKey = process.env.VOICEPIN_API_KEY || '556de5b4-f91a-4caa-84e2-afeb96254427'
const headers = {
    'Content-Type': 'application/json'
}
const uploadHeaders = {
    'Content-Type': 'multipart/form-data'
}
const passwordGroupName = process.env.VOICEPIN_PASSWORDGROUPNAME || 'minha-voz-confirma-o-meu-acesso'

class VoicePIN {

    static listVoicePrints() {
        const url = `${baseUrl}${basePath}/passwordGroups/${passwordGroupName}/voiceprints?apiKey=${apiKey}`
        const options = { url, headers, json: true }
        return request.get(options)
    }

    static createVoiceprint() {
        const url = `${baseUrl}${basePath}/passwordGroups/${passwordGroupName}?apiKey=${apiKey}`
        const options = { url, headers, json: true }
        return request.post(options)
    }
    
    static getPasswordGroups() {
        const url = `${baseUrl}${basePath}/passwordGroups?apiKey=${apiKey}`
        const options = { url, headers, json: true }
        return request.get(options)
    }

    static isVoiceTrained(voiceprintId) {
        const url = `${baseUrl}${basePath}/voiceprints/${voiceprintId}/enrollments?apiKey=${apiKey}`
        const options = { url, headers, json: true }
        return request.get(options)
    }

    static trainVoice(voiceprintId, recording) {
        const url = `${baseUrl}${basePath}/voiceprints/${voiceprintId}/enrollments?apiKey=${apiKey}&channelCode=UNKNOWN`
        const formData = { recording }
        const options = { url, uploadHeaders, formData, json: true }
        return request.post(options)
    }

    static resetVoiceprintEnrollment(voiceprintId) {
        const url = `${baseUrl}${basePath}/voiceprints/${voiceprintId}/enrollments?apiKey=${apiKey}`
        const options = { url, headers, json: true }
        return request.delete(options)
    }

    static verifyVoice(voiceprintId, recording) {
        const url = `${baseUrl}${basePath}/voiceprints/${voiceprintId}/verifications?apiKey=${apiKey}&channelCode=UNKNOWN`
        const formData = { recording }
        const options = { url, uploadHeaders, formData, json: true }
        return request.post(options)
    }

    static removeVoiceprint(voiceprintId) {
        const url = `${baseUrl}${basePath}/voiceprints/${voiceprintId}?apiKey=${apiKey}`
        const options = { url, headers, json: true }
        return request.delete(options)
    }

    static listVoiceprints() {
        const url = `${baseUrl}${basePath}/voiceprints?apiKey=${apiKey}`
        const options = { url, headers, json: true }
        return request.get(options)
    }

}

export { VoicePIN }