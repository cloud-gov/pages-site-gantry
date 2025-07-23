import path from 'node:path'

export default async (endpoint:string) => {
    const url = path.join(import.meta.env.EDITOR_APP_URL || '', 'api', endpoint)
    return  fetch(url, {
        headers: {
            'Authorization': `users API-Key ${import.meta.env.PAYLOAD_API_KEY}`
        }
    })
}
