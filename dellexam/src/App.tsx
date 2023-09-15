import React, { useEffect, useState } from "react";
import "./App.css";
import { UserType, formDataType } from "./App.types";
import { addUser, fetchUsers } from "./redux/UserSlice";
import { RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
function App() {
  const [userList, setUserList] = useState<UserType[] | []>([]);
  const [dataError, setDataError] = useState<Boolean>(false);
  const mockFormValue = {
    name: "",
    email: "",
    company: "",
    city: "",
  };
  const reduxData = useSelector((state: RootState) => state.users.users);
 
  const [formData, setFormData] = useState<formDataType>(mockFormValue);
  const dispatch = useDispatch();
  useEffect(() => {
    if (reduxData.length === 0) {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((data) => {
          //setUserList(data);
          dispatch(fetchUsers(data));
        })
        .catch((error) => setDataError(true));
    }else{
      setUserList(reduxData);
    }
  }, [reduxData]);

  const modifyFormData = (val: formDataType) => {
    return {
      name: val.name,
      email: val.email,
      address: {
        city: val.city,
      },
      company: {
        name: val.company,
      },
    };
  };
  const handleChange = (event: React.SyntheticEvent) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const data = modifyFormData(formData);
    //setUserList((prevUserList) => [...prevUserList, data]);
    dispatch(addUser(data as UserType));
  };

  const sortUsers = (users: UserType[]|[]) => {
    
    let mock=JSON.parse(JSON.stringify(users)) as UserType[]|[] ;
    mock.sort((a, b) => {
      let fa = a.name.toLowerCase();
      let fb = b.name.toLowerCase();
      if (fa < fb) return -1;
      if (fa > fb) return 1;
      return 0;
    });
    return mock;
  };

  return (
    <div className="App">
      <h1>assignment</h1>
      {!dataError && (
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>City</td>
              <td>Company</td>
            </tr>
          </thead>
          <tbody data-testid="userListTest">
            {sortUsers(userList)?.map((val, key) => {
              return (
                <tr key={key}>
                  <td data-testid="testsorting">{val?.name}</td>
                  <td>{val?.email}</td>
                  <td>{val?.address?.city}</td>
                  <td>{val?.company?.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {dataError && <h1>Error Fetching Data....</h1>}
      <br></br>
      <hr></hr>
      <br></br>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="city">city:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="company">company:</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
