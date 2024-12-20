import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card, Modal } from "react-bootstrap"; // Added Modal here
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import SuggestionGenerator from "./SuggestionGenerator";
import './OutfitCreator.css';
import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = `https://${process.env.REACT_APP_API_HOST}`;

const OutfitCreator = ({ userId }) => {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [outfitName, setOutfitName] = useState("");
  const [outfits, setOutfits] = useState([]);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { signOut } = useAuth();

  // Fetch wardrobe items
  useEffect(() => {
    const fetchWardrobeItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/outfits/wardrobe`, {
          params: { userId }
        });
        setWardrobeItems(response.data);
      } catch (error) {
        console.error("Error fetching wardrobe items:", error);
      }
    };

    fetchWardrobeItems();
  }, []);

  const fetchOutfits = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/outfits`, {
        params: { userId }
      });
      setOutfits(response.data);
    } catch (error) {
      console.error("Error fetching outfits:", error);
    }
  };

  // Fetch outfits on load
  useEffect(() => {
    fetchOutfits();
  }, []);


  useEffect(() => {
    const tempUserName = "John"; // Replace with API call later
    setUserName(tempUserName);
  }, [userId]);

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const createOutfit = async () => {
    if (!outfitName || selectedItems.length === 0) {
      alert("Please provide an outfit name and select at least one item.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/outfits/create`, {
        name: outfitName,
        items: selectedItems,
        userId,
      });

      alert("Outfit created successfully!");
      setOutfitName("");
      setSelectedItems([]);
      fetchOutfits();
    } catch (error) {
      console.error("Error creating outfit:", error);
      alert("Failed to create outfit.");
    }
  };

  const deleteOutfit = async (outfitId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/outfits/${outfitId}`);
      alert("Outfit deleted successfully!");
      fetchOutfits(); // Refresh the outfits list
    } catch (error) {
      console.error("Error deleting outfit:", error);
      alert("Failed to delete outfit.");
    }
  };

  const logOut = async () => {
    await signOut();
  }


  return (
    <Container fluid className="outfit-creator-container">
      {/* SuggestionGenerator Integration */}

      <Modal show={showModal} onHide={async () => { await fetchOutfits(); setShowModal(false) }} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Generate Suggestions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SuggestionGenerator userId={userId} />
        </Modal.Body>
      </Modal>

      <Row>

        {/* Wardrobe Items Section */}
        <Col md={5} className="wardrobe-section">
          <div className="d-flex justify-content-between align-items-center pt-2 pb-2">
            <h2 className="section-title">Create Outfit</h2>
            <Button variant="primary" onClick={() => setShowModal(true)} className="generate-suggestions-button">
              Generate Suggestions
            </Button>
          </div>
          <div className="card p-3">


            <Form>
              <Form.Group>
                <Form.Label>Outfit Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter outfit name"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  className="outfit-name-input"
                />
              </Form.Group>
            </Form>

            <Form.Label>Select Items:</Form.Label>

            <div className="wardrobe-items-scrollable">
              <Row>
                {wardrobeItems.map((item) => (
                  <Col key={item._id} md={6} className="p-1">
                    <Card
                      className={`wardrobe-card ${selectedItems.includes(item._id) ? "selected-card" : ""
                        }`}
                      onClick={() => toggleItemSelection(item._id)}
                    >
                      <Card.Body>
                        <div className="image-container">
                          <Card.Img variant="top" src={`https://${process.env.REACT_APP_AWS_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${item._id}.jpg`} />
                        </div>
                        <Card.Title className="card-title">{item.name}</Card.Title>
                        <Card.Text className="card-text">Type: {item.type}</Card.Text>
                        <Card.Text className="card-text">Tags: {item.tags.join(", ")}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            <Button className="create-outfit-button" onClick={createOutfit}>
              Create Outfit
            </Button>
          </div>

        </Col>

        {/* Outfits Section */}
        <Col md={7} className="outfits-section">
          <h2 className="section-title pt-2 pb-2">Created Outfits</h2>
          <div className="card p-3">

            <div className="outfits-items-scrollable">
              <Row>
                {outfits.map((outfit) => (
                  <Col key={outfit._id} md={6} className="p-1">
                    <Card className="outfit-card">
                      <FaTrash
                        className="delete-icon"
                        onClick={() => deleteOutfit(outfit._id)}
                      />
                      <Card.Body>
                        <div className="image-container">
                          {outfit?.items.map(({ wardrobeItemId }) => (
                            <Card.Img
                              key={wardrobeItemId}
                              variant="top"
                              src={`https://${process.env.REACT_APP_AWS_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${wardrobeItemId}.jpg`}
                            />
                          ))}
                        </div>
                        <Card.Title className="card-title">{outfit.name}</Card.Title>
                        <Card.Text className="card-text">
                          <strong>Items:</strong>{" "}
                          {outfit.items.map((item, index) => (
                            <span key={index}>
                              {item.name} ({item.type})
                              {index < outfit.items.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </Card.Text>
                        <Card.Text className="card-text">
                          <strong>Tags:</strong>{" "}
                          {outfit.items.flatMap((item) => item.tags).join(", ")}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>

        </Col>
      </Row>
    </Container>
  );

};

export default OutfitCreator;
