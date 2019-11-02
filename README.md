# AWSubsAPI
Unofficial AWSubs Scrapper with REST API using ExpressJS and Cheerio  
Default port: **8080**

## Tech Used
- NodeJS
- ExpressJS
- Axios
- Cheerio

## URIs

- `/`

Return recent anime update a.k.a first page posts

- `/page/{id}`

Return paged anime releases  
Example: `/page/1`

- `/anime/{id}`

Return list of anime episodes  
Example: `/anime/dr-stone`

- `/release/{id}`

Return anime episode data and links  
Example: `/release/dr-stone-episode-18-subtitle-indonesia`
