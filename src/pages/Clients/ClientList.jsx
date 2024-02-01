import React from "react";
import { useEffect, useState } from "react";
import { useSupabase } from "../../hooks/useSupabase";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const { supabase } = useSupabase();

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
            <div>
              Name: {client.name} {client.last_name}
            </div>
            <div>Email: {client.email}</div>
            <div>Phone: {client.phone_number}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
