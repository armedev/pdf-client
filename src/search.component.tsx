import { useState } from "react";
import axios from "axios";

type Data = {
  title: string;
  page_no: string;
};

type ParsedData = {
  [key: string]: {
    page_no: Set<string>;
  };
};

const parseData = async (data: Data[]) => {
  const res: ParsedData = {};
  const p = data.map((d) =>
    res[d.title]
      ? res[d.title].page_no.add(d.page_no)
      : (res[d.title] = { page_no: new Set<string>([d.page_no]) })
  );

  await Promise.all(p);

  return res;
};

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<ParsedData>({});
  const [error, setError] = useState("");

  const [state, setState] = useState(false);

  const handleSearch = async () => {
    setState(false);
    setData({});
    setError("");
    try {
      const res = await axios.get("http://127.0.0.1:5000/search", {
        params: {
          key: inputValue,
        },
      });
      if (res.data.error) {
        setError(res.data.error);
        throw new Error(res.data.error);
      }
      setData(await parseData(res.data.data));
    } catch (err) {
      console.error(err);
    }
    setState(true);
  };
  return (
    <div className="search-card">
      <div className="header">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="search text"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="data">
        {state && error === "" ? (
          Object.keys(data).length > 0 ? (
            Object.keys(data).map((d) => (
              <div className="data-card" key={d}>
                <span className="title">{d}</span>
                <div className="items">
                  <span>Page No:</span>
                  <div>
                    {Array.from(data[d].page_no)
                      .sort((a, b) => (Number(a) < Number(b) ? -1 : 1))
                      .map((k, id) => (
                        <span className="item" key={id}>
                          {k}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>keyword not found</p>
          )
        ) : (
          <p> {error}</p>
        )}
      </div>
    </div>
  );
};

export default Search;
