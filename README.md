# FYP-24_DCS__CodeAbility-Crew_EcoYah
Final Year Project 2024

### Client - Frontend
``` 
cd client
# if first time
npm i
npm run start
```

## Database Set Up (PostGresSQL)
> Do this before running the server.

We are using PostGresSQL for this. Ensure you have PostGresSQL installed and you have access to the credentials. `pgAdmin` is recommended to be installed. 

![pgAdmin](screenshots/pgAdmin4.png)
1. Create a new database called `ecoyahdb`
2. Update username and password in [data-source.ts](server/src/config/data-source.ts). Ensure that they match the user account in PostGresSQL.

## Server

> Before running the server, ensure that you have a `.env` file under the `server` folder with the `PORT=8000`. 
```
cd server
# if first time
npm i 
npm run dev
```

# Verify 
You should see `EcoYah is online` on `http://localhost:3000/`. 
Using `Postman`, access 
1. GET `http://localhost:8000/items` to see a list of items.
2. POST `http://localhost:8000/items` to add an item, include the following in the JSON body.
```
{
        "name": "Created Item",
        "createdAt": "2024-01-12T15:23:55.117Z",
        "updatedAt": "2024-01-12T15:23:55.117Z"
}
```