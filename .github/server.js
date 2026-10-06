import express from "express";

import cors from "cors";

import crypto from "crypto";

import dotenv from "dotenv";

import {
  createClient
} from "@supabase/supabase-js";


dotenv.config();


const app = express();


/* =========================================================
   ENVIRONMENT
   ========================================================= */

const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN;

const FRONTEND_URL =
  process.env.FRONTEND_URL;

const PAYU_KEY =
  process.env.PAYU_KEY;

const PAYU_SALT =
  process.env.PAYU_SALT;

const PAYU_PAYMENT_URL =
  process.env.PAYU_PAYMENT_URL ||
  "https://secure.payu.in/_payment";

const BACKEND_URL =
  process.env.BACKEND_URL;


if (
  !PAYU_KEY ||
  !PAYU_SALT
) {

  console.warn(
    "PayU credentials are not configured."
  );

}


if (
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {

  console.warn(
    "Supabase server credentials are not configured."
  );

}


/* =========================================================
   SUPABASE SERVER CLIENT
   ========================================================= */

const supabase =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY

    ? createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            persistSession: false
          }
        }
      )

    : null;


/* =========================================================
   EXPRESS
   ========================================================= */

app.use(
  cors({

    origin: FRONTEND_ORIGIN,

    methods: [
      "GET",
      "POST"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]

  })
);


app.use(
  express.json({
    limit: "256kb"
  })
);


app.use(
  express.urlencoded({
    extended: false
  })
);


/* =========================================================
   AUTHORITATIVE PRODUCT CATALOG
   ========================================================= */

