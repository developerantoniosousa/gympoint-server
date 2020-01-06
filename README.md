# Gympoint Servidor

## instalação

# Baixe o projeto

```
$ git clone https://github.com/developerantoniosousa/gympoint-server
```

Defina as variáveis ambiente, basta fazer uma cópia do arquivo .env.example para .env e definir as suas configurações.
`Nota: utilize banco de dados relacional`

# Instalação das dependências

```
$ npm i
```

# Criando as tabelas no banco de dados

```
$ npx sequelize db:migrate
```

# Criando usuário administrador

```
$ npx sequelize db:seed:all
```

# Executando a aplicação

```
$ npm run queue
$ npm run dev
```
