const fs = require('fs').promises;
const snakecase = require('snakecase');
const express = require('express')
const app = express()
const port = 3000

app.post('/', async (req, res) => {
    try {
        if (!isTokenValid(globalLogin)) {
            console.log('getting new token')
            const loginResponse = await fetch(`${process.env.ENDPOINT}/api/users/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: process.env.PAYLOAD_ADMIN_USERNAME,
                    password: process.env.PAYLOAD_ADMIN_PASSWORD
                }),
                });
                globalLogin = await loginResponse.json();
        }

        const postsResponse = await fetch(`${process.env.ENDPOINT}/api/posts`, {
            headers: {
                Authorization: `JWT ${globalLogin.token}`,
            },
        });
        const { docs: posts } = await postsResponse.json()
        console.log(`found ${posts.length} posts`)

        await Promise.all(posts.map(async post => {
            if (post.slug) {
                const req = await fetch(`${process.env.ENDPOINT}/api/posts/${post.id}/markdown`)
                const data = await req.json();
                const md = dataToMd(data)

                const path = `tts.gsa.gov/pages/jointts/positions/${post.slug}.md`;
                console.log(`writing ${post.slug} to ${path}`);
                try {
                    await fs.writeFile(path, md)
                    await fs.writeFile(`${post.slug}.md`, md)
                } catch (err) {
                    console.log(err)
                }
                return true
            }
        }));
    } catch (err) {
      console.log(err)
    }
    res.send('ok')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


let globalLogin = {}
// {
//     user: {
//       email: 'dev@payloadcms.com',
//       createdAt: "2020-12-27T21:16:45.645Z",
//       updatedAt: "2021-01-02T18:37:41.588Z",
//       id: "5ae8f9bde69e394e717c8832"
//     },
//     token: '34o4345324...',
//     exp: 1609619861
//   }

function isTokenValid (login) {
    if (!login.token) return false
    return new Date(login.exp) > new Date()
}

function dataToMd (data) {
    let md = `---
layout: layouts/jointts/job-listing
permalink: /join/${data.slug}.html
tags: jobs`

    for (const [key, value] of Object.entries(data)) {
        if (['roleSummary', 'qualifications', 'howToApply'].includes(key)) {
            md += `\n${snakecase(key)}: |\n  ${value}`;
        } else if (key === 'keyObjectives') {
            value.forEach(objective => {
                objective.items = objective.items.map(i => i.item)
            })
            md += `\n${snakecase(key)}: ${JSON.stringify(value)}`;
        } else {
            md += `\n${snakecase(key)}: ${value}`;
        }

    }
    md += `
info_sessions:
    - link: https://gsa.zoomgov.com/webinar/register/WN_WZuzMobxSCeEuZXvWYo2hg#/registration
      date: 2024-10-21
      time: 12:30pm-1:30pm
---`
    return md
}