const catalog = [

  { id: 1, name: "Wireless Bluetooth Earbuds", price: 999, stock: 100 },
  { id: 2, name: "Smart Watch", price: 1499, stock: 100 },
  { id: 3, name: "Cotton T-Shirt", price: 499, stock: 100 },
  { id: 4, name: "Running Shoes", price: 1299, stock: 100 },
  { id: 5, name: "LED Desk Lamp", price: 699, stock: 100 },
  { id: 6, name: "Portable Bluetooth Speaker", price: 1199, stock: 100 },
  { id: 7, name: "USB-C Fast Charger", price: 799, stock: 100 },
  { id: 8, name: "Braided USB-C Cable", price: 299, stock: 100 },
  { id: 9, name: "Universal Phone Stand", price: 249, stock: 100 },
  { id: 10, name: "Premium Phone Case", price: 399, stock: 100 },

  { id: 11, name: "Wireless Keyboard", price: 899, stock: 100 },
  { id: 12, name: "Wireless Mouse", price: 499, stock: 100 },
  { id: 13, name: "Laptop Backpack", price: 999, stock: 100 },
  { id: 14, name: "USB Hub 4-Port", price: 599, stock: 100 },
  { id: 15, name: "Laptop Cooling Pad", price: 799, stock: 100 },

  { id: 16, name: "Men's Casual Shirt", price: 699, stock: 100 },
  { id: 17, name: "Men's Regular Fit Jeans", price: 1199, stock: 100 },
  { id: 18, name: "Women's Casual Top", price: 599, stock: 100 },
  { id: 19, name: "Women's Denim Jeans", price: 1299, stock: 100 },
  { id: 20, name: "Hooded Sweatshirt", price: 899, stock: 100 },

  { id: 21, name: "Men's Running Shoes", price: 1399, stock: 100 },
  { id: 22, name: "Women's Walking Shoes", price: 1299, stock: 100 },
  { id: 23, name: "Casual Sneakers", price: 1099, stock: 100 },
  { id: 24, name: "Comfort Slippers", price: 399, stock: 100 },
  { id: 25, name: "Sports Sandals", price: 699, stock: 100 },

  { id: 26, name: "Travel Backpack", price: 1199, stock: 100 },
  { id: 27, name: "Laptop Bag", price: 899, stock: 100 },
  { id: 28, name: "Women's Handbag", price: 999, stock: 100 },
  { id: 29, name: "Travel Duffle Bag", price: 1099, stock: 100 },
  { id: 30, name: "School Backpack", price: 799, stock: 100 },

  { id: 31, name: "Face Wash", price: 249, stock: 100 },
  { id: 32, name: "Moisturizing Face Cream", price: 349, stock: 100 },
  { id: 33, name: "Shampoo", price: 299, stock: 100 },
  { id: 34, name: "Hair Conditioner", price: 329, stock: 100 },
  { id: 35, name: "Body Lotion", price: 279, stock: 100 },

  { id: 36, name: "Stainless Steel Water Bottle", price: 499, stock: 100 },
  { id: 37, name: "Non-Stick Frying Pan", price: 899, stock: 100 },
  { id: 38, name: "Kitchen Storage Container Set", price: 699, stock: 100 },
  { id: 39, name: "Electric Kettle", price: 999, stock: 100 },
  { id: 40, name: "Stainless Steel Lunch Box", price: 449, stock: 100 },

  { id: 41, name: "Decorative Wall Clock", price: 599, stock: 100 },
  { id: 42, name: "Artificial Indoor Plant", price: 399, stock: 100 },
  { id: 43, name: "Decorative Cushion Set", price: 699, stock: 100 },
  { id: 44, name: "LED String Lights", price: 299, stock: 100 },
  { id: 45, name: "LED Table Lamp", price: 699, stock: 100 },

  { id: 46, name: "Premium Basmati Rice 5kg", price: 699, stock: 100 },
  { id: 47, name: "Wheat Flour 5kg", price: 299, stock: 100 },
  { id: 48, name: "Toor Dal 1kg", price: 159, stock: 100 },
  { id: 49, name: "Organic Green Tea", price: 249, stock: 100 },
  { id: 50, name: "Mixed Dry Fruits 500g", price: 599, stock: 100 },

  { id: 51, name: "Yoga Mat", price: 499, stock: 100 },
  { id: 52, name: "Adjustable Dumbbell", price: 1499, stock: 100 },
  { id: 53, name: "Resistance Band Set", price: 399, stock: 100 },
  { id: 54, name: "Sports Water Bottle", price: 349, stock: 100 },
  { id: 55, name: "Fitness Skipping Rope", price: 249, stock: 100 },

  { id: 56, name: "Hardcover Notebook", price: 199, stock: 100 },
  { id: 57, name: "Ball Pen Pack", price: 99, stock: 100 },
  { id: 58, name: "Geometry Box", price: 149, stock: 100 },
  { id: 59, name: "Study Planner", price: 179, stock: 100 },
  { id: 60, name: "Sticky Notes Set", price: 129, stock: 100 },

  { id: 61, name: "Gaming Mouse", price: 699, stock: 100 },
  { id: 62, name: "Gaming Keyboard", price: 1299, stock: 100 },
  { id: 63, name: "Gaming Headset", price: 999, stock: 100 },
  { id: 64, name: "RGB Gaming Mouse Pad", price: 599, stock: 100 },
  { id: 65, name: "Mobile Gaming Controller", price: 899, stock: 100 },

  { id: 66, name: "Building Blocks Set", price: 499, stock: 100 },
  { id: 67, name: "Remote Control Car", price: 799, stock: 100 },
  { id: 68, name: "Educational Puzzle Set", price: 299, stock: 100 },
  { id: 69, name: "Kids Drawing Kit", price: 349, stock: 100 },
  { id: 70, name: "Soft Teddy Bear", price: 599, stock: 100 },

  { id: 71, name: "Car Phone Holder", price: 349, stock: 100 },
  { id: 72, name: "Car Cleaning Kit", price: 499, stock: 100 },
  { id: 73, name: "Car Seat Cushion", price: 699, stock: 100 },
  { id: 74, name: "Bike Phone Holder", price: 299, stock: 100 },
  { id: 75, name: "Car Emergency Tool Kit", price: 999, stock: 100 },

  { id: 76, name: "Hard Shell Cabin Luggage", price: 1799, stock: 100 },
  { id: 77, name: "Travel Neck Pillow", price: 399, stock: 100 },
  { id: 78, name: "Passport Holder", price: 249, stock: 100 },
  { id: 79, name: "Travel Organizer Pouch", price: 299, stock: 100 },
  { id: 80, name: "Foldable Travel Bag", price: 499, stock: 100 },

  { id: 81, name: "Gardening Tool Set", price: 599, stock: 100 },
  { id: 82, name: "Plant Watering Can", price: 299, stock: 100 },
  { id: 83, name: "Outdoor Camping Tent", price: 1999, stock: 100 },
  { id: 84, name: "LED Solar Garden Light", price: 399, stock: 100 },
  { id: 85, name: "Outdoor Folding Chair", price: 899, stock: 100 },

  { id: 86, name: "Pet Feeding Bowl", price: 249, stock: 100 },
  { id: 87, name: "Pet Grooming Brush", price: 199, stock: 100 },
  { id: 88, name: "Pet Collar", price: 149, stock: 100 },
  { id: 89, name: "Pet Toy Ball", price: 129, stock: 100 },
  { id: 90, name: "Pet Travel Bag", price: 899, stock: 100 },

  { id: 91, name: "Office Desk Organizer", price: 349, stock: 100 },
  { id: 92, name: "Ergonomic Office Chair", price: 4999, stock: 100 },
  { id: 93, name: "LED Desk Light", price: 599, stock: 100 },
  { id: 94, name: "Document File Organizer", price: 249, stock: 100 },
  { id: 95, name: "A4 Printer Paper Pack", price: 399, stock: 100 },

  { id: 96, name: "Classic Analog Watch", price: 999, stock: 100 },
  { id: 97, name: "Sunglasses", price: 499, stock: 100 },
  { id: 98, name: "Leather Wallet", price: 399, stock: 100 },
  { id: 99, name: "Gift Hamper", price: 799, stock: 100 },
  { id: 100, name: "Premium Gift Box", price: 599, stock: 100 }

];


