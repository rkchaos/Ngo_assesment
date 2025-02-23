const razorpayInstance = require("../config/paymentConfig")
const crypto = require("crypto");
const Tranasation = require("../models/Tranaction");
exports.checkout = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    }

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
      console.log(order)
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
}


exports.verify = async (req, res) => {
  const { name,
    email,
    referralCode,
    amount,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto.createHmac("sha256", process.env.RAZER_PAY_API_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      // Uncomment this to save transaction if needed
      const payment = new Tranasation({
        name,
        email,
        referralCode,
        amount,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        date: new Date().toISOString()
      });
      await payment.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified and saved successfully",
        paymentId: razorpay_payment_id,
      })
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.findTransation = async (req, res) => {
  let { referralCode } = req.body

  try {
    let findReferalcode = await Tranasation.find({ referralCode: referralCode })
    if (findReferalcode) {
      return res.status(200).json({ Tranasation: findReferalcode })
    } else {
      return res.status(400).json({
        success: false,
        message: "find transation failed",
      });
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }

}

exports.findPercentage = async (req, res) => {
  try {
    const { referralCode } = req.body;


    let transactions = await Tranasation.find({ referralCode: referralCode });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }


    const totalAmountReceived = transactions.reduce((sum, item) => {
      const amount = parseFloat(item.amount);
      return isNaN(amount) ? sum : sum + amount;
    }, 0);

    if (totalAmountReceived === 0) {
      return res.status(400).json({ message: "Invalid or zero amount transactions" });
    }


    const totalAmount = 100000;


    const percentage = (totalAmountReceived / totalAmount) * 100;

    res.json({
      message: "Percentage calculated successfully",
      totalAmountReceived,
      percentage: percentage.toFixed(3)
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
