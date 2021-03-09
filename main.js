const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

const data = [
  {
    id: "1",
    name: "test1",
  },
  {
    id: "2",
    name: "test2",
  },
  {
    id: "3",
    name: "test2",
  },
  {
    id: "4",
    name: "test2",
  },
  {
    id: "5",
    name: "test2",
  },
];

// Read all data
app.get("/", (req, res) => {
  res.send(data);
});

// Read one specific data
app.get("/:id", (req, res) => {
  const requestedInfo = data.find((element) => element.id === req.params.id);
  //   Checking if resource exists
  if (!requestedInfo) {
    console.log(data);
    return res.status(404).send("Requested information is not in our database");
  }
  res.send(requestedInfo);
});

// add specific information
app.post("/", (req, res) => {
  const { error } = verifyName(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }
  data.push({
    id: (data.length + 1).toString(),
    name: req.body.name,
  });
  res.send(`Added ${req.body.name}`);
});

// Update specific record
app.put("/:id", (req, res) => {
  const { error } = verifyName(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }
  const item = data.find((item) => item.id == req.params.id);
  //   console.log(`item is ${item}`);
  item.name = req.body.name;
  res.send(`Updated id of ${item.id} with name of ${item.name}`);
});

// Delete a record
app.delete("/:id", (req, res) => {
  const item = data.find((item) => item.id == req.params.id);
  // Check if it exists in our database
  if (!item) {
    return res
      .status(400)
      .send(
        `Item with id of ${req.params.id} is not found in our database. Please try again.`
      );
  }
  // If it exists, get its index and delete from data

  const index = data.indexOf(item);
  //   console.log(index);
  data.splice(index, 1);
  res.send(`Deleted ${item.id} and ${item.name}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Listening on port ${PORT}`));

function verifyName(nameObj) {
  //   console.log(nameObj);
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  console.log(schema.validate(nameObj));
  return schema.validate(nameObj);
}
