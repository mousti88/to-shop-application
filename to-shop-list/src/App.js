import React from "react";
import "./App.css";
import MyShoppingList from "./component/My-Shopping-List";
//import Update2 from "./component/My-Shopping-List";
import ReactPullToRefresh from "react-pull-to-refresh";
import PullToRefresh from "react-simple-pull-to-refresh";

function App() {
  const handleRefresh = async () => {
    // re-fetch or reload
    window.location.reload();
  };

  return (
    <div>
      {/* <ReactPullToRefresh onRefresh={handleRefresh}>
        <div style={{ height: "100vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            <MyShoppingList />
        </div>
      </ReactPullToRefresh> */}
      <PullToRefresh onRefresh={handleRefresh}  pullingContent={<span>↓ Pull down to refresh</span>} refreshingContent={<span>⟳ Refreshing...</span>}>
        <MyShoppingList />
      </PullToRefresh>
    </div>
  );
}

export default App;