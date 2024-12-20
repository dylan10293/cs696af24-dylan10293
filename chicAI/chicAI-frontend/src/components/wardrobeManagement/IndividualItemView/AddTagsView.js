import './AddTags.css';
import { useLocation } from 'react-router-dom';


import { useEffect, useState } from 'react';

const API_BASE_URL = `https://${process.env.REACT_APP_API_HOST}`;

function AddTagsView({ itemId, onTagsAdded }) {
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);

  const location = useLocation();
  const { _id } = location.state;

  // Fetch tags when the component is mounted
  useEffect(() => {
    // Ensure itemId is defined before making the request
    if (!itemId) {
      console.error('itemId is undefined');
      return; // Return early if itemId is undefined
    }
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/outfits/wardrobe/${_id}/tags`);
        if (response.ok) {
          const data = await response.json();
          setTags(data.tags); // Update the state with fetched tags
        } else {
          console.error('Failed to fetch tags');
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [itemId]); // Fetch tags when itemId changes

  const handleAddTag = async () => {
    if (tag) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/outfits/wardrobe/${_id}/tags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newTags: [tag] }),
        });

        const data = await response.json();
        if (response.ok) {
          setTag('');
          onTagsAdded(); // Notify parent to refresh the tags
        } else {
          alert(data.message || 'Failed to add tag');
        }
      } catch (error) {
        console.error('Error adding tag:', error);
        alert('An error occurred while adding the tag.');
      }
    } else {
      alert('Tag cannot be empty!');
    }
  };

  return (
    <div className="add-tag-container">
      <input
        type="text"
        className="add-tag-input"
        placeholder="Enter Tag Name"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <button className="add-tag-button" onClick={handleAddTag}>
        Add
      </button>
    </div>
  );
}

export default AddTagsView;
