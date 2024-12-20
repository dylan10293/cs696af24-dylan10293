import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import "./SuggestionGenerator.css";

const API_BASE_URL = `https://${process.env.REACT_APP_API_HOST}`;

const SuggestionGenerator = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchLatestSuggestion = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/suggestions/latest/${userId}`);
      setSuggestions(response.data.suggestion.suggestions);
      setSuccess("Loaded previous suggestion as a new suggestion can only be generated once per 24 hours");
      return true;
    } catch (err) {
      if (err.response?.status === 404) {
        return false; // No recent suggestion found
      }
      setError("Failed to fetch latest suggestion.");
      return true;
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setSuggestions([]);

    // Check for existing suggestion
    const hasRecentSuggestion = await fetchLatestSuggestion();
    if (hasRecentSuggestion) {
      setLoading(false);
      return;
    }

    // Generate a new suggestion if none exists
    try {
      const response = await axios.post(`${API_BASE_URL}/api/suggestions/generate`, {
        userId,
      });
      setSuggestions(response.data.suggestions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (outfit) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_BASE_URL}/api/outfits/create`, {
        name: outfit.name,
        items: outfit.items.map((item) => item.wardrobeItemId), // Send wardrobeItemIds only
        userId,
      });
      setSuccess(`Outfit "${outfit.name}" saved successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save outfit.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {suggestions.length > 0 && (
        <div>
          <h3>Suggestions</h3>
          <Row className="g-3">
            {suggestions.map((suggestion, index) => (
              <Col xs={12} sm={6} md={4} className="d-flex" key={index}>
                <Card className="flex-fill">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title>{suggestion.name}</Card.Title>
                      <Card.Text>
                        <strong>Items:</strong>
                        <div className="image-container">
                          {suggestion?.items.map(({ wardrobeItemId }) => (
                            <Card.Img
                              key={wardrobeItemId}
                              variant="top"
                              src={`https://${process.env.REACT_APP_AWS_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${wardrobeItemId}.jpg`}
                            />
                          ))}
                        </div>
                        <ul>
                          {suggestion.items.map((item, idx) => (
                            <li key={idx}>
                              {item.name} ({item.type}) - Tags: {item.tags.join(", ")}
                            </li>
                          ))}
                        </ul>
                      </Card.Text>
                    </div>
                    <Button
                      variant="success"
                      disabled={loading}
                      onClick={() => handleSave(suggestion)}
                    >
                      Save to Outfits
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default SuggestionGenerator;
