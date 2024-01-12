# FYP-24_DCS__CodeAbility-Crew_EcoYah
Final Year Project 2024

### Client
``` 
cd client
# if first time
npm i
npm run start
```

### Server

Before running the server, ensure that you have a `.env` file under the `server` folder with the `PORT=8000`. 
```
cd server
# if first time
npm i 
npm run dev
```

You should see `EcoYah is online` on `http://localhost:3000/`. 


## Database Set Up

We are using PostgreSQL for our database.

```
# This starts the Postgres Server without prepopulating the database.

docker run --name ecoyah_db -e POSTGRES_PASSWORD=root -p 5432:5432 -d postgres

# This starts the Postgres Server with prepopulating the database.

docker run --name ecoyah_db -p 5432:5432  -e POSTGRES_PASSWORD=root -v <abs path to db_init.sql>:/docker-entrypoint-initdb.d/init.sql -d postgres

docker run --name ecoyah_db -p 5432:5432 -e POSTGRES_PASSWORD=root -e POSTGRES_HOST_SSL=disabled -v D:\GitHub\FYP-24_DCS__CodeAbility-Crew_EcoYah\server\db_init\db_init.sql:/docker-entrypoint-initdb.d/init.sql -d postgres

docker run --name ecoyah_db -p 5432:5432 -e POSTGRES_PASSWORD=root -v D:\GitHub\FYP-24_DCS__CodeAbility-Crew_EcoYah\server\db_init\db_init.sql:/docker-entrypoint-initdb.d/init.sql -d postgres


# This starts the pgadmin (GUI)

docker run --name my-pgadmin -p 82:80 -e PGADMIN_DEFAULT_EMAIL=temp@gmail.com -e PGADMIN_DEFAULT_PASSWORD=0000 -d dpage/pgadmin4
```

### Accessing the Database using pgAdmin

`pgAdmin` will take a moment to load. Wait until

```
docker ps
docker inspect ecoyah_db
# Copy out the IPAddress, this will be used to connect later.

# Log in GUI using temp@gmail.com and 0000
# Register - Server
# Go to `Connection`, paste in the Host name/address, port 5432, username postgres, password root
```

You should be able to see the prepopulated database if you had copid in the `db_init.sql` file. 