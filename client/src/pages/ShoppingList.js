import { useState, useEffect } from "react";
import axios from "axios";
import MonthView from "./MonthView";

const url = "/grocery"; // local server proxied through port 5000

function ShoppingList() {
  let [shopItems, setShopItems] = useState([]);
  let [item, setItem] = useState("");

  useEffect(() => {
    const getListItems = async () => {
      const res = await axios.get(`${url}/getAll`);

      setShopItems(res.data);
    };

    getListItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (item === "") return console.log("this space can't be blank");

    await axios
      .post(`${url}/add`, {
        itemName: item,
      })
      .then(({ data: { data } }) => {
        setItem("");
        setShopItems([data, ...shopItems]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="shopping-list">
      <MonthView />

      <div className="list-view">
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Add Shopping Item"
            value={item}
            onChange={(e) => setItem(e.currentTarget.value)}
          />
        </form>
        <div>
          {shopItems &&
            shopItems.map((item, i) => (
              <section className="list-item" key={i}>
                <div
                  id={`itemName-${i}`}
                  style={{
                    textDecoration: item.isPurchased ? "line-through" : "none",
                  }}
                >
                  {item.itemName}
                </div>
                <div>
                  {/* <input
                    className="checkbox-input"
                    id={`isPurchased-${i}`}
                    type="checkbox"
                    checked={item.isPurchased}
                    onChange={async (e) => {
                      await axios
                        .put(`${url}/updatePurchaseStatus`, {
                          _id: item._id,
                          isPurchased: !item.isPurchased,
                        })
                        .then(({ data: { data } }) => {
                          item.isPurchased = data.isPurchased;
                          document.querySelector(`#isPurchased-${i}`).checked =
                            data.isPurchased;

                          document.querySelector(
                            `#itemName-${i}`
                          ).style.textDecoration = item.isPurchased
                            ? "line-through"
                            : "none";
                        })
                        .catch((error) => console.log(error.message));
                    }}
                  /> */}
                  <button
                    className="purchase-btn"
                    id={`isPurchased-${i}`}
                    style={{
                      backgroundColor: item.isPurchased
                        ? "rgb(0,200,0)"
                        : "transparent",
                    }}
                    onClick={async () => {
                      await axios
                        .put(`${url}/updatePurchaseStatus`, {
                          _id: item._id,
                          isPurchased: !item.isPurchased,
                        })
                        .then(({ data: { data } }) => {
                          item.isPurchased = data.isPurchased;
                          const purchaseBtn = document.querySelector(
                            `#isPurchased-${i}`
                          );

                          purchaseBtn.innerHTML = data.isPurchased
                            ? "Purchased"
                            : "Purchase";

                          purchaseBtn.style.backgroundColor = item.isPurchased
                            ? "rgb(0,200,0)"
                            : "transparent";

                          document.querySelector(
                            `#itemName-${i}`
                          ).style.textDecoration = item.isPurchased
                            ? "line-through"
                            : "none";
                        })
                        .catch((error) => console.log(error.message));
                    }}
                  >
                    {item.isPurchased ? "Purchased" : "Purchase"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      await axios
                        .delete(`${url}/deleteGroceryItem`, {
                          data: { _id: item._id },
                        })
                        .then(() => {
                          setShopItems(
                            shopItems.filter((item_) => item_._id !== item._id)
                          );
                        })
                        .catch((error) => console.log(error.message));
                    }}
                  >
                    x
                  </button>
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ShoppingList;
