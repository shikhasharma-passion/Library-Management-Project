const https = require("https");

https.get("https://api.ipify.org", response => {
  let data = "";

  response.on("data", chunk => {
    data += chunk;
  });

  response.on("end", () => {
    console.log(`Your public IP is: ${data.trim()}`);
    console.log("MongoDB Atlas > Network Access > Add IP Address me is IP ko allow karo.");
  });
}).on("error", error => {
  console.error("Public IP fetch failed.");
  console.error(error.message);
});
