const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "calculator-microservice" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

const app = express();

app.set("view engine", "hbs");
app.set("public_html", path.join(__dirname, "public_html"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var error;
var result;
var info;
var num1;
var num2;
var disableInput = false;

app.get("/", (req, res) => {
  num1 = 0;
  num2 = 0;
  res.render("home", { num1, num2 });
});

app.post("/add", (req, res) => {
  info = `Add operation requested: ${req.body.num1} add ${req.body.num2}`;

  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New add operation requested: ${num1} + ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;
    error = "Invalid input. Please provide + values.";
    return res.render("home", { error, num1, num2 });
  }

  result = num1 + num2;
  res.render("home", { num1, num2, result, info });
});

app.post("/subtract", (req, res) => {
  info = `Subtract operation requested: ${req.body.num1} - ${req.body.num2}`;

  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New add operation requested: ${num1} - ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;
    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  result = num1 - num2;
  res.render("home", { num1, num2, result, info });
});

app.post("/multiply", (req, res) => {
  info = `Multiply operation requested: ${req.body.num1} * ${req.body.num2}`;

  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New multiply operation requested: ${num1} * ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;
    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  result = num1 * num2;
  res.render("home", { num1, num2, result, info });
});

app.post("/divide", (req, res) => {
  info = `Divide operation requested: ${req.body.num1} / ${req.body.num2}`;

  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New divide operation requested: ${num1} / ${num2}`,
  });

  if (num2 == 0) {
    num1 = 0;
    num2 = 0;

    error = "Cannot divide by 0";
    return res.render("home", { error, num1, num2 });
  } else if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;

    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  result = num1 / num2;
  res.render("home", { num1, num2, result, info });
});

app.post("/exponentiate", (req, res) => {
  info = `Exponentiate operation requested: ${req.body.num1} e^ ${req.body.num2}`;

  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New exponentiate operation requested: ${num1} to the power of ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;
    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  result = Math.pow(num1, num2);
  res.render("home", { num1, num2, result, info });
});

app.post("/sqrt", (req, res) => {
  info = `Square root operation requested: ${req.body.num1} square root ${req.body.num2}`;

  disableInput = true;
  const info2 = "Disabled second input temporarily, click reset to enable";
  num1 = parseFloat(req.body.num1);

  logger.log({
    level: "info",
    message: `New square root operation requested: sqrt(${num1})`,
  });

  if (isNaN(num1)) {
    error = "Invalid input. Please provide a numeric value.";
    return res.render("home", { error, disableInput, info2, num1 });
  }

  if (num1 < 0) {
    error = "Cannot calculate square root of a negative number.";
    return res.render("home", { error, disableInput, info2, num1 });
  }

  const result = Math.sqrt(num1);
  res.render("home", { num1, result, disableInput, info, info2 });
});

app.post("/modulo", (req, res) => {
  info = `Modulo operation requested: ${req.body.num1} % ${req.body.num2}`;

  const num1 = parseFloat(req.body.num1);
  const num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New modulo operation requested: ${num1} % ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  if (num2 === 0) {
    error = "Cannot divide by zero.";
    return res.render("home", { error, num1, num2 });
  }

  const result = num1 % num2;
  res.render("home", { num1, num2, result, info });
});

app.post("/factorial", (req, res) => {
  info = `Factorial operation requested: ${req.body.num1} ! ${req.body.num2}`;

  disableInput = true;
  const info2 = "Disabled second input temporarily, click reset to enable";
  num1 = parseInt(req.body.num1);

  logger.log({
    level: "info",
    message: `New factorial operation requested: ${num1}!`,
  });

  if (isNaN(num1) || num1 < 0) {
    error = "Invalid input. Please provide a non-negative integer.";
    return res.render("home", { error, disableInput, info2, num1 });
  }

  let result = 1;
  for (let i = 2; i <= num1; i++) {
    result *= i;
  }

  res.render("home", { num1, result, disableInput, info2, num1, info });
});

app.post("/reset", (req, res) => {
  error = "";
  result = "";
  num1 = 0;
  num2 = 0;
  disableInput = false;

  res.render("home", { num1, num2, error, result, disableInput });
});

//endpoint to simulate container health check failure
app.get("/health-check", (req, res) => {
  res.status(500).json("Health check failed!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
