import axios from "axios";

export const verifyEmail = async (req, res) => {
  try {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const email = req.body.email;
    const isVaild = emailRegex.test(email);
    console.log("Email is", isVaild);
    const parts = email.split("@");
    const domain = parts[1];
    const url = `https://dns.google/resolve?name=${domain}&type=MX`;
    const response = await axios.get(url);
    if (response.data.Answer !== undefined) {
      const isValidMxRecord = true;
      const result = response.data.Answer;

      const MXRecord = result.map((item) => item.data);
      console.log(MXRecord);

      

      const conclusion = {
        isValid: isVaild,
        isValidMXrecord: isValidMxRecord,
        MXRecord:MXRecord,
        result:true
      }
      res.status(200).json(conclusion);
    } else {
        const isValidMxRecord = false;
        const conclusion = {
            isValid: isVaild,
            isValidMXrecord: isValidMxRecord,
            result: false
          }
          res.status(200).json(conclusion);
    }

    
  } catch (error) {
    return res.status(401).json({
      message: "Server Error",
    });
  }
};
