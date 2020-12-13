import { ApolloClient, ApolloProvider } from "@apollo/client";
import { cache } from "./cache";
import React from "react";
import ReactDOM from "react-dom";
import Pages from "./pages/index.jsx";
import injectStyles from "./styles";

const client = new ApolloClient({
  cache,
  uri: "http://localhost:3000/graphql",
  headers: {
    authorization: localStorage.getItem("token") || "",
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById("root")
);