/* =========================================================
   HASH
   ========================================================= */

function sha512(value) {

  return crypto
    .createHash("sha512")
    .update(value, "utf8")
    .digest("hex");

}


/* =========================================================
   HEALTH
   ========================================================= */

app.get(
  "/health",
  (_req, res) => {

    res.json({
      ok: true,
      service: "blurancy-cartify"
    });

  }
);


/* =========================================================
   CREATE PAYU PAYMENT
   ========================================================= */

app.post(
  "/api/payu/create-payment",
  async (req, res) => {

    try {

      if (
        !PAYU_KEY ||
        !PAYU_SALT ||
        !BACKEND_URL ||
        !FRONTEND_URL
      ) {

        return res
          .status(503)
          .json({
            error:
              "Payment backend is not fully configured."
          });

      }


      const {
        customer,
        items
      } = req.body || {};


      if (
        !customer?.name ||
        !customer?.email ||
        !customer?.phone ||
        !customer?.address ||
        !/^\d{6}$/.test(
          customer.pin
        )
      ) {

        return res
          .status(400)
          .json({
            error:
              "Invalid customer information."
          });

      }


      if (
        !Array.isArray(items) ||
        !items.length ||
        items.length > 50
      ) {

        return res
          .status(400)
          .json({
            error:
              "Invalid cart."
          });

      }


      let total = 0;

      const validatedItems = [];


      for (
        const item of items
      ) {

        const product =
          catalog.find(
            product =>
              product.id ===
              Number(
                item.productId
              )
          );


        const quantity =
          Number(
            item.quantity
          );


        if (
          !product ||
          !Number.isInteger(
            quantity
          ) ||
          quantity < 1 ||
          quantity > product.stock
        ) {

          return res
            .status(400)
            .json({
              error:
                "Invalid product or quantity."
            });

        }


        total +=
          product.price *
          quantity;


        validatedItems.push({

          productId:
            product.id,

          quantity:
            quantity,

          unitPrice:
            product.price,

          name:
            product.name

        });

      }


      const txnid =
        "BC" +
        Date.now()
          .toString(36)
          .toUpperCase() +
        crypto
          .randomBytes(4)
          .toString("hex")
          .toUpperCase();


      const amount =
        total.toFixed(2);


      const productinfo =
        "Blurancy Cartify Order";


      const firstname =
        customer.name
          .slice(0, 60);


      const email =
        customer.email
          .slice(0, 100);


      const phone =
        customer.phone
          .slice(0, 20);


      /*
        CLASSIC PAYU HOSTED CHECKOUT HASH

        key|txnid|amount|productinfo|firstname|email|
        udf1|udf2|udf3|udf4|udf5||||||SALT
      */

      const hashString =
        `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;


      const hash =
        sha512(hashString);


      /* =====================================================
         SAVE PENDING ORDER
         ===================================================== */

      if (supabase) {

        const {
          error
        } =
          await supabase
            .from("orders")
            .insert({

              txnid:

                txnid,

              status:

                "pending",

              amount:

                Number(amount),

              customer:

                customer,

              items:

                validatedItems,

              payment_provider:

                "payu"

            });


        if (error) {

          console.error(
            "Order insert error:",
            error
          );

          return res
            .status(500)
            .json({
              error:
                "Unable to create order."
            });

        }

      }


      const fields = {

        key:
          PAYU_KEY,

        txnid:
          txnid,

        amount:
          amount,

        productinfo:
          productinfo,

        firstname:
          firstname,

        email:
          email,

        phone:
          phone,

        surl:
          `${BACKEND_URL}/api/payu/success`,

        furl:
          `${BACKEND_URL}/api/payu/failure`,

        udf1:
          "",

        udf2:
          "",

        udf3:
          "",

        udf4:
          "",

        udf5:
          "",

        hash:
          hash

      };


      return res.json({

        formAction:
          PAYU_PAYMENT_URL,

        fields:
          fields

      });


    } catch (error) {

      console.error(
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Unable to create payment."
        });

    }

  }
);


/* =========================================================
   PAYU CALLBACK
   ========================================================= */

async function handlePayUCallback(
  req,
  res,
  routeStatus
) {

  try {

    const body =
      req.body || {};


    const txnid =
      String(
        body.txnid || ""
      );


    const status =
      String(
        body.status ||
        routeStatus ||
        "unknown"
      );


    if (!txnid) {

      return res
        .status(400)
        .send(
          "Missing transaction ID"
        );

    }


    /*
      IMPORTANT:

      Do not treat the browser redirect alone
      as proof of successful payment.

      Production implementation must validate
      the PayU response hash and reconcile the
      payment using the PayU verification/webhook
      contract configured for the merchant.
    */


    if (supabase) {

      await supabase
        .from("orders")
        .update({

          callback_status:
            status,

          callback_payload:
            body,

          updated_at:
            new Date().toISOString()

        })
        .eq(
          "txnid",
          txnid
        );

    }


    return res.redirect(

      `${FRONTEND_URL}` +
      `?payment=${encodeURIComponent(status)}` +
      `&txnid=${encodeURIComponent(txnid)}`

    );


  } catch (error) {

    console.error(
      error
    );

    return res
      .status(500)
      .send(
        "Callback error"
      );

  }

}


app.post(
  "/api/payu/success",
  (req, res) =>
    handlePayUCallback(
      req,
      res,
      "success"
    )
);


app.post(
  "/api/payu/failure",
  (req, res) =>
    handlePayUCallback(
      req,
      res,
      "failure"
    )
);


/* =========================================================
   PAYU WEBHOOK
   ========================================================= */

app.post(
  "/api/payu/webhook",
  async (req, res) => {

    try {

      const body =
        req.body || {};


      if (!body.txnid) {

        return res
          .status(400)
          .json({
            ok: false,
            error:
              "Missing txnid"
          });

      }


      /*
        Configure the exact PayU webhook
        event/hash verification required by
        your PayU merchant account.

        Do not mark an order as paid merely
        because this endpoint was called.
      */


      if (supabase) {

        await supabase
          .from("orders")
          .update({

            webhook_payload:
              body,

            updated_at:
              new Date().toISOString()

          })
          .eq(
            "txnid",
            String(
              body.txnid
            )
          );

      }


      return res.sendStatus(200);


    } catch (error) {

      console.error(
        error
      );

      return res.sendStatus(
        500
      );

    }

  }
);


/* =========================================================
   START SERVER
   ========================================================= */

app.listen(
  Number(
    process.env.PORT || 8080
  ),
  () => {

    console.log(
      "Blurancy Cartify backend running"
    );

  }
);
