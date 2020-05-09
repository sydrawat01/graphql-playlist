# Using `mongoose` and MongoDB Atlas

We'll need to create a [MongoDB Atlas](https://account.mongodb.com/account/login) account before we can proceed with connecting our app to mongoDB.

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) is a global cloud database service for modern applications. We can deploy fully managed MongoDB across AWS, Azure or GCP.

They have paid plans as well, but we'll be using the free resources for this demo.

## Setting up MongoDB Atlas

1. Create an account on [MongoDB Atlas](https://account.mongodb.com/account/login). Once logged in, you can see an empty dashboard.

2. On the top left pane, you can see a project named `Project 0`. You can either create a new project, or using this one. I'm going to use this project(`Project 0`) as it is.

3. Next, we'll have to build a new `Cluster`. Follow all the on-screen instructions to create a cluster. Keep the default options as they are

   - Cloud provider and region : AWS ,N. Virginia (us-east-1).

     ![alt text](../assets/cloudprovider-region.png 'cloud provider and region')

   - Scroll down to change the `Cluster Name`.

     ![alt text](../assets/cluster-name.png 'cluster name')

4. Once the cluster is built successfully, we have to use the `connect` button on the cluster dashboard to create an instance to connect to our cluster, here `Cluster0`.

   Here, you'll have to provide a public IP which can use the connection to the cloud hosting the mongoDB server, and provide a username and password as well.

   ![alt text](../assets/cluster-connect.png 'cluster connect')

5. When choosing a connection method, choose the 2nd option:
   `Connect Your Application`

   ![alt text](../assets/connect-app.png 'connect your application')

6. Once this is done, we can see a field `Connection String Only`. Copy this string. This is our link to the cloud mongoDB.

   ![alt text](../assets/string.png 'connection string')

   Replace the _\<password>_ with the password provided in Step 4.

## Setting up the server

Once we are done setting up the mongoDB Atlas instance, we can use the connection string to connect to the cloud db.

1. `npm i -S mongoose`

2. In the `app.js` file, connect to the mongoDB atlas instance:

```js
const URI =
  'mongodb+srv://<username>:<password>@cluster0-pyagm.mongodb.net/test?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to mongoDB Atlas!');
  })
  .catch(err => {
    console.log('error:', err.message);
  });
```

> NOTE: Replace the \<username> and \<password> fields in the connection string `URI`.

Once this setup is done, run the `dev` script using:

`npm run dev`

This will start the express server on [localhost:4000](localhost:4000)

In the terminal, we can see the output of the `console.log()` :

`connected to mongoDB Atlas!`
