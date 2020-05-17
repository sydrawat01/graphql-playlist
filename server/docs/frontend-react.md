# Adding a front-end

So this is how our project looks currently:

![alt text](../assets/proj-overview.png 'Project Overview')

We have our `express app` and `graphql server` built on `nodejs`, and we've hooked this up with `mongodb`. So, when we make test requests from the front-end tool `graphiql`, it sends it to the `server`, and the `resolve()` functions go to `mongodb` and return the data to the `server`, which is then determining what data to send back to client via `graphql` query.

We'll replace `Graphiql` with `React` and `Apollo`.

`Apollo` is a graphql `client` we use to bind `graphql` to our application which is written in a JS framework (in our case, a library: React).

![alt text](../assets/react-app.png 'The React App with Apollo GraphQL Client')

## `create-react-app`

Let's start creating the `client` side front-end.

We'll use `create-react-app` template to create a boilerplate for us to start with.

- Go to `graphql-playlist` folder root.
- On the terminal, type `npx create-react-app client` and hit <kbd>Enter</kbd>.
- We give the name `client` to this react app because it will contain all of out front-end code.

### Running client-server

We need to host our server on port `4000` continuously and our front-end on port `3000` during development.

- Server: Go to `server/` and run `npm run dev`
- Client: Go to `client/` and run `npm start`
