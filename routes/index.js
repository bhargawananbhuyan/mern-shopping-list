const router = require("express").Router();

const ShopItem = require("../models/ShopItem");

/*
  @GET
  @PATH /grocery/getAll
  @USE Get all shopping items
*/
router.get("/getAll", async (_, res) => {
  try {
    const allItems = await ShopItem.find().sort({ _id: -1 });
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
  const newItem = new ShopItem({ itemName });
  try {
    const savedItem = await newItem.save();
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
    );
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
    });
    res.status(200).json({ result: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
