export default async (url:string) => {
    return  fetch(url, {
        headers: {
            'Authorization': `users API-Key ${process.env.PAYLOAD_API_KEY}`
        }
    })
}
