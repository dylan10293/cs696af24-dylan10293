import './ItemEdit.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import EditTagsView from './EditTagsView';
import { FaRegEdit } from "react-icons/fa";
import { useState } from 'react';
import { IoClose } from "react-icons/io5";

const API_BASE_URL = `https://${process.env.REACT_APP_API_HOST}`;

function ItemEditView() {
  const location = useLocation();
  const navigate = useNavigate();

  const { item, img, laundryStatus, style, color, pattern, tags, _id } = location.state; // Destructure the item and its ID

  const [showEditTags, setShowEditTags] = useState(false); // State to control EditTagsView visibility
  const [currentTags, setCurrentTags] = useState(tags || []);

  // States to manage whether each field is in edit mode
  const [isEditingStyle, setIsEditingStyle] = useState(false);
  const [isEditingColor, setIsEditingColor] = useState(false);
  const [isEditingPattern, setIsEditingPattern] = useState(false);

  // State to manage the editable fields
  const [newStyle, setNewStyle] = useState(style || '');
  const [newColor, setNewColor] = useState(color || '');
  const [newPattern, setNewPattern] = useState(pattern || '');

  const handleEditTagsClick = () => {
    setShowEditTags(true); // Show the EditTagsView when clicked
  };

  const handleCloseEditTags = () => {
    setShowEditTags(false); // Hide the EditTagsView
  };

  // Function to refresh the tags after adding a new one
  const handleTagsAdded = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/outfits/wardrobe/${_id}/tags`);
      const data = await response.json();
      if (response.ok) {
        setCurrentTags(data.tags || []); // Update local tags state
      } else {
        console.error("Failed to fetch updated tags:", data.message);
      }
    } catch (error) {
      console.error("Error fetching updated tags:", error);
    }
  };

  // Handle form submission to update style, color, and pattern
  const handleUpdateItem = async () => {
    const updatedData = {};

    // Only add the field if it's updated
    if (newStyle !== style) updatedData.style = newStyle;
    if (newColor !== color) updatedData.color = newColor;
    if (newPattern !== pattern) updatedData.pattern = newPattern;

    // If no fields are updated, alert and return early
    if (Object.keys(updatedData).length === 0) {
      alert('No changes were made.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/outfits/wardrobe/${_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedItem = {
          ...location.state,
          ...updatedData,
        };
        alert('Item updated successfully!');
        navigate('.', { replace: true, state: updatedItem });
        // window.location.reload(); // Reload the page to reflect the changes
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update the item.');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('An error occurred while updating the item.');
    }
  };

  // Function to handle closing the edit view
  const handleCloseEditView = () => {
    setIsEditingStyle(false);
    setIsEditingColor(false);
    setIsEditingPattern(false);
    setNewStyle(style);
    setNewColor(color);
    setNewPattern(pattern);
  };

  const handleToggleLaundryStatus = async () => {
    const updatedData = { laundryStatus: !laundryStatus };
    try {
      const response = await fetch(`${API_BASE_URL}/api/laundry/${_id}/toggle-laundry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        const updatedItem = {
          ...location.state,
          laundryStatus: !laundryStatus,
        };
        alert(`Laundry status updated to: ${data.laundryStatus ? 'In Laundry' : 'Available'}`);
        navigate('.', { replace: true, state: updatedItem });
        // window.location.reload(); // Reload to reflect the updated status
      } else {
        alert(data.message || 'Failed to update laundry status.');
      }
    } catch (error) {
      console.error('Error toggling laundry status:', error);
      alert('An error occurred while updating laundry status.');
    }
  };

  // Function to handle deleting the item
  const handleDeleteItem = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/outfits/wardrobe/${_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Item deleted successfully!');
          // Navigate back to the previous page or wardrobe list
          // window.location.href = '/wardrobe-management';
          navigate('/wardrobe-management', { replace: true });
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete the item.');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('An error occurred while deleting the item.');
      }
    }
  };

  return (
    <Container fluid>
      <div className="item-edit-container flex-row">
        <Col md={4}>
          <img src={img} alt={item} style={{ width: '300px' }} />
          <h3>{item}</h3>
        </Col>

        <Col md={8} className="edit-fields">
          {/* Tags */}
          <div className="edit-field">
            <div className="label-icon-row">
              <label>Tags</label>
              <FaRegEdit className="edit-icon" onClick={handleEditTagsClick} />
            </div>

            <Col className='tags-align'>
              {/* Render dynamic tags */}
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <div key={index} className="tags">
                    {tag}
                  </div>
                ))
              ) : (
                <div className="tags">No tags available</div>
              )}
            </Col>
          </div>

          {/* Conditionally render EditTagsView */}
          {showEditTags && (
            <div className="edit-tags-modal">
              <IoClose className="close-icon" onClick={handleCloseEditTags} />
              <EditTagsView itemId={_id} onTagsAdded={handleTagsAdded} />
            </div>
          )}

          <div className="edit-field">
            <div className="label-icon-row">
              <label>Style</label>
              <FaRegEdit className="edit-icon" onClick={() => setIsEditingStyle(true)} />
            </div>
            <Col className='tags-align'>
              {/* Render dynamic style */}
              <div className='tags'>{style || 'No style available'}</div>
              {isEditingStyle && (
                <div>
                  {/* Close icon to exit edit mode */}
                  <IoClose className="close-icon" onClick={() => {
                    setIsEditingStyle(false); // Close the edit mode for Style
                    setNewStyle(style); // Reset the input field to the original value
                  }} />

                  <Form.Control
                    type="text"
                    value={newStyle}
                    onChange={(e) => setNewStyle(e.target.value)}
                    placeholder="Enter style"
                  />

                  <div className='update-item'>
                    <Button className="update-button" onClick={handleUpdateItem}>Update Item</Button>
                  </div>
                </div>

              )}
            </Col>
          </div>

          <div className="edit-field">
            <div className="label-icon-row">
              <label>Color</label>
              <FaRegEdit className="edit-icon" onClick={() => setIsEditingColor(true)} />
            </div>
            <Col className='tags-align'>
              {/* Render dynamic style */}
              <div className='tags'>{color || 'No color available'}</div>
              {isEditingColor && (
                <div>
                  {/* Close icon to exit edit mode */}
                  <IoClose className="close-icon" onClick={() => {
                    setIsEditingColor(false); // Close the edit mode for Color
                    setNewColor(color); // Reset the input field to the original value
                  }} />

                  <Form.Control
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Enter color"
                  />

                  <div className='update-item'>
                    <Button className="update-button" onClick={handleUpdateItem}>Update Item</Button>
                  </div>
                </div>
              )}
            </Col>
          </div>

          <div className="edit-field">
            <div className="label-icon-row">
              <label>Pattern</label>
              <FaRegEdit className="edit-icon" onClick={() => setIsEditingPattern(true)} />
            </div>
            <Col className='tags-align'>
              {/* Render dynamic style */}
              <div className='tags'>{pattern || 'No pattern available'}</div>
              {isEditingPattern && (
                <div>
                  {/* Close icon to exit edit mode */}
                  <IoClose className="close-icon" onClick={() => {
                    setIsEditingPattern(false); // Close the edit mode for Pattern
                    setNewPattern(pattern); // Reset the input field to the original value
                  }} />

                  <Form.Control
                    type="text"
                    value={newPattern}
                    onChange={(e) => setNewPattern(e.target.value)}
                    placeholder="Enter pattern"
                  />

                  <div className='update-item'>
                    <Button className="update-button" onClick={handleUpdateItem}>Update Item</Button>
                  </div>
                </div>

              )}
            </Col>
          </div>

          {/* Laundry Status */}
          <div className="edit-field">
            <div className="label-icon-row">
              <label>Laundry Status</label>
            </div>

            <Col className='tags-align'>
              {/* Render laundry status with conditional styling */}
              <div
                className={`tags laundry-status ${laundryStatus ? 'grey-out' : 'highlight'
                  }`}
              >
                {laundryStatus ? 'In Laundry' : 'Available'}
              </div>
              <Button
                className="toggle-laundry-button"
                onClick={handleToggleLaundryStatus}
                variant={laundryStatus ? 'secondary' : 'success'}
              >
                {laundryStatus ? 'Mark as Available' : 'Mark as In Laundry'}
              </Button>
            </Col>
          </div>

          <div className='delete-item'>
            <Button className='delete-button' onClick={handleDeleteItem}> Delete Item </Button>
          </div>

        </Col>
      </div>



    </Container>
  );
}

export default ItemEditView;
