import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../common/api/url";

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewURL] = useState(null);
  
    const handleFileOnChange = (event) => {
        event.preventDefault();
        let file = event.target.files[0];
        let reader = new FileReader();
    
        reader.onloadend = (e) => {
          setFile(file);
          setPreviewURL(reader.result);
        };
        if (file) reader.readAsDataURL(file);
      };
    
    const imageUploadHandler = (event) => {
        event.preventDefault()
        const formData = new FormData()
        formData.set('file', file)

        axios.post(API_URL + 'gallery', formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
        }).then((res)=>{
        })
    }
    return <div>
        <form onSubmit={imageUploadHandler}>
        <input type="file" accept='image/*' onChange={handleFileOnChange} />
        {file && <img src={previewUrl} alt="preview" />}
        <button type="submit">전송</button>
        </form>
    </div>
}

export default ImageUpload