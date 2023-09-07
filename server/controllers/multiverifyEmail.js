import axios from "axios";

export const multiverifyEmail = async (req, res) => {
  try {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const emailArray = req.body.emails;

    const results = [];

    for (const email of emailArray) {
      const isValid = emailRegex.test(email);
      console.log(`Email ${email} is ${isValid}`);

      const parts = email.split("@");
      const domain = parts[1];
      const url = `https://dns.google/resolve?name=${domain}&type=MX`;

      try {
        const response = await axios.get(url);
        if (response.data.Answer !== undefined) {
          const isValidMxRecord = true;
          const result = response.data.Answer;
          const MXRecord = result.map((item) => item.data);
          console.log(`MX Record for ${email}:`, MXRecord);
          results.push({
            email,
            isValid,
            isValidMXrecord: isValidMxRecord,
            MXRecord,
            result: true,
          });
        } else {
          const isValidMxRecord = false;
          results.push({
            email,
            isValid,
            isValidMXrecord: isValidMxRecord,
            result: false,
          });
          
        }
      } catch (error) {
        console.error(`Error while verifying ${email}:`, error.message);
        results.push({
          email,
          isValid,
          isValidMXrecord: false,
          result: false,
        });
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Server Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
