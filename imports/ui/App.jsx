import React, { useState, useEffect } from 'react';
import { storage } from './firebase/firebase';
import { 
  ref,
  uploadBytes, 
  listAll, 
  getDownloadURL,  
} from 'firebase/storage';

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([])

  const imageListRef = ref(storage, "images/")
  const uploadFile = () => {
    if(imageUpload==null) return;
    const imageRef = ref(storage, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot)=>{
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url])
      })
    })
  }

  useEffect(() => {
    listAll(imageListRef).then((response)=>{
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url])
        })
      })
    })
  }, [])
  return (
    <div className="App">
        <input type='file' onChange={(event) => {setImageUpload(event.target.files[0])}} />
        <button onClick={uploadFile}>Upload Image</button>
        {imageUrls.map((url, index) => {
          return <img alt={index} src={url} />
        })}
    </div>
  )
}

export default App