import React, { Component } from "react";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";
import { db } from "./firebase"; // Import the configured Firestore instance
console.log(db); 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import "./my-shopping-list.css";

class MyShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: "",
      shoppinglist: [],
      loading: true,
      error: null
    };
  }

  componentDidMount = () => {
    this.getShopList();
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = async () => {
    if (this.state.item) {
      try {
        const docRef = await addDoc(collection(db, "shoppinglist"), {
          item: `😭 ${this.state.item}`,
          status: false
        });
        console.log("Document written with ID: ", docRef.id);
        this.setState({ item: "" });
        this.getShopList();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  getShopList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shoppinglist"));
      const shoppinglist = [];
      querySnapshot.forEach((doc) => {
        shoppinglist.push({ ...doc.data(), id: doc.id });
      });
      this.setState({ shoppinglist, loading: false });
    } catch (error) {
      console.error("Error getting documents: ", error);
      this.setState({ loading: false, error: "Failed to load shopping list" });
    }
  };

  updateItem = async (id) => {
    const docRef = doc(db, "shoppinglist", id);
    try {
      await updateDoc(docRef, { status: true });
      this.getShopList();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  undoItem = async (id) => {
    const docRef = doc(db, "shoppinglist", id);
    try {
      await updateDoc(docRef, { status: false });
      this.getShopList();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  deleteItem = async (id) => {
    const docRef = doc(db, "shoppinglist", id);
    try {
      await deleteDoc(docRef);
      this.getShopList();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  render() {
    const { shoppinglist, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div>
        <Header as="h1">
          <div className="app-header">📝 Ghaddar Household Shopping List</div>
        </Header>
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
        <Card.Group>
          {shoppinglist.map((item) => (
            <Card key={item.id} fluid>
              <Card.Content>
                <Card.Header>{item.item}</Card.Header>
                <Card.Meta textAlign="right">
                  <Icon
                    link
                    name="check circle"
                    color="green"
                    onClick={() => this.updateItem(item.id)}
                  />
                  <Icon
                    link
                    name="undo"
                    color="yellow"
                    onClick={() => this.undoItem(item.id)}
                  />
                  <Icon
                    link
                    name="delete"
                    color="red"
                    onClick={() => this.deleteItem(item.id)}
                  />
                </Card.Meta>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
    );
  }
}

export default MyShoppingList;
