import React, { Component } from "react";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";
import "./my-shopping-list.css";

class MyShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: "",
      shoppinglist: []
    };
  }

  // on load get the shopping list
  componentDidMount = () => {
    this.getShopList();
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // add item to the list
  onSubmit = () => {
    // check is item is empty string
    if (this.state.item) {
      // get the shopping list from the local storage
      let shoppinglist = JSON.parse(localStorage.getItem("shoppinglist"));

      // shopping list is null means empty
      // create an empty list
      if (shoppinglist == null) {
        shoppinglist = [];
      }

      // create item object
      // default status is false
      let item = {
        item: `😭 ${this.state.item}`,
        status: false
      };

      // add the item to the shopping list
      shoppinglist.push(item);

      // save the shopping list in the local storage
      localStorage.setItem("shoppinglist", JSON.stringify(shoppinglist));

      // clear the form
      this.setState({ item: "" });

      // refresh the items
      this.getShopList();
    }
  };

  // get all the items
  getShopList = () => {
    // get the shopping list from the local storage
    let shoppinglist = JSON.parse(localStorage.getItem("shoppinglist"));

    // check if shopping list is empty
    if (shoppinglist) {
      // sort all the items on the basis of status
      // completed shopping will move down
      shoppinglist = shoppinglist.sort((a, b) => {
        if (a.status) {
          return 1;
        } else if (b.status) {
          return -1;
        }
        return 0;
      });

      // save the shopping list in the local storage
      localStorage.setItem("shoppinglist", JSON.stringify(shoppinglist));

      // set the shoppinglist to the state
      this.setState({
        // default color
        // Incomplete: yellow
        // complete: green
        shoppinglist: shoppinglist.map((item, index) => {
          let color = "yellow";
          let cardBackground = { background: "white" };
          let shopComplete = { textDecoration: "none" };

          if (item.status) {
            color = "green";
            cardBackground.background = "beige";
            shopComplete["textDecoration"] = "line-through";
          }
          return (
            <Card key={index} color={color} fluid style={cardBackground}>
              <Card.Content>
                <Card.Header textAlign="left" style={shopComplete}>
                  <div style={{ wordWrap: "break-word" }}>{item.item}</div>
                </Card.Header>

                <Card.Meta textAlign="right">
                  <Icon
                    link
                    name="check circle"
                    color="green"
                    onClick={() => this.updateItem(index)}
                  />
                  <span style={{ paddingRight: 10 }}>Done</span>
                  <Icon
                    link
                    name="undo"
                    color="yellow"
                    onClick={() => this.undoItem(index)}
                  />
                  <span style={{ paddingRight: 10 }}>Undo</span>
                  <Icon
                    link
                    name="delete"
                    color="red"
                    onClick={() => this.deleteItem(index)}
                  />
                  <span style={{ paddingRight: 10 }}>Delete</span>
                </Card.Meta>
              </Card.Content>
            </Card>
          );
        })
      });
    }
  };

  // update the item status to true
  updateItem = index => {
    // get the shopping list from the local storage
    let shoppinglist = JSON.parse(localStorage.getItem("shoppinglist"));
    // change status to true
    shoppinglist[index].status = true;
    // save the updated shopping list
    localStorage.setItem("shoppinglist", JSON.stringify(shoppinglist));
    // refresh the shopping list
    this.getShopList();
  };

  // undone the item status from true to false
  undoItem = index => {
    // get the shopping list from the local storage
    let shoppinglist = JSON.parse(localStorage.getItem("shoppinglist"));
    // change status to false
    shoppinglist[index].status = false;
    // save the updated shopping list
    localStorage.setItem("shoppinglist", JSON.stringify(shoppinglist));
    // refresh the shopping list
    this.getShopList();
  };

  // delete the item from the shopping list
  deleteItem = index => {
    // get the shopping list from the local storage
    let shoppinglist = JSON.parse(localStorage.getItem("shoppinglist"));
    // remove the item from the shopping list
    shoppinglist.splice(index, 1);
    // save the updated shopping list
    localStorage.setItem("shoppinglist", JSON.stringify(shoppinglist));
    // refresh the shopping list
    this.getShopList();
  };

  render() {
    return (
      <div>
        <div>
          <Header as="h1">
            <div className="app-header">📝 Ghaddar Household Shopping List</div>{" "}
          </Header>
        </div>
        <div className="app-form">
          <Form onSubmit={this.onSubmit}>
            <Input
              type="text"
              name="item"
              onChange={this.onChange}
              value={this.state.item}
              fluid
              placeholder="item..."
            />
          </Form>
        </div>
        <div>
          <Card.Group>{this.state.shoppinglist}</Card.Group>
        </div>
      </div>
    );
  }
}

export default MyShoppingList;      