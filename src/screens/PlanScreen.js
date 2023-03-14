import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import "./PlanScreen.css";
import { loadStripe } from "@stripe/stripe-js";

function PlanScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);

  console.log(products);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        //show an error to your customer and
        //inspect your cloud function logs in the firebase console
        alert(`An erroe occurred: ${error.message}`);
      }
      if (sessionId) {
        //we have a session, let's redirect to checkout
        //Init stripe
        const stripe = await loadStripe(
          "pk_test_51Mg591SCsk1qG0ryHFONqEXKNusavxmhz7DA1Jwpi4uVTUCrPJcv7hmklDTZ4biNlx0uQSRKNsgmC907VnlvVNO600GcrcpVjj"
        );
        stripe.redirectToCheckout({sessionId});
      }
    });
  };

  return (
    <div className="planScreen">
      {Object.entries(products).map(([productId, productData]) => {
        //add some logic to check user subscription is active

        return (
          <div className="planScreen_plans">
            <div className="planScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button onClick={() => loadCheckout(productData.prices.priceId)}>
              Subscribe
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlanScreen;
