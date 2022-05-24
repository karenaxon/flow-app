import Head from "next/head";
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import "bootstrap/dist/css/bootstrap.css";

export default function Home() {
  const [user, setUser] = useState({ loggedIn: null });
  const [name, setName] = useState("");

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
      import Profile from 0xProfile
      
      pub fun main(address: Address): Profile.ReadOnly? {
        return Profile.read(address)
      }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });
    setName(profile?.name ?? "No Profile");
  };

  const AuthedState = () => {
    return (
      <div className="container">
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div className="my-2">Profile Name: {name ?? "--"}</div>
        <button className="btn btn-dark" onClick={sendQuery}>
          Get Profile Name
        </button>
        <button className="btn btn-dark mx-2" onClick={fcl.unauthenticate}>
          Log Out
        </button>
      </div>
    );
  };

  const UnauthenticatedState = () => {
    return (
      <div className="container">
        <button className="btn btn-dark" onClick={fcl.logIn}>
          Log In
        </button>
        <button className="btn btn-dark mx-2" onClick={fcl.signUp}>
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h1>Flow App</h1>
      {user.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
    </div>
  );
}
