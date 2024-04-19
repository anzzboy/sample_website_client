import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

import Code from "./Code.jsx";

/* eslint-disable react/prop-types */
function ListItem({ value, del }) {
  return (
    <>
      <li>
        {value}
        <button onClick={del}>Remove</button>
      </li>
    </>
  );
}

function Home() {
  const cookies = new Cookies();

  const [input, setInput] = useState("");
  const [msg, setMsg] = useState(cookies.get("msg") ? cookies.get("msg") : "");
  const [encode, setEncode] = useState(true);
  const [data, setData] = useState([]);
  const [file, setFile] = useState();

  const [serverStatus, setServerStatus] = useState("Server Down");

  const code = new Code();

  if (/[^0-9]/g.test(input) || input.length > 4) {
    setInput(input.slice(0, -1));
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://sample-website-server.onrender.com/lists/`
      );
      if (!response.ok) {
        console.error(`Error: ${response.statusText}`);
        return;
      }
      setData(await response.json());
      setServerStatus("Server Up");
    }
    fetchData();
    return;
  });

  const addListItem = async (item) => {
    try {
      const response = await fetch(
        `https://sample-website-server.onrender.com/lists/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: item }),
        }
      );
      if (!response.ok) {
        console.error(`A error has occurred: ${response.statusText}`);
        return;
      }
    } catch (e) {
      console.error("Fetch error: ", e);
    }
  };

  const deleteListItem = async (id) => {
    try {
      const response = await fetch(
        `https://sample-website-server.onrender.com/lists/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        console.error(`A error has occurred: ${response.statusText}`);
        return;
      }
    } catch (e) {
      console.error("Fetch error: ", e);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    const reader = new FileReader();
    let temp = [];
    reader.readAsText(file);

    new Promise((resolve, reject) => {
      reader.onload = async (event) =>
        event.target.result.split(/\r?\n/).map((val) => {
          val = val.replace(/\D/g, "");
          if (val.length < 4) return;
          val = val.slice(0, 4);
          temp.push(val);
          resolve(temp);
        });

      reader.onerror = (error) => reject(error);
    }).then(() => {
      deleteAll();
      temp.map((coded) => {
        console.log(coded);
        addListItem(coded);
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const coded = encode ? code.Encode(input) : code.Decode(input);

    try {
      const response = await fetch(
        `https://sample-website-server.onrender.com/lists/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: coded }),
        }
      );
      if (!response.ok) {
        console.error(`A error has occurred: ${response.statusText}`);
        return;
      }
    } catch (e) {
      console.error("Fetch error: ", e);
    }

    setMsg(coded);
    cookies.set("msg", coded, { path: "/" });

    setInput("");
  };

  const copyText = async () => {
    let temp = "";
    data.map((val) => {
      temp += val.code + " ";
    });
    await navigator.clipboard.writeText(temp);
  };

  const deleteAll = async () => {
    data.map((obj) => {
      deleteListItem(obj._id);
    });
  };

  return (
    <>
      {serverStatus} <br />
      {msg}
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="SUBMIT" />
        </form>
        <form onSubmit={handleFormSubmit}>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <input type="submit" value="Upload" />
        </form>
      </div>
      <button onClick={copyText}>Copy</button>
      <button onClick={() => setEncode(!encode)}>
        {encode ? "Encode" : "Decode"}
      </button>
      <button onClick={deleteAll}>Clear</button>
      <div>
        <ul>
          {data.map((obj) => (
            <ListItem
              key={obj._id}
              value={obj.code}
              del={() => deleteListItem(obj._id)}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

export default Home;
