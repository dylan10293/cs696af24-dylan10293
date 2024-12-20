import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import OutfitCard from "./OutfitCard";

const API_BASE_URL = `https://${process.env.REACT_APP_API_HOST}`;

const OutfitManagement = ({ userId }) => {
  const [suggestedOutfits, setSuggestedOutfits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedOutfits, setSavedOutfits] = useState([]);

  // Fetch suggestions for the user
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/suggestions/${userId}`);
        setSuggestedOutfits(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [userId]);

  // Fetch saved outfits for the user
  useEffect(() => {
    const fetchSavedOutfits = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/suggestions/saved`);
        setSavedOutfits(response.data);
      } catch (error) {
        console.error("Error fetching saved outfits:", error);
      }
    };

    fetchSavedOutfits();
  }, []);

  const generateSuggestions = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/suggestions/generate`, {
        userId,
      });

      alert(response.data.message); // Display success message

      // Refresh the suggestions after generation
      const updatedSuggestions = await axios.get(`${API_BASE_URL}/api/suggestions/${userId}`);
      setSuggestedOutfits(updatedSuggestions.data);
    } catch (error) {
      console.error("Error generating suggestions:", error.response?.data || error.message);
      alert(`Failed to generate suggestions: ${error.response?.data?.message || "Unknown error"}`);
    }
  };






  const saveOutfit = async () => {
    try {
      const outfitToSave = suggestedOutfits[currentIndex];
      if (!savedOutfits.some((outfit) => outfit._id === outfitToSave._id)) {
        const response = await axios.post(`${API_BASE_URL}/api/suggestions/save`, outfitToSave);
        setSavedOutfits([...savedOutfits, { ...outfitToSave, _id: response.data.id }]);
      } else {
        alert("This outfit is already saved!");
      }
    } catch (error) {
      console.error("Error saving outfit:", error);
    }
  };

  const nextOutfit = () => {
    if (currentIndex < suggestedOutfits.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousOutfit = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const deleteSuggestions = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/suggestions/${userId}`);
      alert(`${response.data.deletedCount} suggestions deleted successfully!`);
      setSuggestedOutfits([]); // Clear suggestions from the UI
    } catch (error) {
      console.error("Error deleting suggestions:", error);
      alert("Failed to delete suggestions.");
    }
  };




  return (
    <Container fluid>
      <Row>
        {/* Swipe Section */}
        <Col md={4}>
          <h2>Swipe Section</h2>


          <Button onClick={deleteSuggestions} className="mb-3" variant="danger">
            Delete All Suggestions
          </Button>
          <Button onClick={generateSuggestions} className="mb-3">
            Generate Suggestions
          </Button>
          {suggestedOutfits.length > 0 ? (
            <>
              <OutfitCard outfit={suggestedOutfits[currentIndex]} />
              <div className="d-flex justify-content-between mt-3">
                <Button onClick={previousOutfit} disabled={currentIndex === 0}>
                  Previous
                </Button>
                <Button onClick={saveOutfit}>Save</Button>
                <Button
                  onClick={nextOutfit}
                  disabled={currentIndex === suggestedOutfits.length - 1}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <p>No suggestions available</p>
          )}
        </Col>

        {/* Saved Outfits Section */}
        <Col md={8}>
          <h2>Saved Outfits</h2>
          {savedOutfits.length > 0 ? (
            savedOutfits.map((outfit, index) => (
              <OutfitCard key={index} outfit={outfit} />
            ))
          ) : (
            <p>No outfits saved yet</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OutfitManagement;
