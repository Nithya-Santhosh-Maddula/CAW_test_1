import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import { createStore } from "./redux/store";
import { mockResponse } from "./mocks/mocks";

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("Test App component",()=>{
  test("On page load API should be triggered, data from response should be rendered", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    } as any);
    render(
      <Provider store={createStore()}>
        <App />
      </Provider>
    );
    await waitFor(() => {
      // checking whether api response is getting rendered
      expect(screen.getByText(/Leanne Graham/i)).toBeVisible();
    });
  // comparing the numbers os users rendered vs number of users received in response.
    const users = screen.getByTestId("userListTest");
    expect(users.children.length).toBe(mockResponse.length);
  });
  
  test("On page load API should be triggered,if API fails error msg shoudl be displayed", async () => {
    mockFetch.mockRejectedValue(undefined);
    render(
      <Provider store={createStore()}>
        <App />
      </Provider>
    );
    await waitFor(() => {
      // checking whether error message is getting displayed in case of api failure
      expect(screen.getByText(/Error Fetching Data..../i)).toBeVisible();
    });
  
    // checking if the table of users is empty or not.
    const users = screen.queryByTestId("userListTest");
    expect(users).toBe(null);
  });
  
  test("After filling form details, if we click submit button then list table should be updated with newly added user", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    } as any);
    render(
      <Provider store={createStore()}>
        <App />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Leanne Graham/i)).toBeVisible();
    });
  
    const users = screen.getByTestId("userListTest");
    expect(users.children.length).toBe(mockResponse.length);
  
    // to find all form elements, update them and check whether those values are updated.
    const name = screen.getByRole("textbox", { name: "Name:" }); 
    fireEvent.change(name, { target: { value: "testname" } });
    expect(name).toHaveValue("testname");

    const email = screen.getByLabelText("email:");
    fireEvent.change(email, { target: { value: "testemail" } });
    expect(email).toHaveValue("testemail");

    const city = screen.getByLabelText("city:");
    fireEvent.change(city, { target: { value: "testcity" } });
    expect(city).toHaveValue("testcity");

    const company = screen.getByLabelText("company:");
    fireEvent.change(company, { target: { value: "testcompany" } });
    expect(company).toHaveValue("testcompany");
  
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);
    await waitFor(() => {
      // to check whether newly added user is displayed in users list.
      expect(screen.getByText(/testname/i)).toBeVisible();
    });
  });
  
  test("to check whether the users list which is rendered and sorted according to name of users", async () => {
    let slicedResponse = mockResponse.slice(0, 5);
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(slicedResponse),
    } as any);
    render(
      <Provider store={createStore()}>
        <App />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Leanne Graham/i)).toBeVisible();
    });
    const items = screen.getAllByTestId("testsorting");
    const arr = items.map((item) => item.textContent);
  
    // to check whether list of users is sorted according expected sorting( here it should sort according to alphabetical order of names)
    expect(arr).toEqual([
      "Chelsey Dietrich",
      "Clementine Bauch",
      "Ervin Howell",
      "Leanne Graham",
      "Patricia Lebsack",
    ]);
    const users = screen.getByTestId("userListTest");
    expect(users.children.length).toBe(slicedResponse.length);
  });
  
  test("While sorting if two rows have same name or users with same name should be still displayed", async () => {
    let updatedResponse = [...mockResponse, mockResponse[0]];
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(updatedResponse),
    } as any);
    render(
      <Provider store={createStore()}>
        <App />
      </Provider>
    );
    await waitFor(() => {
      // mock response has user with this name twice, so we should be able t find user with this name twice on UI.
      expect(screen.getAllByText(/Leanne Graham/i).length).toBe(2);
    });
  
    const users = screen.getByTestId("userListTest");
    expect(users.children.length).toBe(updatedResponse.length);
  });

})
