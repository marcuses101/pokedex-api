require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const pokemons = require("./pokedex.json").pokemon;

const app = express();
const PORT = process.env.PORT || 8000;

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];
app.use(morgan("dev"));

function handleGetTypes(req, res) {
  res.json(validTypes);
}

function handleGetPokemon(req, res) {
  const name = req.query.name?.toLowerCase() || null;
  const type = req.query.type?.toLowerCase() || null;

  if (type && !validTypes.some((pokeType) => pokeType.toLowerCase() === type))
    return res.status(400).send("invalid type");

  const filteredByName = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(name)
  );
  const filteredByType = pokemons.filter((pokemon) =>
    pokemon.type.map((type) => type.toLowerCase()).includes(type)
  );

  const filteredByBoth = pokemons.filter((pokemon) => {
    return (
      pokemon.type.map((type) => type.toLowerCase()).includes(type) &&
      pokemon.name.toLowerCase().includes(name)
    );
  });

  if (name && type) return res.json(filteredByBoth);
  if (name && !type) return res.json(filteredByName);
  if (!name && type) return res.json(filteredByType);
  if (!name && !type) return res.json(pokemons);
}

function validateBearerToken(req, res, next) {
  const auth = req.headers.authorization?.split(" ")[1];
  if (auth === process.env.API_TOKEN) return next();
  res.status(401).send("Not Authorized");
}

app.use(validateBearerToken);

app.use((error, req, res, next) => {
  let response = {};
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
});

app.get("/types", handleGetTypes);

app.get("/pokemon", handleGetPokemon);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
