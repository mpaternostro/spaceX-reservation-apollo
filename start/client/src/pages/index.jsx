import React, { Fragment } from "react";
import { Router } from "@reach/router";

import Launch from "./launch.jsx";
import Launches from "./launches.jsx";
import Cart from "./cart";
import Profile from "./profile.jsx";
import { Footer, PageContainer } from "../components";

export default function Pages() {
  return (
    <Fragment>
      <PageContainer>
        <Router primary={false} component={Fragment}>
          <Launches path="/" />
          <Launch path="launch/:launchId" />
          <Cart path="cart" />
          <Profile path="profile" />
        </Router>
      </PageContainer>
      <Footer />
    </Fragment>
  );
}
