import React from "react";
import { useParams } from "react-router-dom";

const Client = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Specific Client Page</h1>
      <h2>This page shows a client with the ID of {id}</h2>
    </div>
  );
};

export default Client;
