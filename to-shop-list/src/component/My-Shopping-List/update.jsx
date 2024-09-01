import React, { Component } from "react";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";
import { db } from "./firebase"; // Import Firestore instance
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

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // add item to the list
  onSubmit = async () => {
    if (this.state.item) {
      const item = {
        item: `😭 ${this.state.item}`,
        status: false
      };

      // Add the item to Firestore
      await db.collection("shoppinglist").add(item);

      // Clear the form
      this.setState({ item: "" });

      // Refresh the items
      this.getShopList();
    }
  };

  // get all the items from Firestore
  getShopList = () => {
    db.collection("shoppinglist")
      .orderBy("status")
      .onSnapshot((snapshot) => {
        const shoppinglist = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        this.setState({
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
              <Card key={item.id} color={color} fluid style={cardBackground}>
                <Card.Content>
                  <Card.Header textAlign="left" style={shopComplete}>
                    <div style={{ wordWrap: "break-word" }}>{item.item}</div>
                  </Card.Header>

                  <Card.Meta textAlign="right">
                    <Icon
                      link
                      name="check circle"
                      color="green"
                      onClick={() => this.updateItem(item.id)}
                    />
                    <span style={{ paddingRight: 10 }}>Done</span>
                    <Icon
                      link
                      name="undo"
                      color="yellow"
                      onClick={() => this.undoItem(item.id)}
                    />
                    <span style={{ paddingRight: 10 }}>Undo</span>
                    <Icon
                      link
                      name="delete"
                      color="red"
                      onClick={() => this.deleteItem(item.id)}
                    />
                    <span style={{ paddingRight: 10 }}>Delete</span>
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          })
        });
      });
  };

  // update the item status to true
  updateItem = (id) => {
    db.collection("shoppinglist").doc(id).update({ status: true });
  };

  // undo the item status from true to false
  undoItem = (id) => {
    db.collection("shoppinglist").doc(id).update({ status: false });
  };

  // delete the item from the shopping list
  deleteItem = (id) => {
    db.collection("shoppinglist").doc(id).delete();
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
