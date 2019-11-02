# AWSubsAPI
Unofficial AWSubs Scrapper with REST API using ExpressJS and Cheerio  
Default port: **8080**

## Tech Used
- NodeJS
- ExpressJS
- Axios
- Cheerio

## URIs

- **[GET]** `/`

Return recent anime update a.k.a first page posts

- **[GET]** `/page/{id}`

Return paged anime releases  
Example: `/page/1`

- **[GET]** `/anime/{id}`

Return list of anime episodes  
Example: `/anime/dr-stone`

- **[GET]** `/release/{id}`

Return anime episode data and links  
Example: `/release/dr-stone-episode-18-subtitle-indonesia`

## Example API Server

**[GET]** `https://awsubs-api.khairul.my.id/`
