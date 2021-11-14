In order to create a node server in a system, we need to have node locally installed in the system. We too need node package manager to manage the packages of our node projects. To get started, we need to create a new node project by writing the command `npm init -y`. This would initialize a node project for us and would help use to manage our projects effectively.

To create a server, we've installed express.js, which makes it easy for us to create a node server. To manage our mongoDB database, we use mongoose.js.
Also to manage our environment variables, we use the dotenv package.
Basically to create a server using express.js, we need to execute the following code:

```js
require("dotenv").config(); // this would allow us to access our environment variables.
const express = require("express"); // importing the module

const app = express(); // initializing the app
const port = process.env.PORT || 5000; // this is the port in which the server would function

app.get("/", (req, res) => {
  res.send("hello world");
}); // the CRUD methods in express takes a route as the first parameter and a callback function containing the request and response object.
// here res.send sends back a "hello world" when a client calls it.

// lastly we need to listen to the server
app.listen(port, () => {
  console.log(`listenting to app on port ${port}`);
});
```

However, in our app, we need to create a database in mongoDB, connect the database to a remote mongoDB server and apply CRUD functions on that database.
At first, we configure a remote database in Mongo Atlas. We then take the connection URL and save it into the .env file. This is the file where we save our environment variables. To create a new database, at first we need a model. To create a mongoDB model we implement the following code:

```js
const {model Schema} = require("mongoose");

// model function of mongoose creates a mongoDB model for us. It takes the name of the model as the first parameter and the schema as the second parameter.
module.exports = model(
  "ShopItem",
  new Schema({
    itemName: { type: String, required: true },
    isPurchased: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
  })
);
```

Now we connect the mongoose server to our local server. We do so by converting our server code to an asynchronous function and call it later. We do so so that we can **await** the mongoDB server connection.

```js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 5000;

(async () => {
  const app = express();

  // middlewares
  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000" }));
  // we use cors so that we can use cross-origin-resource-sharing i.e. access the server from our
  //frontend which is running in another port

  // this is where we try to connect to the mongoDB server
  // we pass the MONGODB_URI parameter stored in .env file as the first parameter to the connect function and a few configurations as the second parameter
  // we run the connection in a try-catch block so that our connection errors are handled effectively.
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("connected to db...");
  } catch (error) {
    console.log(error.message);
  }

  app.use("/grocery", require("./routes"));

  app.listen(port, () => {
    console.log(`listening to app on port ${port}...`);
  });
})();
```

In order to use routes as a middleware, such that we can seperate our the routes from index.js file, we create a routes folder and an index.js folder in it. It's here we create our routes and apply this folder as a middleware to our app.

```js
const router = require("express").Router(); // this creates an instance of the router object of express
// we can now create multiple CRUD applications and API endpoints using this database.

const ShopItem = require("../models/ShopItem"); // importing our mongoDB model

/*
  @GET
  @PATH /grocery/getAll
  @USE Get all shopping items
*/
router.get("/getAll", async (_, res) => {
  try {
    const allItems = await ShopItem.find().sort({ _id: -1 }); // gets all items inversely sorted
    res.status(200).json(allItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/*
  @POST
  @PATH /grocery/add
  @USE Add a new item
*/
router.post("/add", async (req, res) => {
  const { itemName } = req.body;
  const newItem = new ShopItem({ itemName }); // creating a new item
  try {
    const savedItem = await newItem.save(); // saving a new item
    res.json({ result: "success", data: savedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/*
  @PUT
  @PATH /grocery/updatePurchaseStatus
  @USE Update an existing item
*/
router.put("/updatePurchaseStatus", async (req, res) => {
  try {
    const updatedItem = await ShopItem.findByIdAndUpdate(
      { _id: req.body._id },
      { isPurchased: req.body.isPurchased },
      { new: true }
    ); // updating an item
    res.status(200).json({ result: "success", data: updatedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/*
    @DELETE
    @PATH /grocery/deleteGroceryItem
    @USE Delete an existing item
  */
router.delete("/deleteGroceryItem", async (req, res) => {
  try {
    const itemToDelete = await ShopItem.findOneAndDelete({
      _id: req.body._id,
    }); // delete an item
    res.status(200).json({ result: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

Thus we have a fully functional express server that can manage CRUD applications effectively for us.
