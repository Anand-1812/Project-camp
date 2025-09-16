import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

let myUserName = process.env.username;
console.log("Name: ", myUserName);

console.log("Starting....");
