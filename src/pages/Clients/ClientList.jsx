import React from "react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ClientList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getClients();
  }, []);


  async function getClients() {
    const { data } = await supabase.from("clients").select("*");
    setClients(data);
  }

  return (
    <div>
      <h1>Client List</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <div>Name: {client.name} {client.last_name}</div>
            <div>Email: {client.email}</div>
            <div>Phone: {client.phone_number}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;