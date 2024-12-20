import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../wardrobeManagement/MainContent/MainContent.css";
import { Container, Stack, Card, Button, Row, Col } from "react-bootstrap";

const API_BASE_URL = `https://${process.env.REACT_APP_API_HOST}`;

function Laundry({ userId }) {
  const [wardrobeItems, setWardrobeItems] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    fetchLaundryItems();
  }, []);

  const fetchLaundryItems = () => {
    fetch(`${API_BASE_URL}/api/laundry`) // Replace with your actual API URL
      .then((response) => response.json())
      .then((data) => {
        setWardrobeItems(data); // Store the fetched wardrobe items in state
      })
      .catch((error) =>
        console.error("Error fetching wardrobe items from laundry:", error)
      );
  };

  // Group wardrobe items by type
  const groupedItems = wardrobeItems.reduce((acc, item) => {
    const type = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {});

  const toggleLaundryStatus = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/laundry/${id}/toggle-laundry`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Laundry status updated to:", data.laundryStatus);
        fetchLaundryItems(); // Refresh the list to reflect the updated status
      } else {
        console.error("Failed to update laundry status.");
      }
    } catch (error) {
      console.error("Error updating laundry status:", error);
    }
  };

  return (
    <Container className="wardrobe-management-content" fluid>
      <Stack gap={3} className="wardrobe-management-content-stack">
        {Object.keys(groupedItems).map((type) => (
          <div key={type} className="p-2">
            {type} {/* Display item type as header */}

            {/* Horizontal Grid for each type */}

            <Row className="wardrobe-items-row" xs={1} sm={2} md={3} lg={4} xl={5} gap={3}>
              {/* Render the items of the current type */}
              {groupedItems[type].map((item) => (
                <Col key={item._id} className="wardrobe-item-col">
                  <Card className="wardrobe-management-card" style={{ width: '15rem' }}>

                    {/* X Button */}
                    <Button
                      variant="danger"
                      className="close-button"
                      onClick={() => toggleLaundryStatus(item._id)}
                    >
                      X
                    </Button>

                    <Card.Img variant="top" src={`https://${process.env.REACT_APP_AWS_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${item._id}.jpg`} />
                    <Card.Body>
                      <Card.Text>{item.name}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Stack>
    </Container>
  );
}

export default Laundry;
