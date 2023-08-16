import { useStateContext } from "./utils/stateContext";
import { AuthenticationForm, ContentManager } from "./components";
import { Toaster } from "react-hot-toast";

function App() {
  const { userData } = useStateContext();

  return (
    <div className="App">
      {/* show login form if userdata unavailable */}
      {!userData ? <AuthenticationForm /> : <ContentManager />}
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: Infinity,
          style: {
            color: getComputedStyle(document.documentElement).getPropertyValue(
              "--color-highlight"
            ),
            borderRadius: "0.2rem",
            padding: "0.2rem 0",
            backgroundColor: "#ffffff66",
          },
          success: {
            duration: 2000,
            position: "top-right",
            style: {
              paddingLeft: "0.4rem",
              color: "green",
            },
          },
          error: {
            duration: 4000,
            position: "top-right",
            style: {
              paddingLeft: "0.4rem",
              color: "red",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
