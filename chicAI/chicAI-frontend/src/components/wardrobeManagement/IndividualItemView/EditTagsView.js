import AddTagsView from './AddTagsView';
import './EditTags.css';
import { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { useLocation } from 'react-router-dom';

const API_BASE_URL = `https://${process.env.REACT_APP_API_HOST}`;

function EditTagsView() {
  const [tags, setTags] = useState([]);
  const location = useLocation();
  const { _id } = location.state;

  const [showAddItems, setShowAddItems] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/outfits/wardrobe/${_id}/tags`);
        const data = await response.json();
        if (response.ok) {
          setTags(data.tags || []);
        } else {
          console.error("Failed to fetch tags:", data.message);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [_id]);

  // Show AddItemsView
  const handleAddTagClick = () => {
    setShowAddItems(true);
  };

  // Close AddItemsView
  const handleCloseAddItems = () => {
    setShowAddItems(false);
  };

  const onTagsAdded = () => {
    console.log("Tags updated!");
    setShowAddItems(false); // Hide the AddTag view after adding the tag

    // Re-fetch the tags after adding a new one to update the list
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/outfits/wardrobe/${_id}/tags`);
        const data = await response.json();
        if (response.ok) {
          setTags(data.tags || []);
        } else {
          console.error("Failed to fetch updated tags:", data.message);
        }
      } catch (error) {
        console.error("Error fetching updated tags:", error);
      }
    };

    fetchTags();
  };


  return (
    <div className="tags-container">
      {tags.map((tag, index) => (
        <div key={index} className="tag">
          {tag}
        </div>
      ))}

      <div className="add-tag-button" onClick={handleAddTagClick}>
        + Add Tag
      </div>

      {/* Conditionally render AddItemsView */}
      {showAddItems && (
        <div className="add-items-modal">
          <IoClose className="close-icon" onClick={handleCloseAddItems} />
          <AddTagsView itemId={_id} onTagsAdded={onTagsAdded} />
        </div>
      )}

    </div>
  );
}

export default EditTagsView;
