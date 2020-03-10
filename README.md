# Gympoint Server

### Installation

### Download the project

```
$ git clone https://github.com/developerantoniosousa/gympoint-server
```

Set the environment variables, just make a copy of the .env.example file to .env and define your settings.
`Note: use relational database`

### Installation of dependencies

```
$ npm i
```

### Creating the tables in the database

```
$ npx sequelize db:migrate
```

### Creating administrator user

```
$ npx sequelize db:seed:all
```

### Running the application

```
$ npm run queue
$ npm run dev
```
