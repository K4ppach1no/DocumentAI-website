import React, { Component } from 'react';
import OpenWebUI from './OpenWebUI';

class ManageCollections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      newCollectionName: '',
      newCollectionDescription: '',
    };

    this.apiClient = new OpenWebUI("your-api-key-here");
  }

  async componentDidMount() {
    try {
      const collections = await this.apiClient.getCollections();
      this.setState({ collections: Array.isArray(collections) ? collections : [] });
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }

  handleCreateCollection = async () => {
    const { newCollectionName, newCollectionDescription } = this.state;
    if (newCollectionName.trim()) {
      try {
        const response = await this.apiClient.createCollection(newCollectionName, newCollectionDescription);
        this.setState((prevState) => ({
          collections: [...prevState.collections, response],
          newCollectionName: '',
          newCollectionDescription: '',
        }));
      } catch (error) {
        console.error("Error creating collection:", error);
      }
    }
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { collections, newCollectionName, newCollectionDescription } = this.state;

    return (
      <div className="ManageCollections">
        <h1>Manage Collections</h1>
        <div className="create-collection">
          <input
            type="text"
            name="newCollectionName"
            value={newCollectionName}
            onChange={this.handleInputChange}
            placeholder="New collection name"
          />
          <input
            type="text"
            name="newCollectionDescription"
            value={newCollectionDescription}
            onChange={this.handleInputChange}
            placeholder="New collection description"
          />
          <button onClick={this.handleCreateCollection}>Create Collection</button>
        </div>
        <div className="collections-list">
          {collections.map((collection) => (
            <div key={collection.id} className="collection">
              <h2>{collection.name}</h2>
              <p>{collection.description}</p>
              <ul>
                {collection.files && collection.files.map((file) => (
                  <li key={file.id}>{file.meta.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ManageCollections;